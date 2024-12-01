export const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
];

export const tools = [
  {
    title: "RAG / Search",
    children: [
      {
        id: "exa-search",
        label: "Exa -- Search",
        value: false,
      },
      {
        id: "google-search",
        label: "Google search",
        value: false,
      },
      {
        id: "wikipedia-search",
        label: "Wikipedia search",
        value: false,
      },
      {
        id: "you-search",
        label: "You.com search",
        value: false,
      },
    ],
  },
  {
    title: "Generate multimedia",
    children: [
      {
        id: "post-to-image",
        label: "Post to image",
        value: false,
      },
      {
        id: "speech-synthesis",
        label: "Speech synthesis (Elevenlabs)",
        value: false,
      },
    ],
  },
  {
    title: "Speech to Text",
    children: [
      {
        id: "whisper-replicate",
        label: "Speech to text (Whisper Replicate)",
        value: false,
      },
    ],
  },
  {
    title: "Image Analysis",
    children: [
      {
        id: "image-description",
        label: "Detailed image description",
        value: false,
      },
    ],
  },
  {
    title: "Web scraping",
    children: [
      {
        id: "firecrawl",
        label: "FireCrawl Scrape",
        value: false,
      },
    ],
  },
  {
    title: "APIs",
    children: [
      {
        id: "weather-api",
        label: "Weather report API",
        value: false,
      },
    ],
  },
  {
    title: "Other",
    children: [
      {
        id: "exa-contents",
        label: "Exa -- GetContents",
        value: false,
      },
      {
        id: "long-term-memory",
        label: "Long term memory (with Mem0)",
        value: false,
      },
      {
        id: "mixture-agents",
        label: "Mixture of Agents",
        value: false,
      },
    ],
  },
];

export const projects = [
  { title: "Untitled", timeAgo: "15 hours ago", initial: "U" },
  { title: "Getting started 👋 (click me!)", timeAgo: "3 days ago", initial: "G" },
  { title: "Getting started 👋 (click me!)", timeAgo: "17 days ago", initial: "G" },
  { title: "Project from Start-up Landing Page Generator", timeAgo: "18 days ago", initial: "P" },
  { title: "Project from Untitled", timeAgo: "21 days ago", initial: "P" },
];

export const deployments = [
  {
    title: "Hello world 👋🌍 - EXTENSION",
    timeAgo: "7 days ago",
    imageUrl: "gradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png",
  },
  {
    title: "八卦易经",
    timeAgo: "13 days ago",
    imageUrl: "gradient-OEl9opodmYMqLJaIPT3QNlMsIPrubo.png",
  },
  {
    title: "a. If-else intro 🔀",
    timeAgo: "17 days ago",
    imageUrl: "gradient-Jwg29xKYK79i1jjeCzo99mEssJRt1s.png",
  },
  {
    title: "c. Loop 😵‍💫",
    timeAgo: "18 days ago",
    imageUrl: "gradient-LgKdlvGsWLz1TQi9DkacNk5lvVQ6UK.png",
  },
  {
    title: "Hello world 👋🌍 - EXTENSION",
    timeAgo: "21 days ago",
    imageUrl: "gradient-G4R9X5xSoDNYYszgst424mNoBek8n5.png",
  },
];
