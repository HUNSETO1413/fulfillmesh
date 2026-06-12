# ---- Stage 1: Build ----
# Full install (incl. devDependencies) is required for `next build`
# (Tailwind/PostCSS, TypeScript). The standalone output bundles only the
# runtime dependencies it actually needs into .next/standalone.
FROM node:24-slim AS builder
WORKDIR /app
# puppeteer is dev-only tooling (local screenshots) and is never needed to
# build or run the app — skip its large/fragile Chromium download.
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund \
      --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
COPY . .
RUN npm run build

# ---- Stage 2: Production ----
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server (bundles the runtime node_modules)
COPY --from=builder /app/.next/standalone ./
# Copy static assets
COPY --from=builder /app/.next/static ./.next/static
# Copy public directory
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
