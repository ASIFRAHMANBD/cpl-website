FROM node:20-alpine AS deps
WORKDIR /app
# Clean install to prevent compromised dependencies
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci --no-audit --prefer-offline --no-fund && \
    npm cache clean --force && \
    # Security: Remove unnecessary files and reduce attack surface
    find . -name "*.md" -delete && \
    find . -name "*.map" -delete && \
    find . -name "test" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find . -name "tests" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find . -name "__tests__" -type d -exec rm -rf {} + 2>/dev/null || true

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# Disable telemetry and ensure clean build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
# Security and performance environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=512 --max-http-header-size=16384"
ENV MEMORY_LIMIT=512MB
ENV CPU_LIMIT=1

# Create non-root user with minimal permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Only copy production artifacts
COPY --from=builder --chown=appuser:appgroup /app/.next ./.next
COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules

# Set proper permissions and security hardening
RUN chmod -R 755 /app && \
    chmod -R 755 /app/.next && \
    # Additional security hardening
    find /app -type f -name "*.js" -exec chmod 644 {} \; && \
    find /app -type f -name "*.json" -exec chmod 644 {} \; && \
    find /app -type f -name "*.html" -exec chmod 644 {} \; && \
    # Remove write permissions from all files
    find /app -type f -exec chmod a-w {} \; 2>/dev/null || true && \
    # Remove setuid/setgid bits
    find /app -type f \( -perm -4000 -o -perm -2000 \) -exec chmod a-s {} \; 2>/dev/null || true

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

EXPOSE 3000
USER appuser
CMD ["npm", "run", "start"]

