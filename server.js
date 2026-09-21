import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ical from 'node-ical';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Carpeta aislada para persistencia de datos (compatible con volúmenes Docker)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const CALENDARS_FILE = path.join(DATA_DIR, 'calendars.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const PLANNING_EVENTS_FILE = path.join(DATA_DIR, 'planning_events.json');
const PLANNING_MARKS_FILE = path.join(DATA_DIR, 'planning_marks.json');
const SYNC_META_FILE = path.join(DATA_DIR, 'sync_meta.json');

// Operaciones atómicas y seguras con la base de datos
function loadCalendars() {
  try {
    if (fs.existsSync(CALENDARS_FILE)) {
      const data = fs.readFileSync(CALENDARS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[DB] Error leyendo archivo de calendarios:', err.message);
  }
  return [];
}

function saveCalendars(calendarsData) {
  try {
    fs.writeFileSync(CALENDARS_FILE, JSON.stringify(calendarsData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error guardando archivo de calendarios:', err.message);
  }
}

function loadPlanningEvents() {
  try {
    if (fs.existsSync(PLANNING_EVENTS_FILE)) {
      const data = fs.readFileSync(PLANNING_EVENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[DB] Error leyendo archivo de eventos de planificación:', err.message);
  }
  return [];
}

function savePlanningEvents(planningData) {
  try {
    fs.writeFileSync(PLANNING_EVENTS_FILE, JSON.stringify(planningData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error guardando archivo de eventos de planificación:', err.message);
  }
}

function loadPlanningMarks() {
  try {
    if (fs.existsSync(PLANNING_MARKS_FILE)) {
      const data = fs.readFileSync(PLANNING_MARKS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[DB] Error leyendo marcas de planificación:', err.message);
  }
  return {};
}

function savePlanningMarks(marksData) {
  try {
    fs.writeFileSync(PLANNING_MARKS_FILE, JSON.stringify(marksData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error guardando marcas de planificación:', err.message);
  }
}

function loadEventsFromDb() {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      const data = fs.readFileSync(EVENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[DB] Error leyendo base de datos de eventos:', err.message);
  }
  return [];
}

function saveEventsToDb(eventsData) {
  try {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error guardando base de datos de eventos:', err.message);
  }
}

function loadSyncMeta() {
  try {
    if (fs.existsSync(SYNC_META_FILE)) {
      const data = fs.readFileSync(SYNC_META_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[DB] Error leyendo metadatos de sincronización:', err.message);
  }
  return {
    lastSync: null,
    lastStatus: 'idle',
    eventsCount: 0,
    dataVersion: 1,
    dataHash: '',
    lastChangedAt: null
  };
}

function saveSyncMeta(metaData) {
  try {
    fs.writeFileSync(SYNC_META_FILE, JSON.stringify(metaData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error guardando metadatos de sincronización:', err.message);
  }
}

function computeEventsHash(eventsList) {
  try {
    return crypto.createHash('md5').update(JSON.stringify(eventsList || [])).digest('hex');
  } catch {
    return String(Date.now());
  }
}

let calendars = loadCalendars();
let cachedEvents = loadEventsFromDb();
let planningEvents = loadPlanningEvents();
let planningMarks = loadPlanningMarks();
let syncMeta = loadSyncMeta();
let isSyncing = false;
let nextId = calendars.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1;
let nextPlanningId = planningEvents.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0) + 1;

// Middleware
app.use(cors());
app.use(express.json());

// Obtener la zona horaria del servidor donde corre la aplicación automáticamente
function getServerTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

// Formatear fecha y hora en formato español de 24h usando la zona horaria del servidor
function formatDateTime(date, timeZone = getServerTimeZone()) {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const tz = timeZone || getServerTimeZone();
    const formatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: tz,
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

// Descargar y procesar feed iCal remoto con gestión de recurrencias
async function fetchCalendar(cal, startDateStr, endDateStr) {
  try {
    let feedUrl = cal.url ? cal.url.trim() : '';
    if (!feedUrl) return [];

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
      console.warn(`[Sync] Falló la descarga del calendario "${cal.title}": HTTP ${res.status}`);
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

      // 1. Eventos recurrentes (rrule)
      if (item.rrule) {
        let occurrences = [];
        try {
          occurrences = item.rrule.between(rangeStart, rangeEnd, true);
        } catch (rerr) {
          console.warn(`[Sync] Advertencia de recurrencia en "${summary}":`, rerr.message);
        }

        for (const occDate of occurrences) {
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
              calendarId: cal.id,
              date: formatted.date,
              time: formatted.time,
              title: summary,
              color: cal.color || '#3b82f6'
            });
          }
        }
      } else if (item.start) {
        // 2. Evento puntual
        const formatted = formatDateTime(item.start);
        if (formatted && formatted.date >= startDateStr && formatted.date <= endDateStr) {
          formattedEvents.push({
            calendarId: cal.id,
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
    console.error(`[Sync] Error procesando "${cal.title}":`, error.message);
    return [];
  }
}

// Rango para persistencia en base de datos (-1 año a +2 años)
function getSyncDateRange() {
  const now = new Date();
  const pastYear = now.getFullYear() - 1;
  const futureYear = now.getFullYear() + 2;
  return {
    startDateStr: `${pastYear}-01-01`,
    endDateStr: `${futureYear}-12-31`
  };
}

// Sincronización completa con detección de cambios
async function syncCalendarsToDatabase(forced = false) {
  if (isSyncing) {
    return {
      status: 'in_progress',
      lastSync: syncMeta.lastSync,
      eventsCount: cachedEvents.length,
      dataVersion: syncMeta.dataVersion || 1,
      hasChanged: false
    };
  }

  isSyncing = true;

  try {
    if (calendars.length === 0) {
      const hadEvents = cachedEvents.length > 0;
      cachedEvents = [];
      saveEventsToDb(cachedEvents);
      let dataVersion = syncMeta.dataVersion || 1;
      if (hadEvents) {
        dataVersion += 1;
      }
      syncMeta = {
        lastSync: new Date().toISOString(),
        lastStatus: 'success',
        eventsCount: 0,
        dataVersion,
        dataHash: '',
        lastChangedAt: hadEvents ? new Date().toISOString() : (syncMeta.lastChangedAt || new Date().toISOString())
      };
      saveSyncMeta(syncMeta);
      isSyncing = false;
      return { status: 'success', lastSync: syncMeta.lastSync, eventsCount: 0, dataVersion, hasChanged: hadEvents };
    }

    const { startDateStr, endDateStr } = getSyncDateRange();
    const fetchPromises = calendars.map(cal => fetchCalendar(cal, startDateStr, endDateStr));
    const results = await Promise.allSettled(fetchPromises);

    const freshEvents = [];
    const seenKey = new Set();

    for (const r of results) {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        for (const ev of r.value) {
          const uniqueKey = `${ev.calendarId}|${ev.date}|${ev.time}|${ev.title}`;
          if (!seenKey.has(uniqueKey)) {
            seenKey.add(uniqueKey);
            freshEvents.push(ev);
          }
        }
      }
    }

    // Ordenar cronológicamente
    freshEvents.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

    // Comparar hashes para detectar si hubo cambios
    const previousHash = syncMeta.dataHash || computeEventsHash(cachedEvents);
    const newHash = computeEventsHash(freshEvents);
    const hasDataChanged = previousHash !== newHash;

    let dataVersion = syncMeta.dataVersion || 1;
    let lastChangedAt = syncMeta.lastChangedAt || new Date().toISOString();

    if (hasDataChanged) {
      dataVersion += 1;
      lastChangedAt = new Date().toISOString();
      console.log(`[Sync] Cambios detectados en calendarios. Nueva versión de datos: v${dataVersion} (${freshEvents.length} eventos).`);
    }

    cachedEvents = freshEvents;
    saveEventsToDb(cachedEvents);

    syncMeta = {
      lastSync: new Date().toISOString(),
      lastStatus: 'success',
      eventsCount: cachedEvents.length,
      dataHash: newHash,
      dataVersion,
      lastChangedAt
    };
    saveSyncMeta(syncMeta);

    return {
      status: 'success',
      lastSync: syncMeta.lastSync,
      eventsCount: cachedEvents.length,
      dataVersion: syncMeta.dataVersion,
      hasChanged: hasDataChanged
    };
  } catch (error) {
    console.error('[Sync] Error durante la sincronización:', error.message);
    syncMeta = {
      ...syncMeta,
      lastStatus: 'error',
      lastError: error.message
    };
    saveSyncMeta(syncMeta);
    return {
      status: 'error',
      lastSync: syncMeta.lastSync,
      error: error.message,
      dataVersion: syncMeta.dataVersion || 1,
      hasChanged: false
    };
  } finally {
    isSyncing = false;
  }
}

// Sincronización automática periódica cada 15 minutos (15 * 60 * 1000 ms)
const SYNC_INTERVAL_MS = 15 * 60 * 1000;
setInterval(() => {
  syncCalendarsToDatabase(false);
}, SYNC_INTERVAL_MS);

// Sincronización inicial al levantar el servidor (fuerza cálculo con zona horaria del servidor)
setTimeout(() => {
  if (calendars.length > 0) {
    syncCalendarsToDatabase(true);
  }
}, 1500);

// Endpoint de salud para Docker / Kubernetes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    dataDir: DATA_DIR,
    calendarsCount: calendars.length,
    eventsCount: cachedEvents.length,
    lastSync: syncMeta.lastSync,
    serverTimeZone: getServerTimeZone(),
    serverTime: new Date().toISOString()
  });
});

// Rutas de API REST
app.get('/api/calendars', (req, res) => {
  res.json(calendars);
});

app.post('/api/calendars', async (req, res) => {
  const { title, color, url } = req.body || {};
  if (!title || !url) {
    return res.status(400).json({ error: 'Título y URL requeridos' });
  }

  const newCal = {
    id: nextId++,
    title: String(title).trim(),
    color: color || '#3b82f6',
    url: String(url).trim()
  };

  calendars.push(newCal);
  saveCalendars(calendars);

  // Sincronizar en segundo plano de inmediato
  syncCalendarsToDatabase(true);

  res.json({
    status: 'success',
    message: 'Calendario guardado en la base de datos',
    calendar: newCal
  });
});

app.put('/api/calendars/:calendar_id', async (req, res) => {
  const calendarId = parseInt(req.params.calendar_id, 10);
  const index = calendars.findIndex(c => c.id === calendarId);
  if (index === -1) {
    return res.status(404).json({ error: 'Calendario no encontrado' });
  }

  const { title, color, url } = req.body || {};
  if (!title || !url) {
    return res.status(400).json({ error: 'Título y URL requeridos' });
  }

  const oldCal = calendars[index];
  const urlChanged = oldCal.url !== String(url).trim();

  calendars[index] = {
    ...oldCal,
    title: String(title).trim(),
    color: color || '#3b82f6',
    url: String(url).trim()
  };
  saveCalendars(calendars);

  if (!urlChanged) {
    let changed = false;
    cachedEvents = cachedEvents.map(e => {
      if (e.calendarId === calendarId) {
        changed = true;
        return { ...e, color: calendars[index].color, calendarTitle: calendars[index].title };
      }
      return e;
    });
    if (changed) {
      saveEventsToDb(cachedEvents);
      syncMeta.dataVersion = (syncMeta.dataVersion || 1) + 1;
      syncMeta.lastChangedAt = new Date().toISOString();
      saveSyncMeta(syncMeta);
    }
  } else {
    syncCalendarsToDatabase(true);
  }

  res.json({
    status: 'success',
    message: 'Calendario actualizado',
    calendar: calendars[index]
  });
});

app.delete('/api/calendars/:calendar_id', async (req, res) => {
  const calendarId = parseInt(req.params.calendar_id, 10);
  calendars = calendars.filter(c => c.id !== calendarId);
  saveCalendars(calendars);

  cachedEvents = cachedEvents.filter(e => e.calendarId !== calendarId);
  saveEventsToDb(cachedEvents);

  syncCalendarsToDatabase(true);

  res.json({
    status: 'success',
    message: 'Calendario eliminado'
  });
});

// Rutas para Eventos de Planificación (Creados por el usuario con color y título, persistentes)
app.get('/api/planning-events', (req, res) => {
  res.json(planningEvents);
});

app.post('/api/planning-events', (req, res) => {
  const { title, color, date, time } = req.body || {};
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'El título del evento es requerido' });
  }

  const newEvent = {
    id: nextPlanningId++,
    title: String(title).trim(),
    color: color || '#0d6efd',
    createdAt: new Date().toISOString()
  };

  planningEvents.push(newEvent);
  savePlanningEvents(planningEvents);

  res.json({
    status: 'success',
    message: 'Evento de planificación guardado',
    event: newEvent
  });
});

app.put('/api/planning-events/:event_id', (req, res) => {
  const eventId = parseInt(req.params.event_id, 10);
  const index = planningEvents.findIndex(e => e.id === eventId);
  if (index === -1) {
    return res.status(404).json({ error: 'Evento de planificación no encontrado' });
  }

  const { title, color } = req.body || {};
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'El título del evento es requerido' });
  }

  planningEvents[index] = {
    ...planningEvents[index],
    title: String(title).trim(),
    color: color || planningEvents[index].color || '#0d6efd',
    updatedAt: new Date().toISOString()
  };
  savePlanningEvents(planningEvents);

  res.json({
    status: 'success',
    message: 'Evento de planificación actualizado',
    event: planningEvents[index]
  });
});

app.delete('/api/planning-events/:event_id', (req, res) => {
  const eventId = parseInt(req.params.event_id, 10);
  planningEvents = planningEvents.filter(e => e.id !== eventId);
  savePlanningEvents(planningEvents);

  // Limpiar marcas del calendario anual asociadas a este evento
  let marksChanged = false;
  for (const date in planningMarks) {
    if (Array.isArray(planningMarks[date]) && planningMarks[date].includes(eventId)) {
      planningMarks[date] = planningMarks[date].filter(id => id !== eventId);
      if (planningMarks[date].length === 0) {
        delete planningMarks[date];
      }
      marksChanged = true;
    }
  }
  if (marksChanged) {
    savePlanningMarks(planningMarks);
  }

  res.json({
    status: 'success',
    message: 'Evento de planificación eliminado'
  });
});

// Rutas para Marcas en los Días del Calendario Anual (Persistentes)
app.get('/api/planning-marks', (req, res) => {
  res.json(planningMarks);
});

app.post('/api/planning-marks/toggle', (req, res) => {
  const { date, eventId } = req.body || {};
  if (!date || !eventId) {
    return res.status(400).json({ error: 'date (YYYY-MM-DD) y eventId son requeridos' });
  }

  const id = Number(eventId);
  const currentList = Array.isArray(planningMarks[date]) ? [...planningMarks[date]] : [];
  const index = currentList.indexOf(id);

  let isMarked = false;
  if (index !== -1) {
    currentList.splice(index, 1);
    if (currentList.length === 0) {
      delete planningMarks[date];
    } else {
      planningMarks[date] = currentList;
    }
    isMarked = false;
  } else {
    if (currentList.length >= 4) {
      return res.status(400).json({
        error: 'Máximo 4 eventos por día en la planificación',
        limitReached: true,
        eventIds: currentList
      });
    }
    currentList.push(id);
    planningMarks[date] = currentList;
    isMarked = true;
  }

  savePlanningMarks(planningMarks);

  res.json({
    status: 'success',
    date,
    eventId: id,
    isMarked,
    eventIds: planningMarks[date] || []
  });
});

// Consulta de estado de sincronización y versión de datos
app.get('/api/sync-status', (req, res) => {
  res.json({
    lastSync: syncMeta.lastSync,
    isSyncing,
    eventsCount: cachedEvents.length,
    status: syncMeta.lastStatus,
    dataVersion: syncMeta.dataVersion || 1,
    lastChangedAt: syncMeta.lastChangedAt || syncMeta.lastSync,
    serverTimeZone: getServerTimeZone(),
    serverTime: new Date().toISOString()
  });
});

// Forzar actualización manual (botón Refresh)
app.post('/api/refresh', async (req, res) => {
  const result = await syncCalendarsToDatabase(true);
  res.json(result);
});

// Lectura de eventos ultrarrápida desde la base de datos local
app.post('/api/events', async (req, res) => {
  const { start_date, end_date, force_refresh } = req.body || {};
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date y end_date son requeridos' });
  }

  if (force_refresh) {
    await syncCalendarsToDatabase(true);
  } else if (cachedEvents.length === 0 && calendars.length > 0 && !syncMeta.lastSync) {
    await syncCalendarsToDatabase(false);
  }

  const responseEvents = cachedEvents.filter(ev => ev.date >= start_date && ev.date <= end_date);
  responseEvents.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  res.json(responseEvents);
});

// Servir archivos estáticos
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.get('/favicon.ico', (req, res) => {
  res.type('image/svg+xml');
  res.sendFile(path.join(__dirname, 'favicon.svg'));
});
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, HOST, () => {
  console.log(`[Agenda] Servidor ejecutándose en http://${HOST}:${PORT}`);
  console.log(`[Agenda] Directorio de datos aislado: ${DATA_DIR}`);
});

// Cierre elegante para contenedores Docker
function gracefulShutdown(signal) {
  console.log(`[Agenda] Recibida señal ${signal}. Cerrando servidor de forma segura...`);
  server.close(() => {
    console.log('[Agenda] Servidor cerrado. Proceso terminado.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
