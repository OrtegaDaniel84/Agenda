# 📅 Personal Calendar Dashboard

Dashboard web personalizado para la gestión de agendas semanales y anuales. Se conecta a feeds iCal externos a través de un backend en FastAPI con persistencia en base de datos SQLite y una interfaz moderna con Tailwind CSS.

## 🚀 Características Principales

* **Vista Dual Integrada**: Panel izquierdo con un calendario anual estático (grilla de 12 meses) y panel derecho con detalle semanal detallado.
* **Persistencia en SQLite**: Almacenamiento seguro de las configuraciones y URLs de los calendarios en base de datos local.
* **Sincronización iCal**: Procesamiento concurrente de eventos externos mediante `icalevents` con ajuste automático de zona horaria (`Europe/Madrid`).
* **Estilado Inteligente**: 
  * Destacado de eventos futuros del día en curso.
  * Sábados y domingos diferenciados visualmente (Domingos en rojo/negrita).
  * Relleno automático de líneas vacías con guiones bajos para mantener una densidad visual uniforme.
* **Auto-recarga**: Actualización automática de la interfaz en los minutos 29 y 59 de cada hora.
* **Dockerizado con Volúmenes**: Preparado para desplegarse fácilmente asegurando la persistencia de los datos mediante volúmenes de Docker.

---

## 🛠️ Tecnologías Utilizadas

* **Backend**: Python, FastAPI, Uvicorn, SQLite, `icalevents`, `pytz`.
* **Frontend**: HTML5, Tailwind CSS, JavaScript (Vanilla).

---

## ⚙️ Puesta en Marcha (Local)

1. **Clona el repositorio e instala las dependencias de Python:**
   ```bash
   pip install -r requirements.txt