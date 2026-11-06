FROM node:20-alpine AS runner

WORKDIR /app

# Install dependencies separately for layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Run as non-root user for security
USER node

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "src/server.js"]
