# 📅 Agenda Semanal

Aplicación web adaptable para la gestión y visualización de agendas semanales y anuales. Se conecta a feeds iCal remotos externos (Google Calendar, Microsoft Outlook / Office 365, Apple iCloud, etc.), sincronizando los eventos en segundo plano en una base de datos local aislada para garantizar máxima rapidez, navegación fluida sin bloqueos de red y persistencia completa.

Imagen oficial Docker Hub: **`ortega84/agenda-semanal`**

---

## 🚀 Características Principales

* **Bloques de Días Simétricos y Uniformes**:
  * Cuadrícula semanal estructurada (de Domingo a Sábado) con altura matemáticamente idéntica y simétrica para todos los días.
  * Desplazamiento independiente por tarjeta (`overflow-y: auto`), manteniendo la cuadrícula visualmente impecable sin importar cuántos eventos tenga cada día.
* **Vista Dual Integrada**:
  * **Panel Izquierdo**: Mini calendario mensual interactivo y grilla estática anual completa de 12 meses. Al hacer clic en cualquier día, la vista salta instantáneamente a esa semana.
  * **Panel Central/Derecho**: Cuadrícula semanal estructurada con tarjetas individuales para cada día.
* **Persistencia Aislada para Docker**:
  * Todos los datos (configuraciones de calendarios, eventos sincronizados y metadatos) se almacenan de forma aislada en la carpeta `data/` (`DATA_DIR`).
  * Preparado para montar volúmenes persistentes en Docker (`-v ./data:/app/data`), asegurando que la información nunca se pierda entre reinicios o actualizaciones de contenedor.
* **Sincronización Inteligente en Segundo Plano**:
  * Las consultas a los calendarios remotos se realizan de forma automática cada **15 minutos** y se persisten en la base de datos local.
  * Al navegar por semanas o interactuar con la app, los eventos se leen directamente de la base de datos local sin demoras de red.
* **Detección de Cambios y Auto-recarga**:
  * Compara huellas criptográficas (hash) en cada sincronización. Si detecta cambios (nuevos eventos, modificaciones o cancelaciones), la interfaz se actualiza automáticamente.
  * Si el usuario tiene abierto el diálogo de configuración, pospone la recarga hasta cerrarlo para evitar interrupciones.
* **Botón de Actualización Forzada**:
  * Permite consultar inmediatamente los servidores remotos en cualquier momento con indicación visual del estado.
* **Estilado Refinado y Responsive**:
  * Resaltado automático del día de hoy y de eventos futuros del día actual.
  * Distinción visual para fines de semana (Domingos destacados con acento distintivo).
  * Optimizado para pantallas grandes (1920x1080), laptops, tablets y móviles.

---

## 🛠️ Tecnologías

* **Backend**: Node.js, Express, `node-ical`, `cors`.
* **Frontend**: HTML5, Bootstrap 5.3, Bootstrap Icons, FullCalendar 6.
* **Contenedor**: Docker, Docker Compose, Alpine/Slim Node runtime.

---

## 🐳 Despliegue con Docker

### Opción 1: Usando la imagen directa desde Docker Hub (`ortega84/agenda-semanal`)

Ejecuta el contenedor directamente descargando la imagen:

```bash
docker run -d \
  --name agenda-semanal \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  ortega84/agenda-semanal:latest
```

La aplicación estará disponible en `http://localhost:3000`.

---

### Opción 2: Docker Compose

Crea y levanta el servicio con persistencia en un solo paso:

```bash
docker compose up -d
```

El archivo `docker-compose.yml` ya viene preconfigurado con el servicio `agenda-semanal` y el volumen montado en `./data:/app/data`.

---

### Opción 3: Construir y Publicar la Imagen en tu Docker Hub (`ortega84`)

Si deseas compilar la imagen localmente y subirla a tu cuenta de Docker Hub (`ortega84`):

1. **Iniciar sesión en Docker Hub**:
   ```bash
   docker login -u ortega84
   ```

2. **Construir la imagen con tu etiqueta de usuario**:
   ```bash
   docker build -t ortega84/agenda-semanal:latest .
   ```

3. **Publicar la imagen en Docker Hub**:
   ```bash
   docker push ortega84/agenda-semanal:latest
   ```

---

## 💻 Ejecución en Desarrollo Local (sin Docker)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar la aplicación:**
   ```bash
   npm start
   ```

3. Abrir en el navegador:
   ```
   http://localhost:3000
   ```

---

## 📁 Estructura del Proyecto

```text
.
├── css/
│   └── style.css            # Estilos personalizados, diseño responsive y simetría de días
├── data/                    # Directorio aislado para persistencia de datos (Volumen Docker)
│   ├── .gitkeep             # Mantiene la carpeta en Git sin subir datos privados
│   ├── calendars.json       # Configuración y URLs de calendarios (ignorado por Git)
│   ├── events.json          # Eventos cacheados y sincronizados (ignorado por Git)
│   └── sync_meta.json       # Versión de datos, hash y fecha de sincronización
├── js/
│   └── script.js            # Lógica de interfaz, mini-calendario, eventos y polling
├── Dockerfile               # Configuración de compilación y ejecución Docker con Healthcheck
├── docker-compose.yml       # Orquestación con servicio ortega84/agenda-semanal
├── index.html               # Estructura principal de la aplicación
├── package.json             # Dependencias del proyecto Node.js
└── server.js                # Servidor Express, API REST y motor de sincronización iCal
```

---

## ⚙️ Variables de Entorno

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `PORT` | `3000` | Puerto en el que escucha el servidor web. |
| `DATA_DIR` | `./data` | Directorio en disco donde se guardan los datos persistentes. |
| `NODE_ENV` | `production` | Entorno de ejecución de Node.js. |
