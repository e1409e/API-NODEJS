# Usa una imagen base de Node.js.
# La versión 20-alpine es ligera y adecuada para producción.
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor.
# Este será el directorio raíz de tu aplicación.
WORKDIR /app

# Copia los archivos de definición de dependencias (package.json y package-lock.json).
# Esto permite a Docker aprovechar la caché de capas.
# Si estos archivos no cambian, las dependencias no se reinstalarán en cada build.
COPY package*.json ./

# Instala todas las dependencias del proyecto.
RUN npm install --omit=dev

# Copia el resto del código fuente de tu aplicación al directorio de trabajo.
COPY . .

# Expone el puerto en el que la aplicación Node.js escuchará.
# Utiliza la variable de entorno PORT que tu aplicación usa, con un valor por defecto.
ARG PORT=3000
EXPOSE ${PORT}

# Define el comando que se ejecutará cuando se inicie el contenedor.
# Esto iniciará tu aplicación en modo de producción según tu script 'start' en package.json.
CMD [ "npm", "start" ]
