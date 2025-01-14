# Gunakan Node.js sebagai base image
FROM node:20

# Set working directory
WORKDIR /app

# Install yarn
RUN npm install -g yarn --force

# Copy file package.json dan yarn.lock
COPY package.json yarn.lock ./

# Install dependencies dengan yarn
RUN yarn install --ignore-engines

# Install serve secara global untuk menjalankan aplikasi statis
RUN yarn global add serve

# Copy semua file ke container
COPY . .

# Tentukan ARG untuk menentukan mode (default: 'production')
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build aplikasi dengan environment variables
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build aplikasi
RUN yarn build

# Pilih perintah yang akan dijalankan berdasarkan nilai NODE_ENV
CMD if [ "$NODE_ENV" = "development" ]; \
    then yarn start; \
    else serve -s build -l 5000; \
    fi
