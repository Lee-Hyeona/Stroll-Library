# Build stage
FROM node:20 AS build

WORKDIR /app

# 수정 (에러 방지용으로 명시적 제거 후 재설치)
COPY package.json package-lock.json ./
RUN rm -rf node_modules package-lock.json && npm install

# 전체 소스 코드 복사 후 빌드 실행
COPY . .
RUN npm run build

# 2️⃣ Nginx를 사용하여 정적 파일 서빙
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
