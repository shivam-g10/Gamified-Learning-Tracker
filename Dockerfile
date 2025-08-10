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
# Set DATABASE_URL for Prisma client generation
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
RUN pnpm prisma generate && pnpm build

# Production image, copy all the files and run next
FROM node:21-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Install OpenSSL dependencies for Prisma runtime and update packages
RUN apk update && apk add --no-cache openssl && apk upgrade
# Install pnpm
RUN npm install -g pnpm@9.12.2
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

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

EXPOSE 3000

CMD ["./start.sh"]


