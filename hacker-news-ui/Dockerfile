# Build stage
FROM node:24-slim AS build
WORKDIR /app
COPY . .
RUN apt-get update && apt-get upgrade -y && apt-get install -y --only-upgrade nodejs npm && rm -rf /var/lib/apt/lists/*
RUN npm install && npm audit fix --force && npm run build -- --output-path=dist

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 