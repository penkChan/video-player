export interface FetchResponse<DataType> {
  data: DataType;
  code: number;
  message: string;
}

export interface ErrorResponse {
  code?: number;
  message: string;
}

export interface FetchError extends Error {
  status?: number;
  data?: ErrorResponse;
}

export interface FetchParam {
  url: string;
  options: RequestInit;
}

export interface PostParam<BodyType> extends FetchParam {
  data: BodyType;
}
