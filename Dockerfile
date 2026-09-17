FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código del proyecto al contenedor
COPY . .

# Exponer el puerto de FastAPI
EXPOSE 8000

# Comando para arrancar el servidor
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]