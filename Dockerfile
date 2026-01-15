FROM node:20-slim

# Create app directory
WORKDIR /app

# Install required system libraries for Prisma and OpenSSL
RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client (if present) and build Next
RUN npx prisma generate || true
RUN npm run build

EXPOSE 3000 5000
ENV NODE_ENV=production

# Start both server and Next in production
# Express runs on 5000, Next.js runs on 3000
CMD ["sh", "-c", "node server/src/app.js & next start -p 3000"]
