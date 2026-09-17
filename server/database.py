import os
import sqlite3

DB_DIR = "db"
os.makedirs(DB_DIR, exist_ok=True)

DB_NAME = os.path.join(DB_DIR, "database.db")

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Tabla para guardar las configuraciones de los calendarios (Título, Color, URL)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS calendars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        color TEXT NOT NULL,
        url TEXT NOT NULL)''')

    conn.commit()
    conn.close()

init_db()
 