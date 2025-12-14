import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";

interface N8nEvent {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

const eventQueue: N8nEvent[] = [];
const MAX_QUEUE_SIZE = 100;

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/n8n/trigger", async (req: Request, res: Response) => {
    try {
      const { event, data } = req.body;

      if (!event) {
        return res.status(400).json({ error: "Event type is required" });
      }

      if (!N8N_WEBHOOK_URL) {
        return res.status(500).json({ error: "N8N_WEBHOOK_URL not configured" });
      }

      const payload = {
        event,
        timestamp: new Date().toISOString(),
        data: data || {},
      };

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`n8n responded with status: ${response.status}`);
      }

      let n8nResponse;
      try {
        n8nResponse = await response.json();
      } catch {
        n8nResponse = { message: "Workflow triggered successfully" };
      }

      res.json({
        success: true,
        message: "Event sent to n8n",
        n8nResponse,
      });
    } catch (error) {
      console.error("Error triggering n8n workflow:", error);
      res.status(500).json({
        error: "Failed to trigger n8n workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.post("/api/n8n/webhook", (req: Request, res: Response) => {
    try {
      const incomingData = req.body;

      console.log("Received webhook from n8n:", JSON.stringify(incomingData));

      const event: N8nEvent = {
        event: incomingData.event || "n8n_webhook",
        timestamp: new Date().toISOString(),
        data: incomingData,
      };

      eventQueue.unshift(event);
      if (eventQueue.length > MAX_QUEUE_SIZE) {
        eventQueue.pop();
      }

      res.json({
        success: true,
        message: "Webhook received",
        receivedAt: event.timestamp,
      });
    } catch (error) {
      console.error("Error processing n8n webhook:", error);
      res.status(500).json({
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.get("/api/n8n/events", (_req: Request, res: Response) => {
    res.json({
      events: eventQueue,
      count: eventQueue.length,
    });
  });

  app.get("/api/n8n/events/latest", (_req: Request, res: Response) => {
    if (eventQueue.length === 0) {
      return res.json({ event: null });
    }
    res.json({ event: eventQueue[0] });
  });

  app.delete("/api/n8n/events", (_req: Request, res: Response) => {
    eventQueue.length = 0;
    res.json({ success: true, message: "Event queue cleared" });
  });

  app.get("/api/n8n/status", (_req: Request, res: Response) => {
    res.json({
      configured: !!N8N_WEBHOOK_URL,
      webhookUrl: N8N_WEBHOOK_URL ? "Set" : "Not configured",
      queueSize: eventQueue.length,
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
