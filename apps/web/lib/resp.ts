export function respData(data: any, pagination?: { total: number; error?: string }, error?: string) {
  return respJson(0, "ok", data || [], pagination, error);
}

export function respOk() {
  return respJson(0, "ok");
}

export function respErr(message: string) {
  return respJson(-1, message);
}

export function respJson(code: number, message: string, data?: any, pagination?: { total: number }, error?: string) {
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

  if (error) {
    json["error"] = error;
  }

  return Response.json(json);
}
