import { IfElseHandler } from "./IfElseHandler";
import { LoopHandler } from "./LoopHandler";
import { GenerationHandler } from "./GenerationHandler";
import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";
import { agenticWorkflowJson } from "./AgenticWorkflowJson";
import { ToolCallingAgent } from "../smolagents.ts/agents";
import OpenAI from 'openai';
import { LogLevel } from '../smolagents.ts/monitoring';
import { Tool } from '../smolagents.ts/tools';
import { DocumentProcessor } from "../processors/DocumentProcessor";
import prisma from "@/backend/prisma";

const { setGlobalDispatcher, ProxyAgent } = require("undici");
const dispatcher = new ProxyAgent({ uri: new URL("http://127.0.0.1:7890").toString() });
//全局fetch调用启用代理
setGlobalDispatcher(dispatcher);
const client = new OpenAI({
    apiKey: "sk-Yuxzg619EfPAnyd6rJ6el5xfQQzwFxI1HxS9vBfMC4bnqd2p", // This is the default and can be omitted
    baseURL: "https://api.openai-proxy.org/v1",
  });


class ToolWrapper extends Tool {
    context: ProcessingContext;
    documents: any[];
    constructor(params: {name: string; description: string; inputs: any; output_type: string}, context: ProcessingContext, documents: any[]) {
        super(params);
        this.context = context;
        this.documents = documents;
    }

    async execute(args: any, tool_name: string): Promise<any> {
        const document = this.documents.find(doc => doc.id === tool_name);


        const processor = new DocumentProcessor(this.context.onStop, this.context.onStreamResponse, {
            variables: this.context.variables,
            depth: this.context.depth,
            path: [...this.context.path],
            markdown: [...this.context.markdown],
            apiKey: this.context.apiKey,
            workspaceId: this.context.workspaceId,
        });
        const contentDoc: DocNode = document.content;
        await processor.processNode(contentDoc, args);


        const context = processor.getContext();

        // Filter out empty lines and join remaining markdown
        const filteredMarkdown = context.markdown
            .filter(line => line.trim() !== '')
            .join(' ');


        return filteredMarkdown;
    }

    forward(args: any, tool_name: string): Promise<any> {
        return this.execute(args, tool_name);
    }
}

export class AgenticWorkflow extends BaseHandler{
  private handlers: Map<string, any>;

  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    console.log("AgenticWorkflow before");
  }



  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    
    // Extract model information
    const modelNode = node.content.find(item => item.type === 'agentModel');
 
    await context.onStreamResponse({ event: "node_agenticworkflow_started", data: modelNode.attrs.id, stream: true });

    // Extract tool information
    const toolNode = node.content.find(item => item.type === 'agentTool');
    const toolList = toolNode ? toolNode.content : [];
    console.log('ToolList:', toolNode);


    // Extract promptIds from toolList
    const promptIds = toolList.map((tool: any) => tool.attrs?.promptId).filter(Boolean);
    
    // Query documents from database using promptIds
    const documents = await prisma.document.findMany({
      where: {
        id: {
          in: promptIds
        }
      },
      select: {
        id: true,
        title: true,
        content: true
      }
    });

    // Convert toolList to OpenAI function calling format
    const convertedTools = toolList.map((tool: any) => ({
      type: "function",
      function: {
        name: tool.attrs?.promptId,
        description: tool.attrs?.description,
        parameters: {
          type: "object",
          properties: Object.entries(tool.attrs.parameters).reduce((acc, [key, param]: [string, any]) => {
            acc[key] = {
              type: 'string',
              description: param.value || '',
            };
            return acc;
          }, {}),
          required: Object.keys(tool.attrs.parameters)
        }
      }
    }));

    const client = new OpenAI({
        apiKey: "sk-AQr4oRAh4soDE7KvrkB2MmTL5O7zeCf7z1QzmhwflD10flIr", // This is the default and can be omitted
        baseURL: "https://api.openai-proxy.org/v1",
      });
    

    const agent = new ToolCallingAgent(
        [
            ...convertedTools.map(tool => {
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
                }, context, documents);
            }), 
        ],
        async (messages) => {
            const response = await client.chat.completions.create({
                model: "gpt-4o",
                messages: messages as any,
                tools: convertedTools.map(tool => ({
                    type: "function" as const,
                    function: tool.function
                })),
                stop: ["Observation:"],
                tool_choice: "required"
            });
    
            return response.choices[0].message as any;
        },
        {
            max_steps: 3,
            verbosity_level: LogLevel.INFO,
            planning_interval: undefined,
            additional_authorized_imports: [],
            use_e2b_executor: false
        }
      );

      const filteredMarkdown = context.markdown
      .filter(line => line.trim() !== '')
      .join(' ');

     await agent.run(filteredMarkdown)
     await context.onStreamResponse({ event: "node_agenticworkflow_finished", data: modelNode.attrs.id, stream: true });
  }


  /**
   * 处理工作流节点
   */
  async processNode(node: DocNode, context: ProcessingContext): Promise<void> {
   
  }

  /**
   * 将节点转换为 Markdown
   */
  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    return "";
  }

}
