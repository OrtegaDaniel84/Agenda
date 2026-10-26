# 1. Actualizar el código
git pull

# 2. Compilar la imagen definida en docker-compose.yml
docker compose build

# 3. Subir la imagen a Docker Hub
docker compose push

# 4. Reiniciar el contenedor en el servidor con la nueva versión
docker compose up -d