export function convertAmountFromLowestUnit(amount: string, currency: string) {
  switch (currency) {
    case "JPY":
    case "KRW":
      return Number.parseFloat(amount);
    default:
      return Number.parseFloat(amount) / 100;
  }
}

export function parseMoney(amount = "0", currency = "USD") {
  const parsedAmount = convertAmountFromLowestUnit(amount, currency);
  return formatMoney(parsedAmount, currency);
}

export function formatMoney(amount = 0, currency = "USD") {
  const language = typeof navigator !== "undefined" ? navigator.language : "en-US";
  return new Intl.NumberFormat(language ?? "en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
