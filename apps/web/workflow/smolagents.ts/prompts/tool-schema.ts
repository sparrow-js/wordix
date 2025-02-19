export const tools = [
    {
      "type": "function",
      "function": {
        "name": "convert_currency",
        "description": "Converts a specified amount from one currency to another using the ExchangeRate-API.",
        "parameters": {
          "type": "object",
          "properties": {
            "amount": {
              "type": "number",
              "description": "The amount of money to convert."
            },
            "from_currency": {
              "type": "string",
              "description": "The currency code of the currency to convert from (e.g., 'USD')."
            },
            "to_currency": {
              "type": "string",
              "description": "The currency code of the currency to convert to (e.g., 'EUR')."
            }
          },
          "required": [
            "amount",
            "from_currency",
            "to_currency"
          ]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get the current weather at the given location using the WeatherStack API.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The location (city name)."
            },
            "celsius": {
              "type": "boolean",
              "nullable": true,
              "description": "Whether to return the temperature in Celsius (default is False, which returns Fahrenheit)."
            }
          },
          "required": [
            "location"
          ]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_news_headlines",
        "description": "Fetches the top news headlines from the News API for the United States.\nThis function makes a GET request to the News API to retrieve the top news headlines\nfor the United States. It returns the titles and sources of the top 5 articles as a\nformatted string. If no articles are available, it returns a message indicating that\nno news is available. In case of a request error, it returns an error message.",
        "parameters": {
          "type": "object",
          "properties": {},
          "required": []
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_joke",
        "description": "Fetches a random joke from the JokeAPI.\nThis function sends a GET request to the JokeAPI to retrieve a random joke.\nIt handles both single jokes and two-part jokes (setup and delivery).\nIf the request fails or the response does not contain a joke, an error message is returned.",
        "parameters": {
          "type": "object",
          "properties": {},
          "required": []
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_random_fact",
        "description": "Fetches a random fact from the \"uselessfacts.jsph.pl\" API.",
        "parameters": {
          "type": "object",
          "properties": {},
          "required": []
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "search_wikipedia",
        "description": "Fetches a summary of a Wikipedia page for a given query.",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "The search term to look up on Wikipedia."
            }
          },
          "required": [
            "query"
          ]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "final_answer",
        "description": "Provides a final answer to the given problem.",
        "parameters": {
          "type": "object",
          "properties": {
            "answer": {
              "type": "string",
              "description": "The final answer to the problem"
            }
          },
          "required": [
            "answer"
          ]
        }
      }
    }
  ]