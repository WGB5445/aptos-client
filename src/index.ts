import { ClientRequest, ClientResponse } from "@aptos-labs/ts-sdk";

/**
 * Used for JSON responses
 *
 * @param options
 */
export default async function aptosClient<Req,Res>(
  options: ClientRequest<Req>,
): Promise<ClientResponse<Res>> {
  return jsonRequest<Req, Res>(options);
}

export async function jsonRequest<Req, Res>(
  options: ClientRequest<Req>,
): Promise<ClientResponse<Res>> {
  const { requestUrl, requestConfig } = buildRequest(options);

  const res = await fetch(requestUrl, requestConfig);
  const data = await res.json();

  return {
    status: res.status,
    statusText: res.statusText,
    data,
    headers: res.headers,
    config: requestConfig,
  };
}

function buildRequest<Req>(options: ClientRequest<Req>) {
  const headers = new Headers();
  Object.entries(options?.headers ?? {}).forEach(([key, value]) => {
    headers.append(key, String(value));
  });

  const body =
    options.body instanceof Uint8Array
      ? options.body
      : JSON.stringify(options.body);

  const withCredentialsOption = options.overrides?.WITH_CREDENTIALS;
  let credentials: RequestCredentials;
  if (withCredentialsOption === false) {
    credentials = "omit";
  } else if (withCredentialsOption === true) {
    credentials = "include";
  } else {
    credentials = withCredentialsOption ?? "include";
  }

  const requestConfig: RequestInit = {
    method: options.method,
    headers,
    body,
    credentials,
  };

  const params = new URLSearchParams();
  Object.entries(options.params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });

  const requestUrl =
    options.url + (params.size > 0 ? `?${params.toString()}` : "");

  return { requestUrl, requestConfig };
}
