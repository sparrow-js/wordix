import { createSuggestionItemsAt } from "@/components/headless/extensions";
import { CommandAt, renderItemsAt } from "@/components/headless/extensions";
import { Text } from "lucide-react";

export const suggestionAtItems = createSuggestionItemsAt([
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
]);

export const atCommand = CommandAt.configure({
  suggestion: {
    items: () => suggestionAtItems,
    render: renderItemsAt,
  },
});
