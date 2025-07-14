# 멀티스테이지 빌드를 위한 베이스 이미지
FROM node:22-alpine AS base

# 필요한 시스템 의존성 설치 (Prisma 등을 위해)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# 패키지 의존성 복사 및 설치
COPY package*.json ./
COPY prisma ./prisma/

# 프로덕션 의존성만 설치
RUN npm ci --only-production && npm cache clean --force

# 빌드 스테이지
FROM base AS build
COPY . .
RUN npm install typescript
RUN npx prisma generate
RUN npm run build

# 프로덕션 스테이지
FROM base AS production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/images ./images

# 비루트 사용자 생성 및 권한 설정
RUN addgroup -g 1001 -S nodejs \
    && adduser -S discord -u 1001 \
    && chown -R discord:nodejs /app
USER discord

# 앱 시작
CMD ["npm", "start"]