export const defaultEditorContent = {
  "type": "doc",
  "content": [
      {
          "type": "title",
          "attrs": {
              "level": 1
          },
          "content": [
              {
                  "text": "Hello world 👋🌍 - EXTENSION",
                  "type": "text"
              }
          ]
      },
      {
          "type": "description",
          "content": [
              {
                  "type": "paragraph",
                  "content": [
                      {
                          "text": "An example of the extension, ",
                          "type": "text"
                      },
                      {
                          "text": "try doing it yourself before peeking!",
                          "type": "text",
                          "marks": [
                              {
                                  "type": "bold",
                                  "attrs": {}
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "paragraph",
                  "content": [
                      {
                          "text": "We add a new 'style' input and tell the model to use that style by referencing that value in the prompt using ",
                          "type": "text"
                      },
                      {
                          "text": "@style",
                          "type": "text",
                          "marks": [
                              {
                                  "type": "code",
                                  "attrs": {}
                              }
                          ]
                      },
                      {
                          "text": ".",
                          "type": "text"
                      }
                  ]
              }
          ]
      },
      {
          "type": "inputs",
          "content": [
              {
                  "type": "input",
                  "attrs": {
                      "id": "2ca29f17-825b-4e60-85c3-eceb43ddf562",
                      "type": "text",
                      "label": "name",
                      "description": "Enter the name of the person to say hello to"
                  }
              },
              {
                  "type": "input",
                  "attrs": {
                      "id": "36562205-8c48-46f9-b447-7ca58cca9e3d",
                      "type": "text",
                      "label": "style",
                      "description": "e.g. 'pirate', 'robot' or 'Shakespeare' "
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
                  "text": "Say hello to ",
                  "type": "text"
              },
              {
                  "type": "mention",
                  "attrs": {
                      "lastType": "text",
                      "lastLabel": "name",
                      "referenceId": "2ca29f17-825b-4e60-85c3-eceb43ddf562"
                  }
              },
              {
                  "text": ". ",
                  "type": "text"
              },
              {
                  "type": "hardBreak"
              },
              {
                  "text": "Use the following style: ",
                  "type": "text"
              },
              {
                  "type": "mention",
                  "attrs": {
                      "lastType": "text",
                      "lastLabel": "style",
                      "referenceId": "36562205-8c48-46f9-b447-7ca58cca9e3d"
                  }
              },
              {
                  "text": ".",
                  "type": "text"
              }
          ]
      },
      {
          "type": "paragraph",
          "content": [
              {
                  "type": "generation",
                  "attrs": {
                      "id": "77168b40-93bc-46d9-860b-7d5f5d338ce7",
                      "type": "full",
                      "label": "greeting",
                      "model": "gpt-3.5-turbo",
                      "state": "editing",
                      "stopBefore": "[\"\",\"\",\"\",\"\"]",
                      "temperature": "0.84",
                      "responseModel": "{}"
                  }
              }
          ]
      }
  ]
}