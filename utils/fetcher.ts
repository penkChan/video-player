import {
  ErrorResponse,
  FetchResponse,
  FetchError,
  FetchParam,
  PostParam,
} from "@/types/request";
import * as _ from "lodash";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// 默认配置
const DEFAULT_CONFIG = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // credentials: 'include', // 携带 cookie
};

/**
 * 统一的 fetch 封装
 */
export async function request<DataType>({
  url,
  options = {},
}: FetchParam): Promise<
  FetchResponse<DataType> | ErrorResponse | string | Blob
> {
  const config = {
    headers:
      options.headers === undefined || options.headers === null
        ? undefined
        : _.merge(DEFAULT_CONFIG.headers, options.headers),
  };

  console.log(config, options.headers);

  // 如果是相对路径，自动拼接 baseURL
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, config);

    // 检查 HTTP 状态码
    if (!response.ok) {
      // 尝试解析错误信息
      let errorData: ErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const error: FetchError = new Error(errorData.message || "请求失败");
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // 根据 Content-Type 决定返回格式
    const contentType = response.headers.get("content-type");
    console.log(contentType);
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else if (contentType && contentType.includes("video")) {
      return await response.blob();
    }
    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TypeError") {
        error.message = "网络连接失败，请检查网络";
      }
      throw error;
    }

    throw error;
    // 网络错误处理
  }
}

// 导出快捷方法
export const get = <DataType>({ url, options }: FetchParam) =>
  request<DataType>({ url, options: { ...options, method: "GET" } });
export const post = <DataType, BodyType>({
  url,
  data,
  options,
}: PostParam<BodyType>) =>
  request<DataType>({
    url,
    options: {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    },
  });
