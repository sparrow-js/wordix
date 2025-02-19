import { CodeAgent, ToolCallingAgent } from './agents';
import { Tool } from './tools';
import { LogLevel } from './monitoring';
import OpenAI from 'openai';
import { tools } from './prompts/tool-schema';
// const { setGlobalDispatcher, ProxyAgent } = require("undici");
// const dispatcher = new ProxyAgent({ uri: new URL("http://127.0.0.1:7890").toString() });
// //全局fetch调用启用代理
// setGlobalDispatcher(dispatcher);
const client = new OpenAI({
    apiKey: "sk-Yuxzg619EfPAnyd6rJ6el5xfQQzwFxI1HxS9vBfMC4bnqd2p", // This is the default and can be omitted
    baseURL: "https://api.openai-proxy.org/v1",
  });

export function initializeAgent(
  tools: Tool[],
  modelFn: (messages: any[]) => any,
  config: {
    maxSteps?: number;
    verbosityLevel?: LogLevel;
    planningInterval?: number;
    additionalAuthorizedImports?: string[];
    useE2bExecutor?: boolean;
  } = {}
) {
  const agentConfig = {
    max_steps: config.maxSteps || 6,
    verbosity_level: config.verbosityLevel || LogLevel.INFO,
    planning_interval: config.planningInterval || undefined,
    additional_authorized_imports: config.additionalAuthorizedImports || [],
    use_e2b_executor: config.useE2bExecutor || false
  };

//   const agent = new CodeAgent(
//     tools,
//     modelFn,
//     agentConfig
//   );

  const agent = new ToolCallingAgent(
    tools,
    modelFn,
    agentConfig
  );

  

  return agent;
}


export class GetWeatherTool extends Tool {
  
    async execute(location : any): Promise<string> {
      try {
        const units = "m"; // Using Fahrenheit by default
        const url = `http://api.weatherstack.com/current?access_key=ef7511aecf6d2a94afbd1bff6e92e639&query=${encodeURIComponent(location)}&units=${units}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          return `Error: ${data.error.info || 'Unable to fetch weather data.'}`;
        }
        
        const weather = data.current.weather_descriptions[0];
        const temp = data.current.temperature;
        
        return `The current weather in ${location} is ${weather} with a temperature of ${temp} °C.`;
      } catch (error) {
        return `Error fetching weather data: ${error}`;
      }
    }

    forward(city: string): Promise<string> {
      return this.execute(city);
    }
}

export class GetNewsHeadlinesTool extends Tool {
    async execute(): Promise<string> {
        try {
            
            const url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=546bd0dc770d41f9b5be21b4cbdd3eaa";
            
            const response = await fetch(url, {
                headers: {
                    "method": "GET",
                    "X-Api-Key": "546bd0dc770d41f9b5be21b4cbdd3eaa",
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const articles = data.articles;

            if (!articles || articles.length === 0) {
                return "No news available at the moment.";
            }

            const headlines = articles
                .slice(0, 5)
                .map((article: {title: string; source: {name: string}}) => `${article.title} - ${article.source.name}`);
                
            return headlines.join("\n");

        } catch (error) {
            return `Error fetching news data: ${error}`;
        }
    }

    forward(): Promise<string> {
        return this.execute();
    }
}


class ToolWrapper extends Tool {
    constructor(params: {name: string; description: string; inputs: any; output_type: string}) {
        super(params);
    }

    async execute(args: any): Promise<any> {
        return '';
    }

    forward(args: any): Promise<any> {
        return this.execute(args);
    }
}

const agent = initializeAgent(
    [
        ...tools.map(tool => {
            const tool_params = tool.function;
            return new ToolWrapper({
                name: tool_params.name, 
                description: tool_params.description, 
                inputs: JSON.stringify( Object.entries(tool_params.parameters.properties).reduce((acc, [key, value]: [string, any]) => ({
                    ...acc,
                    [key]: {
                        type: value.type,
                        description: value.description
                    }
                }), {})),
                output_type: "string"
            });
        }), 
        new GetWeatherTool({name: "get_weather", description: "Get the current weather at the given location using the WeatherStack API.", inputs: {location: {type: "string", description: "The location (city name)"}}, output_type: "string"}),
        new GetNewsHeadlinesTool({name: "get_news_headlines", description: "Fetches the top news headlines from the News API for the United States.\nThis function makes a GET request to the News API to retrieve the top news headlines\nfor the United States. It returns the titles and sources of the top 5 articles as a\nformatted string. If no articles are available, it returns a message indicating that\nno news is available. In case of a request error, it returns an error message.", inputs: {}, output_type: "string"})
    ], 
    async (messages) => {
        const response = await client.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            tools: tools.map(tool => ({
                type: "function" as const,
                function: tool.function
            })),
            stop: ["Observation:"],
            tool_choice: "required"
        });


        return response.choices[0].message;
    }, 
    {
        maxSteps: 6,
        verbosityLevel: LogLevel.INFO,
        planningInterval: undefined,
        additionalAuthorizedImports: [],
        useE2bExecutor: false
    });

// agent.run("What is the weather in New York?");
agent.run("Give me the top news headlines")
