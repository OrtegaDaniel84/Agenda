#!/usr/bin/env bash
# ==============================================================================
# Script de despliegue y actualización: Agenda Semanal
# 1. Crea la carpeta o actualiza el repositorio si ya existe.
# 2. Compila la imagen Docker reemplazando la local.
# 3. Reinicia el contenedor en ejecución preservando los datos (/data).
# 4. Sube (push) la nueva versión a Docker Hub.
# ==============================================================================

set -euo pipefail

# Configuración personalizada
REPO_URL="${REPO_URL:-https://github.com/ortega84/agenda-semanal.git}"
TARGET_DIR="${TARGET_DIR:-$HOME/agenda-semanal}"
IMAGE_NAME="${IMAGE_NAME:-ortega84/agenda-semanal:latest}"
CONTAINER_NAME="${CONTAINER_NAME:-agenda-semanal}"

echo "=========================================================="
echo "🚀 Iniciando despliegue de Agenda Semanal"
echo "📂 Directorio destino: $TARGET_DIR"
echo "🐳 Imagen Docker:      $IMAGE_NAME"
echo "=========================================================="

# 1. Crear carpeta y clonar / actualizar repositorio
if [ ! -d "$TARGET_DIR" ]; then
    echo "📁 Creando directorio y clonando repositorio..."
    mkdir -p "$(dirname "$TARGET_DIR")"
    git clone "$REPO_URL" "$TARGET_DIR"
    cd "$TARGET_DIR"
else
    echo "🔄 Carpeta existente encontrada. Actualizando código desde GitHub..."
    cd "$TARGET_DIR"
    git fetch origin
    git pull origin main || git pull
fi

# Asegurar que la carpeta persistente de datos exista
mkdir -p "$TARGET_DIR/data"

# 2. Compilar la imagen Docker local
echo "🔨 Compilando la nueva imagen Docker ($IMAGE_NAME)..."
docker build -t "$IMAGE_NAME" .

# 3. Sobrescribir y reiniciar el contenedor que está corriendo
echo "🔄 Actualizando el contenedor en ejecución ($CONTAINER_NAME)..."
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo "📦 Usando Docker Compose para reiniciar el servicio..."
    if docker compose version &> /dev/null; then
        docker compose up -d --force-recreate
    else
        docker-compose up -d --force-recreate
    fi
else
    echo "⚠️ Docker Compose no detectado. Reiniciando con comando docker run..."
    if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
        echo "🛑 Deteniendo y eliminando contenedor antiguo..."
        docker stop "$CONTAINER_NAME" || true
        docker rm "$CONTAINER_NAME" || true
    fi

    echo "▶️ Levantando nuevo contenedor..."
    docker run -d \
        --name "$CONTAINER_NAME" \
        -p 3000:3000 \
        -v "$TARGET_DIR/data:/app/data" \
        --restart unless-stopped \
        "$IMAGE_NAME"
fi

# 4. Subir la imagen actualizada a Docker Hub
echo "⬆️ Subiendo nueva imagen a Docker Hub..."
docker push "$IMAGE_NAME"

echo "=========================================================="
echo "✅ Despliegue completado con éxito."
echo "🌐 Aplicación corriendo en: http://localhost:3000"
echo "🐳 Imagen publicada en Docker Hub: $IMAGE_NAME"
echo "=========================================================="
