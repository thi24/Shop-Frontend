# Build stage
FROM node:20-slim AS build

ARG VITE_STRIPE_KEY
ARG VITE_API_BASE_URL
ARG VITE_AUTH_TOKEN
ARG API_PAYMENT_INTENT
ARG PROCESS_ENGINE_START
ARG PROCESS_TOKEN
ARG INDEX_URL
ARG BASE_URL

ENV VITE_STRIPE_KEY=$VITE_STRIPE_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AUTH_TOKEN=$VITE_AUTH_TOKEN
ENV API_PAYMENT_INTENT=$API_PAYMENT_INTENT
ENV PROCESS_ENGINE_START=$PROCESS_ENGINE_START
ENV PROCESS_TOKEN=$PROCESS_TOKEN
ENV INDEX_URL=$INDEX_URL
ENV BASE_URL=$BASE_URL

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# update and install dependency
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y git

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
RUN ls -la /usr/src/nuxt-app/assets/image
RUN npm install
RUN npm run build

# Runtime stage
FROM node:20-slim AS runtime

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# copy build artifacts from build stage
COPY --from=build /usr/src/nuxt-app /usr/src/nuxt-app

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "npm", "start" ]