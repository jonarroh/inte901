# Usa una imagen de Node.js con una versión ligera (alpine)
FROM oven/bun:latest

# Establece el directorio de trabajo en /usr/src/app
WORKDIR /usr/src/app

# Copia los archivos de configuración del proyecto
COPY package.json bun.lockb ./

# Instala las dependencias
RUN bun install

# Instala Angular CLI globalmente
RUN bun add @angular/cli

# Exponer el puerto si es necesario
EXPOSE 4200

# Comando para iniciar la aplicación
CMD ["bunx", "ng", "serve"]
