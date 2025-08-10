# Install dependencies only when needed
FROM node:21-alpine AS deps
WORKDIR /app
# Install OpenSSL dependencies for Prisma and update packages
RUN apk update && apk add --no-cache openssl && apk upgrade
# Install pnpm
RUN npm install -g pnpm@9.12.2
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Rebuild the source code only when needed
FROM node:21-alpine AS builder
WORKDIR /app
# Install OpenSSL dependencies for Prisma and update packages
RUN apk update && apk add --no-cache openssl && apk upgrade
# Install pnpm
RUN npm install -g pnpm@9.12.2
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Set DATABASE_URL for Prisma client generation with a fallback
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/tracker}
# Generate Prisma client and build the application
RUN echo "Generating Prisma client..." && pnpm prisma generate
RUN echo "Building Next.js application..." && pnpm build
# Verify that build artifacts exist and fail if they don't
RUN echo "Verifying build artifacts..." && \
    test -d /app/.next || (echo "Next.js build directory not found" && exit 1) && \
    test -d /app/public || (echo "Public directory not found" && exit 1) && \
    test -d /app/node_modules || (echo "Node modules not found" && exit 1)
# List contents for debugging
RUN echo "=== Builder stage contents ===" && ls -la /app
RUN echo "=== .next contents ===" && ls -la /app/.next || echo "No .next directory"
RUN echo "=== public contents ===" && ls -la /app/public || echo "No public directory"

# Production image, copy all the files and run next
FROM node:21-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Install OpenSSL dependencies for Prisma runtime and update packages
RUN apk update && apk add --no-cache openssl && apk upgrade
# Install pnpm
RUN npm install -g pnpm@9.12.2
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy files from builder with verification
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY start.sh ./

# Copy the generated Prisma client from builder if it exists
RUN if [ -d "/app/node_modules/.prisma" ]; then cp -r /app/node_modules/.prisma ./node_modules/; fi

RUN chmod +x start.sh

# Fix ownership of all files to the nextjs user
RUN chown -R nextjs:nodejs /app

USER 1001

EXPOSE ${PORT:-3000}

CMD ["./start.sh"]


