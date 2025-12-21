import { getApiUrl, apiRequest } from "./query-client";

export async function callN8n<T = unknown>(data: Record<string, unknown>): Promise<T> {
  const response = await apiRequest("POST", "/api/n8n", data);
  return response.json();
}

export async function getN8nStatus(): Promise<{ configured: boolean; status: string }> {
  const url = new URL("/api/n8n/status", getApiUrl());
  const response = await fetch(url.toString(), { credentials: "include" });
  if (!response.ok) {
    throw new Error("Failed to check n8n status");
  }
  return response.json();
}
