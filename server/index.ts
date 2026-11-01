import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { prisma } from "../lib/prisma";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/api/users", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});

export default app;
