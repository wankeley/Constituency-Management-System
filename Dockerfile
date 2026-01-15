FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client (if present) and build Next
RUN npx prisma generate || true
RUN npm run build

EXPOSE 3000
ENV PORT=3000

# Start both server and Next in production
CMD ["sh", "-c", "npm run start"]
