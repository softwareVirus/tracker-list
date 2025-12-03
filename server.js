import express from "express";
import axios from "axios";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Serve static files (HTML + images)
app.use(express.static(path.join(__dirname, "public")));

// Google Sheet config
const SPREADSHEET_ID = "1uXazi8d75VP3q_Q9R81FgR-qR3mfUZLUATKJVPwA8Xo";
const SHEET_NAME = "Sayfa1";

/**
 * Root → serve index.html
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

/**
 * Proxy endpoint that fetches Google Sheets GViz JSON
 */
app.get("/sheet", async (req, res) => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
    const response = await axios.get(url);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(response.data);
  } catch (e) {
    console.error("Failed to fetch spreadsheet:", e.message);
    res.status(500).json({ error: "Failed to load spreadsheet." });
  }
});

/**
 * Fallback → return index.html for all unknown routes
 * Helps in SPA use cases
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

export default app;
