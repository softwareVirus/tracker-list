import express from 'express';
import axios from 'axios';
import cors from 'cors';

// Configuration
// The ID of the Google Spreadsheet to read data from.  You can find this in the
// URL of the spreadsheet.  For example, in
//   https://docs.google.com/spreadsheets/d/1uXazi8d75VP3q_Q9R81FgR-qR3mfUZLUATKJVPwA8Xo/edit#gid=0
// the spreadsheet ID is the part after `/d/` and before `/edit`.
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1uXazi8d75VP3q_Q9R81FgR-qR3mfUZLUATKJVPwA8Xo';
// The name of the sheet (tab) to read.  In many spreadsheets this is "Sheet1" or
// another name.  Change it here if your sheet name is different.
const SHEET_NAME = process.env.SHEET_NAME || 'Sayfa1';

const app = express();

// Allow CORS so the frontend can fetch from this server from any origin.
app.use(cors());

// Serve static assets from the `public` folder.  This includes index.html and
// images.  You can run the site by navigating to http://localhost:3000/ in a
// browser once the server is running.
app.use(express.static('public'));

/**
 * Proxy endpoint that fetches the Google Sheets data and returns it to the
 * client.  Google does not permit cross‑origin browser requests directly to
 * https://docs.google.com, so the browser fetches from our server instead.
 */
app.get('/sheet', async (req, res) => {
  try {
    // Build the GVIZ API URL for the given sheet.  We use the GVIZ API
    // because it returns JSON-like data that is easy to parse on the client.
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
    const response = await axios.get(url);
    // Set CORS header so the browser will accept the response.  While we
    // already enable CORS globally above, explicitly setting it here makes
    // sure it applies to this endpoint.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(response.data);
  } catch (e) {
    console.error('Failed to fetch spreadsheet:', e.message);
    res.status(500).json({ error: 'Failed to load spreadsheet' });
  }
});

// Start the server.  The port can be configured via the PORT environment
// variable; if not provided, default to 3000.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Leaderboard server running at http://localhost:${PORT}`);
});