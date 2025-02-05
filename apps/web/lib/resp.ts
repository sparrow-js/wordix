export function respData(data: any, pagination?: { total: number }) {
  return respJson(0, "ok", data || [], pagination);
}

export function respOk() {
  return respJson(0, "ok");
}

export function respErr(message: string) {
  return respJson(-1, message);
}

export function respJson(code: number, message: string, data?: any, pagination?: { total: number }) {
  const json = {
    code: code,
    message: message,
    data: data,
  };
  if (data) {
    json["data"] = data;
  }
  if (pagination) {
    json["pagination"] = pagination;
  }

  return Response.json(json);
}
