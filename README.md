# Calculadora de Saberes e Competências - RSC TAES

Sistema web para simulação de pontuação do Reconhecimento de Saberes e Competências (RSC) da carreira dos Técnico-Administrativos em Educação (TAES).

## 📋 Sobre o Projeto

Esta calculadora permite aos servidores TAES simular sua pontuação para o RSC com base no Anexo I - Rol único de saberes e competências. O sistema oferece:

- Interface intuitiva e responsiva
- Cálculo automático de pontuação
- Detalhamento das competências e critérios
- Geração de relatório para impressão
- Persistência dos dados durante a sessão

## 🚀 Como Executar

### Usando Docker

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/rsctaes.git
cd rsctaes
```

2. Execute com Docker Compose:
```bash
docker-compose up -d
```

3. Acesse no navegador:
```
http://localhost:8080
```

### Execução Local (sem Docker)

Você pode executar localmente usando qualquer servidor web. Exemplo com Python:

```bash
python -m http.server 8080
```

Ou com PHP:

```bash
php -S localhost:8080
```

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (TailwindCSS)
- JavaScript (Vanilla)
- Docker
- Nginx

## 📝 Notas de Uso

- O sistema é puramente frontend, não requerendo backend
- Os dados são mantidos apenas durante a sessão do navegador
- É possível imprimir ou salvar em PDF o relatório de pontuação
- A calculadora segue estritamente os critérios estabelecidos no documento oficial

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Para dúvidas, sugestões ou contribuições, por favor abra uma issue no repositório.