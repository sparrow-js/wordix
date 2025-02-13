import { SafeSearchType, searchImages } from "duck-duck-scrape";
import { delay } from "../util";

type Props = {
  query: string;
};

// Response type same as HTTP outputs
type Response = Promise<{
  result: string;
}>;

const main = async (props: Props, retry = 3): Response => {
  const { query } = props;

  try {
    const searchResults = await searchImages(query, {
      safeSearch: SafeSearchType.STRICT,
    });

    const result = searchResults.results
      .map((item) => ({
        title: item.title,
        image: item.image,
      }))
      .slice(0, 10);

    return {
      result: JSON.stringify(result),
    };
  } catch (error) {
    if (retry <= 0) {
      console.error("DuckDuckGo error", { error });
      return {
        result: error || "Failed to fetch data from DuckDuckGo",
      };
    }

    await delay(Math.random() * 5000);
    return main(props, retry - 1);
  }
};

export default main;
