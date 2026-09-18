FROM node:22-slim

WORKDIR /app

# Instalar dependencias primero para aprovechar la caché de capas Docker
COPY package*.json ./
RUN npm install --production --no-audit --no-fund

# Copiar el resto del código de la aplicación
COPY . .

# Directorio de datos aislado para persistencia con volúmenes
ENV NODE_ENV=production
ENV DATA_DIR=/app/data
RUN mkdir -p /app/data

# Declaración de volumen persistente para Docker
VOLUME ["/app/data"]

EXPOSE 3000

# Verificación de salud periódica para Docker y orquestadores
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["npm", "start"]
