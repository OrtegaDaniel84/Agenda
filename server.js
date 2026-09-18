import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ical from 'node-ical';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Database directory and file for persistent local storage
const DB_DIR = path.join(__dirname, 'db');
const CALENDARS_FILE = path.join(DB_DIR, 'calendars.json');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function loadCalendars() {
  try {
    if (fs.existsSync(CALENDARS_FILE)) {
      const data = fs.readFileSync(CALENDARS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading calendars file, starting fresh:', err.message);
  }
  return [];
}

function saveCalendars(calendars) {
  try {
    fs.writeFileSync(CALENDARS_FILE, JSON.stringify(calendars, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving calendars file:', err.message);
  }
}

let calendars = loadCalendars();
let nextId = calendars.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1;

// Middleware
app.use(cors());
app.use(express.json());

// Helper to format date & time in Europe/Madrid timezone
function formatDateTime(date, timeZone = 'Europe/Madrid') {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(d);
    const getPart = (type) => parts.find(p => p.type === type)?.value;
    return {
      date: `${getPart('year')}-${getPart('month')}-${getPart('day')}`,
      time: `${getPart('hour')}:${getPart('minute')}`
    };
  } catch {
    return null;
  }
}

// Fetch and parse events from an iCal feed URL within a date window
async function fetchCalendar(cal, startDateStr, endDateStr) {
  try {
    let feedUrl = cal.url ? cal.url.trim() : '';
    if (!feedUrl) return [];

    // Convert webcal:// to https://
    if (feedUrl.startsWith('webcal://')) {
      feedUrl = 'https://' + feedUrl.slice(9);
    } else if (feedUrl.startsWith('webcals://')) {
      feedUrl = 'https://' + feedUrl.slice(10);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AgendaWeb/1.0',
        'Accept': 'text/calendar, text/plain, */*'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[Agenda] Failed to fetch calendar ${cal.title}: HTTP ${res.status}`);
      return [];
    }

    const icsText = await res.text();
    const parsed = ical.sync.parseICS(icsText);
    const formattedEvents = [];

    const rangeStart = new Date(`${startDateStr}T00:00:00Z`);
    const rangeEnd = new Date(`${endDateStr}T23:59:59Z`);

    for (const key of Object.keys(parsed)) {
      const item = parsed[key];
      if (!item || item.type !== 'VEVENT') continue;

      const summary = item.summary || 'Sin título';

      // 1. Handle recurring events
      if (item.rrule) {
        let occurrences = [];
        try {
          occurrences = item.rrule.between(rangeStart, rangeEnd, true);
        } catch (rerr) {
          console.warn(`[Agenda] Recurrence parse error for ${summary}:`, rerr.message);
        }

        for (const occDate of occurrences) {
          // Check for recurrence exclusions (exdate)
          const occIso = occDate.toISOString().split('T')[0];
          if (item.exdate && Object.values(item.exdate).some(ex => {
            try { return new Date(ex).toISOString().split('T')[0] === occIso; } catch { return false; }
          })) {
            continue;
          }

          const targetDate = new Date(occDate);
          if (item.start) {
            const orig = new Date(item.start);
            targetDate.setUTCHours(orig.getUTCHours(), orig.getUTCMinutes(), orig.getUTCSeconds());
          }

          const formatted = formatDateTime(targetDate);
          if (formatted && formatted.date >= startDateStr && formatted.date <= endDateStr) {
            formattedEvents.push({
              date: formatted.date,
              time: formatted.time,
              title: summary,
              color: cal.color || '#3b82f6'
            });
          }
        }
      } else if (item.start) {
        // 2. Single event
        const formatted = formatDateTime(item.start);
        if (formatted && formatted.date >= startDateStr && formatted.date <= endDateStr) {
          formattedEvents.push({
            date: formatted.date,
            time: formatted.time,
            title: summary,
            color: cal.color || '#3b82f6'
          });
        }
      }
    }

    return formattedEvents;
  } catch (error) {
    console.error(`Error cargando ${cal.title}:`, error.message);
    return [];
  }
}

// API Routes
app.get('/api/calendars', (req, res) => {
  res.json(calendars);
});

app.post('/api/calendars', (req, res) => {
  const { title, color, url } = req.body || {};
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  const newCal = {
    id: nextId++,
    title: String(title).trim(),
    color: color || '#3b82f6',
    url: String(url).trim()
  };

  calendars.push(newCal);
  saveCalendars(calendars);

  res.json({
    status: 'success',
    message: 'Calendario guardado en la base de datos',
    calendar: newCal
  });
});

app.delete('/api/calendars/:calendar_id', (req, res) => {
  const calendarId = parseInt(req.params.calendar_id, 10);
  calendars = calendars.filter(c => c.id !== calendarId);
  saveCalendars(calendars);

  res.json({
    status: 'success',
    message: 'Calendario eliminado'
  });
});

app.post('/api/events', async (req, res) => {
  const { start_date, end_date } = req.body || {};
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date and end_date are required' });
  }

  const responseEvents = [];

  // Fetch all calendars in parallel
  const fetchPromises = calendars.map(cal => fetchCalendar(cal, start_date, end_date));
  const results = await Promise.allSettled(fetchPromises);

  for (const r of results) {
    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
      responseEvents.push(...r.value);
    }
  }

  // Sort by date and time ascending
  responseEvents.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  res.json(responseEvents);
});

// Serve static assets
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Agenda Web server running on http://${HOST}:${PORT}`);
});
