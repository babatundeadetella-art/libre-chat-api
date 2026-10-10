export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path?: string;
  headers?: Record<string, string>;
  body?: unknown;
  baseUrl?: string;
}

export async function requestExternalApi({
  method = 'GET',
  path = '',
  headers = {},
  body,
  baseUrl,
}: RequestOptions): Promise<{ ok: boolean; status: number; headers: Record<string, string>; data: unknown }> {
  if (!baseUrl) {
    throw new Error('A baseUrl is required.');
  }

  const url = path ? new URL(path, baseUrl).toString() : baseUrl;
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json, text/plain, */*',
      ...headers,
      ...(body !== undefined && !headers['Content-Type'] ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let parsed: unknown = text;

  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    data: parsed,
  };
}

export async function fetchWebPage(url: string) {
  const result = await requestExternalApi({ method: 'GET', baseUrl: url });

  const text = typeof result.data === 'string' ? result.data : JSON.stringify(result.data ?? {});
  const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);

  return {
    url,
    ok: result.ok,
    title: titleMatch?.[1]?.trim() ?? 'Untitled page',
    snippet: text.slice(0, 500).replace(/\s+/g, ' ').trim(),
    status: result.status,
    content: text,
  };
}
