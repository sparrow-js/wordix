import { AgentAudio } from "./agent_types";
import { BASE_BUILTIN_MODULES, BASE_PYTHON_TOOLS, evaluatePythonCode } from "./local_python_executor";
import { PipelineTool, Tool } from "./tools";

interface PreTool {
  name: string;
  inputs: { [key: string]: string };
  outputType: any;
  task: string;
  description: string;
  repoId: string;
}

class PythonInterpreterTool extends Tool {
  name = "python_interpreter";
  description = "This is a tool that evaluates python code. It can be used to perform calculations.";
  inputs = {
    code: {
      type: "string",
      description: "The python code to run in interpreter",
    },
  };
  outputType = "string";
  private authorizedImports: string[];
  private basePythonTools = BASE_PYTHON_TOOLS;
  private pythonEvaluator = evaluatePythonCode;

  constructor(authorizedImports?: string[]) {
    super();
    if (authorizedImports === undefined) {
      this.authorizedImports = Array.from(new Set(BASE_BUILTIN_MODULES));
    } else {
      this.authorizedImports = Array.from(new Set([...BASE_BUILTIN_MODULES, ...authorizedImports]));
    }
  }

  forward(code: string): string {
    const state: any = {};
    const output = String(
      this.pythonEvaluator(code, {
        state,
        staticTools: this.basePythonTools,
        authorizedImports: this.authorizedImports,
      })[0],
    );
    return `Stdout:\n${String(state["_print_outputs"])}\nOutput: ${output}`;
  }
}

class FinalAnswerTool extends Tool {
  name = "final_answer";
  description = "Provides a final answer to the given problem.";
  inputs = {
    answer: {
      type: "any",
      description: "The final answer to the problem",
    },
  };
  outputType = "any";

  forward(answer: any): any {
    return answer;
  }
}

class UserInputTool extends Tool {
  name = "user_input";
  description = "Asks for user's input on a specific question";
  inputs = {
    question: {
      type: "string",
      description: "The question to ask the user",
    },
  };
  outputType = "string";

  forward(question: string): string {
    const userInput = prompt(`${question} => Type your answer here:`) || "";
    return userInput;
  }
}

class DuckDuckGoSearchTool extends Tool {
  name = "web_search";
  description = `Performs a DuckDuckGo web search based on your query (think a Google search) then returns the top search results.`;
  inputs = {
    query: {
      type: "string",
      description: "The search query to perform.",
    },
  };
  outputType = "string";
  private maxResults: number;
  private ddgs: any;

  constructor(maxResults = 10, options: any = {}) {
    super();
    this.maxResults = maxResults;
    try {
      const { DDGS } = require("duckduckgo_search");
      this.ddgs = new DDGS(options);
    } catch (err) {
      throw new Error(
        "You must install package `duckduckgo_search` to run this tool: for instance run `npm install duckduckgo_search`.",
      );
    }
  }

  forward(query: string): string {
    const results = this.ddgs.text(query, { maxResults: this.maxResults });
    if (results.length === 0) {
      throw new Error("No results found! Try a less restrictive/shorter query.");
    }
    const postprocessedResults = results.map((result: any) => `[${result.title}](${result.href})\n${result.body}`);
    return `## Search Results\n\n${postprocessedResults.join("\n\n")}`;
  }
}

class GoogleSearchTool extends Tool {
  name = "web_search";
  description = `Performs a Google web search for your query then returns a string of the top search results.`;
  inputs = {
    query: {
      type: "string",
      description: "The search query to perform.",
    },
    filterYear: {
      type: "number",
      description: "Optionally restrict results to a certain year",
      nullable: true,
    },
  };
  outputType = "string";
  private serpapiKey: string | undefined;

  constructor() {
    super();
    this.serpapiKey = process.env.SERPAPI_API_KEY;
  }

  async forward(query: string, filterYear?: number): Promise<string> {
    if (!this.serpapiKey) {
      throw new Error("Missing SerpAPI key. Make sure you have 'SERPAPI_API_KEY' in your env variables.");
    }

    const params: any = {
      engine: "google",
      q: query,
      api_key: this.serpapiKey,
      google_domain: "google.com",
    };
    if (filterYear !== undefined) {
      params.tbs = `cdr:1,cd_min:01/01/${filterYear},cd_max:12/31/${filterYear}`;
    }

    const response = await fetch("https://serpapi.com/search.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (response.status === 200) {
      const results = await response.json();
      if (!results.organic_results || results.organic_results.length === 0) {
        const yearFilterMessage = filterYear ? ` with filter year=${filterYear}` : "";
        return `No results found for '${query}'${yearFilterMessage}. Try with a more general query, or remove the year filter.`;
      }

      const webSnippets = results.organic_results.map((page: any, idx: number) => {
        const datePublished = page.date ? `\nDate published: ${page.date}` : "";
        const source = page.source ? `\nSource: ${page.source}` : "";
        const snippet = page.snippet ? `\n${page.snippet}` : "";
        return `${idx}. [${page.title}](${page.link})${datePublished}${source}${snippet}`;
      });

      return `## Search Results\n${webSnippets.join("\n\n")}`;
    } else {
      throw new Error(await response.json());
    }
  }
}

class VisitWebpageTool extends Tool {
  name = "visit_webpage";
  description = `Visits a webpage at the given url and reads its content as a markdown string. Use this to browse webpages.`;
  inputs = {
    url: {
      type: "string",
      description: "The url of the webpage to visit.",
    },
  };
  outputType = "string";

  async forward(url: string): Promise<string> {
    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Error fetching the webpage: ${response.statusText}`);
      }
      const markdownify = require("markdownify");
      let markdownContent = markdownify(await response.text()).trim();
      markdownContent = markdownContent.replace(/\n{3,}/g, "\n\n");
      return markdownContent.substring(0, 10000);
    } catch (err: any) {
      return `Error: ${err.message}`;
    }
  }
}

class SpeechToTextTool extends PipelineTool {
  static defaultCheckpoint = "openai/whisper-large-v3-turbo";
  description = "This is a tool that transcribes an audio into text. It returns the transcribed text.";
  name = "transcriber";
  private preProcessor: any;
  private model: any;

  constructor() {
    super();
    const { WhisperProcessor, WhisperForConditionalGeneration } = require("transformers");
    this.preProcessor = new WhisperProcessor.from_pretrained(SpeechToTextTool.defaultCheckpoint);
    this.model = new WhisperForConditionalGeneration.from_pretrained(SpeechToTextTool.defaultCheckpoint);
  }

  encode(audio: any): any {
    audio = new AgentAudio(audio).to_raw();
    return this.preProcessor(audio, { returnTensors: "pt" });
  }

  forward(inputs: any): any {
    return this.model.generate(inputs["input_features"]);
  }

  decode(outputs: any): string {
    return this.preProcessor.batchDecode(outputs, { skipSpecialTokens: true })[0];
  }
}

const TOOL_MAPPING: { [key: string]: any } = {
  python_interpreter: PythonInterpreterTool,
  web_search: DuckDuckGoSearchTool,
  visit_webpage: VisitWebpageTool,
};

export {
  PythonInterpreterTool,
  FinalAnswerTool,
  UserInputTool,
  DuckDuckGoSearchTool,
  GoogleSearchTool,
  VisitWebpageTool,
  SpeechToTextTool,
};
