export const Template = [
    {
        id: "c52d6a46-2a97-4416-9118-3586536ef68a",
        name: "塔罗牌占卜",
        description: "deepseek 2025 运势 塔罗牌占卜",
        document: {
            "type": "doc",
            "content": [
              {
                "type": "title",
                "attrs": {
                  "level": 1
                },
                "content": [
                  {
                    "text": "塔罗牌占",
                    "type": "text"
                  },
                  {
                    "text": "卜",
                    "type": "text",
                    "marks": [
                      {
                        "type": "bold"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "description",
                "attrs": {
                  "class": "description"
                },
                "content": [
                  {
                    "type": "paragraph"
                  }
                ]
              },
              {
                "type": "inputs",
                "attrs": {
                  "id": "ba5a6dd9-950e-48df-a1e8-d6cf4545eaf5"
                },
                "content": [
                  {
                    "type": "input",
                    "attrs": {
                      "id": "ua6KJ8pGyI",
                      "type": "text",
                      "label": "name",
                      "description": "名字"
                    }
                  },
                  {
                    "type": "input",
                    "attrs": {
                      "id": "kNHAhUmJEG",
                      "type": "text",
                      "label": "birthday",
                      "description": "生日"
                    }
                  },
                  {
                    "type": "input",
                    "attrs": {
                      "id": "Ym--uErXr0",
                      "type": "text",
                      "label": " life-stage",
                      "description": "你的当前生活阶段，如：事业、学习、婚姻等"
                    }
                  }
                ]
              },
              {
                "type": "horizontalRule"
              },
              {
                "type": "paragraph",
                "content": [
                  {
                    "text": "使用塔罗牌为[ ",
                    "type": "text",
                    "marks": [
                      {
                        "type": "textStyle",
                        "attrs": {
                          "color": "rgb(51, 51, 51)"
                        }
                      }
                    ]
                  },
                  {
                    "type": "mention",
                    "attrs": {
                      "path": "",
                      "type": "text",
                      "mention": "",
                      "referenceId": "ua6KJ8pGyI"
                    }
                  },
                  {
                    "text": " ]，我的出生日期是[ ",
                    "type": "text",
                    "marks": [
                      {
                        "type": "textStyle",
                        "attrs": {
                          "color": "rgb(51, 51, 51)"
                        }
                      }
                    ]
                  },
                  {
                    "type": "mention",
                    "attrs": {
                      "path": "",
                      "type": "text",
                      "mention": "",
                      "referenceId": "kNHAhUmJEG"
                    }
                  },
                  {
                    "text": " ]，当前生活阶段是[ ",
                    "type": "text",
                    "marks": [
                      {
                        "type": "textStyle",
                        "attrs": {
                          "color": "rgb(51, 51, 51)"
                        }
                      }
                    ]
                  },
                  {
                    "type": "mention",
                    "attrs": {
                      "path": "",
                      "type": "text",
                      "mention": "",
                      "referenceId": "Ym--uErXr0"
                    }
                  },
                  {
                    "text": " ]。在2025年进行占卜，关注整体运势以及关键领域（如事业、健康、财务、爱情和内心成长），探索未来的机遇与挑战，并给出具体的建议。",
                    "type": "text",
                    "marks": [
                      {
                        "type": "textStyle",
                        "attrs": {
                          "color": "rgb(51, 51, 51)"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "generation",
                    "attrs": {
                      "id": "uBchbfv5yi",
                      "type": "short",
                      "label": "new_generation",
                      "model": "deepseek-chat",
                      "generation": "",
                      "stopBefore": [
                        "",
                        "",
                        "",
                        ""
                      ],
                      "temperature": 0.6
                    }
                  }
                ]
              }
            ]
        }
    }
]