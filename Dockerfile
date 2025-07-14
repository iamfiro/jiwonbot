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

# TypeScript 컴파일러 설치 (tsc 대신 typescript 패키지 설치)
RUN npm install typescript
RUN npm run build

RUN npm run start