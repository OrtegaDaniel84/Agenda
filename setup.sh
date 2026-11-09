# 1. Crear carpeta y entrar
gh repo clone OrtegaDaniel84/Agenda
cd Agenda

# 2. Para actualizar
cd Agenda
git pull

# 2. Compilar la imagen definida en docker-compose.yml
docker compose build

# 3. Subir la imagen a Docker Hub
docker compose push

# 4. Reiniciar el contenedor en el servidor con la nueva versión
docker compose up -d

# Otra opcion
 docker build -t ortega84/agenda-semanal:latest .
 docker push ortega84/agenda-semanal:latest