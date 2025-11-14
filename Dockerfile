# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/index.html ./

# Install production dependencies for serving
RUN npm install -g serve

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Change ownership of the app directory
RUN chown -R appuser:nodejs /app
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]