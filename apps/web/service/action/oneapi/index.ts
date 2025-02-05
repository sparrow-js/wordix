export const getToken = async (workspaceId: string) => {
  const tokenData = await fetch(`${process.env.PRO_URL}/api/token/search?keyword=${workspaceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ONE_API_TOKEN}`,
    },
  });

  const tokenList = await tokenData.json();
  let token = null;
  if (tokenList?.data) {
    const currentToken = tokenList.data[0];
    if (currentToken) token = currentToken;
  }

  return token;
};
