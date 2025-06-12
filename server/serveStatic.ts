// server/serveStatic.ts
import express from "express";
import path from "path";

export function serveStatic(app: express.Express) {
  const staticPath = path.join(__dirname, "public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
