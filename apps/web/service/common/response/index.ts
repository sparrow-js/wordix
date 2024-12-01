import { ERROR_RESPONSE, proxyError } from "@/global/common/error/errorCode";
import { replaceSensitiveText } from "@/global/common/string/tools";
import type { NextApiResponse } from "next";

export interface ResponseType<T = any> {
  code: number;
  message: string;
  data: T;
}

export const jsonRes = <T = any>(
  res: NextApiResponse,
  props?: {
    code?: number;
    message?: string;
    data?: T;
    error?: any;
    url?: string;
  },
) => {
  const { code = 200, message = "", data = null, error, url } = props || {};

  const errResponseKey = typeof error === "string" ? error : error?.message;
  // Specified error
  if (ERROR_RESPONSE[errResponseKey]) {
    return res.json(ERROR_RESPONSE[errResponseKey]);
  }

  // another error
  let msg = "";
  if ((code < 200 || code >= 400) && !message) {
    msg = error?.response?.statusText || error?.message || "请求错误";
    if (typeof error === "string") {
      msg = error;
    } else if (proxyError[error?.code]) {
      msg = "网络连接异常";
    } else if (error?.response?.data?.error?.message) {
      msg = error?.response?.data?.error?.message;
    } else if (error?.error?.message) {
      msg = error?.error?.message;
    }
  }

  res.status(code).json({
    code,
    statusText: "",
    message: replaceSensitiveText(message || msg),
    data: data !== undefined ? data : null,
  });
};

export const sseErrRes = (res: NextApiResponse, error: any) => {
  const errResponseKey = typeof error === "string" ? error : error?.message;

  // Specified error
  if (ERROR_RESPONSE[errResponseKey]) {
    return responseWrite({
      res,
      event: "error",
      data: JSON.stringify(ERROR_RESPONSE[errResponseKey]),
    });
  }

  let msg = error?.response?.statusText || error?.message || "请求错误";
  if (typeof error === "string") {
    msg = error;
  } else if (proxyError[error?.code]) {
    msg = "网络连接异常";
  } else if (error?.response?.data?.error?.message) {
    msg = error?.response?.data?.error?.message;
  } else if (error?.error?.message) {
    msg = `${error?.error?.code} ${error?.error?.message}`;
  }

  responseWrite({
    res,
    event: "error",
    data: JSON.stringify({ message: replaceSensitiveText(msg) }),
  });
};

export function responseWriteController({
  res,
  readStream,
}: {
  res: NextApiResponse;
  readStream: any;
}) {
  // res.on('drain', () => {
  //   readStream?.resume?.();
  // });

  return (text: string | Buffer) => {
    const writeResult = res.write(text);
    if (!writeResult) {
      readStream?.pause?.();
    }
  };
}

export function responseWrite({
  res,
  write,
  event,
  data,
}: {
  res?: NextApiResponse;
  write?: any;
  event?: string;
  data: any;
}) {
  if (!write) return;
  // console.log(`data: ${data} \n\n`)

  // event &&  write.write(`event: ${event}\n`);
  write.write(
    `data: ${JSON.stringify({
      event: "message",
      answer: data,
    })} \n\n`,
  );
}

export const responseWriteNodeStatus = ({
  res,
  status = "running",
  name,
}: {
  res?: NextApiResponse;
  status?: "running";
  name: string;
}) => {
  responseWrite({
    res,
    event: "flowNodeStatus",
    data: JSON.stringify({
      status,
      name,
    }),
  });
};
