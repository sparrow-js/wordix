import type { ToolResult } from "../../types";
import { BaseTool } from "../baseTool";
import { urlsFetch } from "./cheerio";

export class WebscrapeTool extends BaseTool {
  async execute(
    input: {
      url: string;
      selector?: string;
    },
    node: any,
  ): Promise<ToolResult<any>> {
    const result = await urlsFetch({
      urlList: [input.url],
      selector: input.selector || "body",
    });

    this.context.onStreamResponse({
      event: "message",
      data: `\n ${result[0].content}`,
      stream: true,
    });

    this.context.variables.set(node.attrs.id, {
      id: node.attrs.id,
      type: "tool",
      value: {
        output: `\n ${result[0].content}`,
      },
    });

    return {
      type: "webscrape",
      content: "",
      timestamp: Date.now(),
    };
  }

  async validate(input: any): Promise<boolean> {
    return typeof input === "object";
  }
}
