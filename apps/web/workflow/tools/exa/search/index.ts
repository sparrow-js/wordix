import Exa from "exa-js";

type Props = {
  query: string;
};

// Response type same as HTTP outputs
type Response = Promise<{
  result: string;
}>;

const main = async (props: Props): Response => {
  const { query } = props;
  try {
    const exa = new Exa(process.env.EXA_API_KEY);

    const result = await exa.searchAndContents(query, {
      text: true,
    });

    return {
      result: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);
    return {
      result: error || "Failed to fetch data from DuckDuckGo",
    };
  }
};

export default main;
