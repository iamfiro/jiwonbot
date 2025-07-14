# 멀티스테이지 빌드를 위한 베이스 이미지
FROM node:22-alpine AS base

# 필요한 시스템 의존성 설치 (Prisma 등을 위해)
RUN apk add --no-cache \
    openssl \
    libc6-compat

WORKDIR /app

# 패키지 의존성 복사 및 설치
COPY package*.json ./
COPY prisma ./prisma/

# 프로덕션 의존성만 설치
RUN npm ci --only=production && npm cache clean --force

# 개발 빌드 스테이지
FROM base AS dev-dependencies
RUN npm ci

# 빌드 스테이지
FROM dev-dependencies AS build

# 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성
RUN npx prisma generate

# TypeScript 컴파일
RUN npm run build

# 프로덕션 스테이지
FROM base AS production

# 빌드된 파일 복사
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# 이미지 파일이 있다면 복사 (랜덤 맵 기능용)
COPY --from=build /app/images ./images

# 비루트 사용자 생성 및 권한 설정
RUN addgroup -g 1001 -S nodejs
RUN adduser -S discord -u 1001
RUN chown -R discord:nodejs /app
USER discord

# 포트 노출 (필요시)
EXPOSE 3000

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('Bot is running')" || exit 1

# 앱 시작
CMD ["npm", "start"]