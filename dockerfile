# Gunakan Node.js sebagai base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file ke container
COPY . .

# Build aplikasi
RUN npm run build

# Jalankan aplikasi
CMD ["npm", "start"]
