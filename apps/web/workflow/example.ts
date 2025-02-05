import { DocumentProcessor } from "./processors/DocumentProcessor";
import type { DocNode } from "./types/DocNode";

export async function processDocument() {
  const document: DocNode = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: {
          level: 1,
        },
        content: [
          {
            type: "text",
            text: " ➡️ START HERE ⬅️",
          },
        ],
      },
      {
        type: "description",
        attrs: {
          class: "description",
        },
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "A warm welcome to Wordix 🎉🕺",
              },
            ],
          },
        ],
      },
      {
        type: "inputs",
        attrs: {
          inputs: [],
          test: 1,
        },
        content: [
          {
            type: "input",
            attrs: {
              id: "2ca29f17-825b-4e60-85c3-eceb43ddf562",
              label: "whatever",
              description: "Enter the name of the person to say hello to",
              type: "text",
            },
          },
        ],
      },
      {
        type: "horizontalRule",
      },
      {
        type: "heading",
        attrs: {
          level: 2,
        },
        content: [
          {
            type: "text",
            text: "Hello! 👋",
          },
        ],
      },
      {
        type: "bulletList",
        attrs: {
          tight: false,
        },
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "You've made an excellent decision choosing Wordix. ",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "I am Filip, and I am the CEO of Wordix. ",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "On your left, you will see a list of folders that explain the app's functionality. ",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: " test",
                  },
                ],
              },
              {
                type: "tool",
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "mention",
            attrs: {
              mention: "",
              referenceId: "2ca29f17-825b-4e60-85c3-eceb43ddf562",
              type: "input",
            },
          },
          {
            type: "text",
            text: "When you type @ ",
            stop: true,
          },
          {
            type: "mention",
            attrs: {
              mention: "",
              referenceId: "2ca29f17-825b-4e60-85c3-eceb43ddf562",
              type: "input",
            },
          },
          {
            type: "text",
            text: ' , it creates an input variable into the "Flow" —this is what we call functions.',
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "generation",
            attrs: {
              generation: "",
              id: "6a0852c1-eaa4-4369-b50e-af9ad7867866",
              label: "new_generation",
              temperature: 0.6,
              model: "gpt-4o",
              type: "short",
              stopBefore: ["", "", "", ""],
            },
          },
          {
            type: "text",
            text: "(⬆️ all of the above is the prompt for this generation)",
          },
          {
            type: "hardBreak",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "hello world ",
          },
          {
            type: "generation",
            attrs: {
              generation: "",
              id: "6a0852c1-eaa4-4369-b50e-af9ad7867866",
              label: "new_generation",
              temperature: 0.6,
              model: "gpt-4o",
              type: "short",
              stopBefore: ["", "", "", ""],
            },
          },
        ],
      },
    ],
  };
  // 第一次执行
  const processor = new DocumentProcessor(
    // onStop 回调
    async (node) => {
      // console.log("Stopped at node:", node.type);
      // console.log("Node state:", processor.getNodeState(node));
    },
    // workflowStreamResponse 回调
    async (response: any) => {
      // console.log("Stream response:", {
      //   type: response.type,
      //   nodeType: response.node.type,
      //   timestamp: new Date(response.timestamp).toISOString(),
      // });
    },
  );
  try {
    // 第一次处理
    await processor.processNode(document);
    // 检查是否停止
    if (processor.isProcessingStopped()) {
      // 捕获完整状态
      const processorState = processor.captureState();
      console.log("Captured State:", {
        variables: Array.from(processorState.variables.entries()),
        depth: processorState.depth,
        path: processorState.path,
        markdown: processorState.markdown,
      });
      // 准备输入数据
      const inputData = {
        userInput: "Some input data",
        timestamp: Date.now(),
      };
      // 使用恢复的状态创建新的处理器
      const resumedProcessor = DocumentProcessor.restore(
        document,
        processorState,
        // onStop 回调
        async (node) => {
          console.log("Resumed - Stopped at node:", node.type);
        },
        // workflowStreamResponse 回调
        async (response: any) => {
          // console.log("Resumed stream response:", {
          //   type: response.type,
          //   nodeType: response.node.type,
          //   timestamp: new Date(response.timestamp).toISOString(),
          // });
        },
      );
      // 继续处理
      await resumedProcessor.processNode(document, inputData);
    }
    // 打印最终节点状态
    console.log("Final node states:");
    const printNodeStates = (node: DocNode) => {
      console.log(`${node.type}:`, processor.getNodeState(node));
      node.content?.forEach(printNodeStates);
    };
    printNodeStates(document);
  } catch (error) {
    console.error("Processing error:", error);
  }
}

// 立即执行
processDocument().catch(console.error);
