from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from icalevents.icalevents import events
from datetime import datetime, timedelta
import concurrent.futures
import pytz
import sqlite3
from server.database import DB_NAME

app = FastAPI()

class CalendarConfig(BaseModel):
    title: str
    color: str
    url: str

class EventRequest(BaseModel):
    calendars: list[CalendarConfig]
    start_date: str
    end_date: str

class DateRangeRequest(BaseModel):
    start_date: str
    end_date: str
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/css", StaticFiles(directory="css"), name="css")

@app.get("/")
def read_index():
    return FileResponse("index.html")

@app.get("/api/calendars")
def get_calendars():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM calendars")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/api/calendars")
def add_calendar(cal: CalendarConfig):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO calendars (title, color, url) VALUES (?, ?, ?)", 
                   (cal.title, cal.color, cal.url))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Calendario guardado en la base de datos"}

def fetch_calendar(cal, start_dt, end_dt):
    """Función aislada para descargar un solo calendario con ajuste de zona horaria"""
    try:
        # Como 'cal' ahora es un diccionario de SQLite, usamos corchetes []
        cal_events = events(url=cal["url"], start=start_dt, end=end_dt)
        local_tz = pytz.timezone('Europe/Madrid')
        
        formatted_events = []
        for e in cal_events:
            start_time = e.start
            
            if start_time.tzinfo is not None:
                start_time = start_time.astimezone(local_tz)
            else:
                utc_dt = pytz.utc.localize(start_time)
                start_time = utc_dt.astimezone(local_tz)

            formatted_events.append({
                "date": start_time.strftime("%Y-%m-%d"),
                "time": start_time.strftime("%H:%M"),
                "title": e.summary,
                "color": cal["color"]
            })
        return formatted_events
    except Exception as error:
        # Aquí también cambiamos a corchetes para el título
        print(f"Error cargando {cal['title']}: {error}")
        return []

@app.delete("/api/calendars/{calendar_id}")
def delete_calendar(calendar_id: int):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM calendars WHERE id = ?", (calendar_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Calendario eliminado"}

@app.post("/api/events")
def get_events(req: DateRangeRequest):
    start_dt = datetime.strptime(req.start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(req.end_date, "%Y-%m-%d") + timedelta(days=1) 
    
    # 1. Consultar los calendarios directamente desde SQLite
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT title, color, url FROM calendars")
    db_calendars = cursor.fetchall()
    conn.close()
    
    response_events = []
    
    # 2. Procesar en paralelo usando los diccionarios de la base de datos
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(fetch_calendar, dict(cal), start_dt, end_dt) for cal in db_calendars]
        for future in concurrent.futures.as_completed(futures):
            response_events.extend(future.result())
            
    # Ordenar por fecha y hora
    response_events.sort(key=lambda x: (x["date"], x["time"]))
            
    return response_events