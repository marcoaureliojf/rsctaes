FROM nginx:alpine

# Copiar os arquivos do projeto para o diretório de trabalho do nginx
COPY . /usr/share/nginx/html/

# Expor a porta 80
EXPOSE 80