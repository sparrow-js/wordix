import TokenConfig from "@/workflow/ai/config/token-config";

export function renderNumber(num) {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 10000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num;
}

export function renderQuota(quota, displayInCurrency, digits = 2) {
  const quotaPerUnit = Number.parseFloat(String(TokenConfig.siteInfo.quota_per_unit || "500000"));
  if (displayInCurrency) {
    return `$${(quota / quotaPerUnit).toFixed(digits)}`;
  }
  return renderNumber(quota);
}
