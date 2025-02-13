import Exa from "exa-js";

type Props = {
  urls: string[];
};

// Response type same as HTTP outputs
type Response = Promise<{
  result: string;
}>;

const main = async (props: Props): Response => {
  const { urls } = props;
  try {
    const exa = new Exa(process.env.EXA_API_KEY);

    const result = await exa.getContents(urls, {
      text: true,
    });

    return {
      result: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);
    return {
      result: error || "Failed to crawl URLs",
    };
  }
};

export default main;
