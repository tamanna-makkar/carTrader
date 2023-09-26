FROM node:14-alpine AS build
WORKDIR /build

ENV VUE_APP_API_URL='{{ API_URL }}'
ENV VUE_APP_ELASTIC_API_URL='{{ ES_URL }}'
ENV VUE_APP_IMG_URL='{{ IMG_URL }}'

# copy only stuff related to build deps first (for caching)
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
RUN yarn install
COPY . .
RUN yarn build

# create frontend nginx image and copy build result only.
FROM nginx:alpine as frontend
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build /build/dist /app

CMD sed -i -e "s~{{ API_URL }}~$API_URL~g" /app/js/*.js \
    && sed -i -e "s~{{ ES_URL }}~$ES_URL~g" /app/js/*.js \
    && sed -i -e "s~{{ IMG_URL }}~$IMG_URL~g" /app/js/*.js \
    && nginx -g "daemon off;"