export const agenticWorkflowJson = {
    "type": "agenticWorkflow",
    "attrs": {
      "id": "v64kf1wDJA",
      "label": "Agentic Workflow",
      "state": "default"
    },
    "content": [
      {
        "type": "agentModel",
        "attrs": {
          "id": "GYDHqWrZTd",
          "type": "agent",
          "label": "Model",
          "model": "gpt-4o"
        },
        "content": [
          {
            "type": "paragraph"
          }
        ]
      },
      {
        "type": "agentTool",
        "attrs": {
          "id": "fyuZL81B6D",
          "label": "tool",
          "state": {}
        },
        "content": [
          {
            "type": "toolWorkflow",
            "attrs": {
              "id": "S99nJLxc_m",
              "type": "workflow",
              "label": "workflow",
              "flowLabel": "get weather",
              "promptId": "e8a6780d-9ff2-4f24-8651-a48c949f9d07",
              "description": "Get the current weather at the given location using the WeatherStack API.",
              "parameters": {
                "WjeICknwJ0": {
                  "type": "literal",
                  "value": "The location (city name)."
                }
              }
            },
            "content": [
              {
                "type": "paragraph"
              }
            ]
          }
        ]
      }
    ]
  }