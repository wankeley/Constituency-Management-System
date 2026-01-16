FROM node:20-slim

# Create app directory
WORKDIR /app

# Install required system libraries for Prisma and OpenSSL
RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

# Install app dependencies (including devDependencies for concurrently)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --include=dev

# Copy source
COPY . .

# Generate Prisma client (if present) and build Next
RUN npx prisma generate || true
RUN npm run build

EXPOSE 3000 5000
ENV NODE_ENV=production

# Run database migrations and seed, then start both services with concurrently
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm start"]
