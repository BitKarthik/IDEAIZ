import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/n8n", async (req: Request, res: Response) => {
    try {
      const payload = req.body;

      if (!N8N_WEBHOOK_URL) {
        return res.status(500).json({ error: "N8N_WEBHOOK_URL not configured" });
      }

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

      const contentType = response.headers.get("content-type");
      let n8nResponse;
      
      if (contentType?.includes("application/json")) {
        n8nResponse = await response.json();
      } else {
        n8nResponse = await response.text();
      }

      res.json(n8nResponse);
    } catch (error) {
      console.error("Error calling n8n:", error);
      res.status(500).json({
        error: "Failed to call n8n",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.get("/api/n8n/status", (_req: Request, res: Response) => {
    res.json({
      configured: !!N8N_WEBHOOK_URL,
      status: N8N_WEBHOOK_URL ? "ready" : "not configured",
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
