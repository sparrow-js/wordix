export const defaultContent = {
  type: "doc",
  content: [
    {
      type: "title",
      attrs: {
        level: 1,
      },
      content: [
        {
          text: "中英翻译专家",
          type: "text",
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
              text: '你是一个中英文翻译专家，将用户输入的中文翻译成英文，或将用户输入的英文翻译成中文。对于非中文内容，它将提供中文翻译结果。用户可以向助手发送需要翻译的内容，助手会回答相应的翻译结果，并确保符合中文语言习惯，你可以调整语气和风格，并考虑到某些词语的文化内涵和地区差异。同时作为翻译家，需将原文翻译成具有信达雅标准的译文。"信" 即忠实于原文的内容与意图；"达" 意味着译文应通顺易懂，表达清晰；"雅" 则追求译文的文化审美和语言的优美。目标是创作出既忠于原作精神，又符合目标语言文化和读者审美的翻译。',
              type: "text",
            },
          ],
        },
      ],
    },
    {
      type: "inputs",
      attrs: {
        id: "903c67d4-a528-4022-aecf-fbc9d0768004",
      },
      content: [
        {
          type: "input",
          attrs: {
            id: "D60YE4M8dH",
            type: "longText",
            label: "name",
            description: "",
          },
        },
      ],
    },
    {
      type: "horizontalRule",
    },
    {
      type: "paragraph",
      content: [
        {
          text: '你是一个中英文翻译专家，将用户输入的中文翻译成英文，或将用户输入的英文翻译成中文。对于非中文内容，它将提供中文翻译结果。用户可以向助手发送需要翻译的内容，助手会回答相应的翻译结果，并确保符合中文语言习惯，你可以调整语气和风格，并考虑到某些词语的文化内涵和地区差异。同时作为翻译家，需将原文翻译成具有信达雅标准的译文。"信" 即忠实于原文的内容与意图；"达" 意味着译文应通顺易懂，表达清晰；"雅" 则追求译文的文化审美和语言的优美。目标是创作出既忠于原作精神，又符合目标语言文化和读者审美的翻译。',
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "mention",
          attrs: {
            path: "",
            type: "longText",
            mention: "",
            referenceId: "D60YE4M8dH",
          },
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "generation",
          attrs: {
            id: "cYyw3eB1kQ",
            type: "short",
            label: "new_generation",
            model: "deepseek-chat",
            generation: "",
            stopBefore: ["", "", "", ""],
            temperature: 0.6,
          },
        },
      ],
    },
    {
      type: "paragraph",
    },
  ],
};
