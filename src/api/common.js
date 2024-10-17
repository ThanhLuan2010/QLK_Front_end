import { defer, map } from "rxjs";

let abortController;
let isLoggingIn = false;
const redirectToLogin = () => {
  localStorage.clear();
  window.location.href = "/login";
};
const fetchWithToken = async (url, options = {}) => {
  const apiToken = localStorage.getItem("token");
  const storedLoggingIn = localStorage.getItem("isLoggingIn") === "true";

  if (!!apiToken && !storedLoggingIn) {
    throw new Error("Token is not available");
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (apiToken) {
    headers["Authorization"] = `Bearer ${apiToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response?.json();
    console.error("Something went wrong");
    // redirectToLogin();
  }

  return response.json();
};

const get = (url, queryParams) => {
  abortController = new AbortController();
  const params = new URLSearchParams(queryParams).toString();
  const postResponse = defer(() =>
    fetchWithToken(`${url}?${params}`, {
      method: "GET",
      signal: abortController.signal,
    })
  ).pipe(
    map((result) => {
      return result;
    })
  );
  return postResponse;
};

const post = (url, body, queryParams, headers = {}, responseType = "json") => {
  const params = new URLSearchParams(queryParams).toString();
  const postResponse = defer(() =>
    fetchWithToken(`${url}?${params}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    }).then((response) =>
      responseType === "json" ? response : response.blob()
    )
  ).pipe(
    map((result) => {
      return result;
    })
  );
  return postResponse;
};

const put = (url, body, queryParams) => {
  const params = new URLSearchParams(queryParams).toString();
  const postResponse = defer(() =>
    fetchWithToken(`${url}?${params}`, {
      method: "PUT",
      body: JSON.stringify(body),
    })
  ).pipe(map((result) => result));
  return postResponse;
};

const deleteR = (url, queryParams) => {
  const params = new URLSearchParams(queryParams).toString();
  const postResponse = defer(() =>
    fetchWithToken(`${url}?${params}`, {
      method: "DELETE",
    })
  ).pipe(map((result) => result));
  return postResponse;
};

export const Method = { get, post, put, delete: deleteR };

export const setLoggingIn = (loggingIn) => {
  isLoggingIn = loggingIn;
  localStorage.setItem("isLoggingIn", loggingIn ? "true" : "false");
};

export const cancelToken = () => {
  if (abortController) {
    abortController.abort();
  }
};
