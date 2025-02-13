import Exa from "exa-js";

type Props = {
  domain: string;
};

// Response type same as HTTP outputs
type Response = Promise<{
  result: string;
}>;

const main = async (props: Props): Response => {
  const { domain } = props;
  try {
    const exa = new Exa(process.env.EXA_API_KEY);

    const result = await exa.findSimilar(domain, {
      excludeDomains: [domain],
      numResults: 10,
    });

    return {
      result: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);
    return {
      result: error || "Failed to find similar domains",
    };
  }
};

export default main;
