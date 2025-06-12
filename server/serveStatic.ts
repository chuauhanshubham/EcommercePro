import { Express } from "express";
import path from "path";
import { fileURLToPath } from "url";

export function serveStatic(app: Express) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.join(__dirname, "..", "public");

  app.use(express.static(distPath));

  // Handle client-side routing (React Router)
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
