import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";
import { registerUserSchema, updateUserSchema } from "@shared/schema";
import { z } from "zod";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";

export async function registerRoutes(app: Express): Promise<Server> {
  // n8n integration
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

  // User registration
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser({
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      });

      const { password, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Get user profile
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Update user profile
  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const validatedData = updateUserSchema.parse(req.body);

      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Delete user account
  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
