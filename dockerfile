FROM node
COPY frontend/frontend/package.json /app/
COPY frontend /app/

WORKDIR /app
RUN npm install

CMD ["node","page.tsx"]