import { getApiUrl, apiRequest } from "./query-client";

export interface N8nEvent {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface N8nTriggerResponse {
  success: boolean;
  message: string;
  n8nResponse?: unknown;
}

export interface N8nEventsResponse {
  events: N8nEvent[];
  count: number;
}

export interface N8nStatusResponse {
  configured: boolean;
  webhookUrl: string;
  queueSize: number;
}

export async function triggerN8nWorkflow(
  event: string,
  data: Record<string, unknown> = {}
): Promise<N8nTriggerResponse> {
  const response = await apiRequest("POST", "/api/n8n/trigger", { event, data });
  return response.json();
}

export async function getN8nEvents(): Promise<N8nEventsResponse> {
  const url = new URL("/api/n8n/events", getApiUrl());
  const response = await fetch(url.toString(), { credentials: "include" });
  if (!response.ok) {
    throw new Error("Failed to fetch n8n events");
  }
  return response.json();
}

export async function getLatestN8nEvent(): Promise<{ event: N8nEvent | null }> {
  const url = new URL("/api/n8n/events/latest", getApiUrl());
  const response = await fetch(url.toString(), { credentials: "include" });
  if (!response.ok) {
    throw new Error("Failed to fetch latest n8n event");
  }
  return response.json();
}

export async function clearN8nEvents(): Promise<{ success: boolean; message: string }> {
  const response = await apiRequest("DELETE", "/api/n8n/events", {});
  return response.json();
}

export async function getN8nStatus(): Promise<N8nStatusResponse> {
  const url = new URL("/api/n8n/status", getApiUrl());
  const response = await fetch(url.toString(), { credentials: "include" });
  if (!response.ok) {
    throw new Error("Failed to fetch n8n status");
  }
  return response.json();
}
