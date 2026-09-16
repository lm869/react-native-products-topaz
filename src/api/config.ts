export interface ApiConfig {
  baseURL: string;
  defaultTimeoutMs: number;
}

export const apiConfig: ApiConfig = {
  baseURL: 'https://dummyjson.com',
  defaultTimeoutMs: 15_000,
};
