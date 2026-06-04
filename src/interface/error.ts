export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};

export type TErrorResponse = {
  success: boolean;
  message: string;
  errorSources: TErrorSources;
  error?: any;
  stack?: string;
};
