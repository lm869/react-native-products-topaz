import { apiConfig } from './config';
import {
  HttpError,
  NetworkError,
  ParseError,
  TimeoutError,
  UnknownAppError,
} from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method?: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  timeoutMs?: number;
  baseUrl?: string;
}

function composeUrl(baseURL: string, path: string): string {
  const trimmedBase = baseURL.replace(/\/+$/, '');
  const prefixedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${prefixedPath}`;
}

function composeQuery(query: RequestConfig['query']): string {
  if (!query) return '';
  const entries = Object.entries(query).filter(
    ([, value]) => value !== undefined,
  );
  if (entries.length === 0) return '';
  const params = new URLSearchParams();
  for (const [key, value] of entries) {
    params.append(key, String(value));
  }
  return `?${params.toString()}`;
}

export async function request<T>(config: RequestConfig): Promise<T> {
  const method = config.method ?? 'GET';
  const baseURL = config.baseUrl ?? apiConfig.baseURL;
  const timeoutMs = config.timeoutMs ?? apiConfig.defaultTimeoutMs;

  const url = composeUrl(baseURL, config.path) + composeQuery(config.query);
  console.log(`[http] → ${method} ${url}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (config.signal) {
    if (config.signal.aborted) {
      controller.abort();
    } else {
      config.signal.addEventListener('abort', () => controller.abort(), {
        once: true,
      });
    }
  }

  let response: Response;
  try {
    response = await fetch(url, { method, signal: controller.signal });
  } catch (error) {
    const aborted = controller.signal.aborted;
    const userAborted = config.signal?.aborted ?? false;
    console.log(`[http] ✕ ${method} ${url}`, { aborted, userAborted, error });
    if (userAborted) {
      throw error instanceof Error ? error : new Error('aborted');
    }
    if (aborted) {
      throw new TimeoutError(timeoutMs);
    }
    if (error instanceof TypeError) {
      throw new NetworkError(error);
    }
    throw new UnknownAppError(error);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    console.log(`[http] ✕ ${method} ${url} → HTTP ${response.status}`);
    throw new HttpError(response.status, response.statusText);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    console.log(`[http] ✕ ${method} ${url} → parse error`, error);
    throw new ParseError(error);
  }

  console.log(`[http] ✓ ${method} ${url} →`, payload);
  return payload as T;
}
