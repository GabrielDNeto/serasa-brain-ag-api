# Brain AG - Gestão de Produtores Rurais

Esta API foi desenvolvida para gerenciar produtores, suas propriedades e as safras com culturas plantadas em cada propriedade.

## Tecnologias

- [Node v22.16]("https://nodejs.org/en/download")
- [Nest]("https://nestjs.com/")
- [Docker]("https://www.docker.com/")
- [Prisma]("https://www.prisma.io/")
- [PostgreSQL]("https://www.postgresql.org/")

## Instruções

### Clone

```bash
  git clone https://github.com/GabrielDNeto/serasa-brain-ag-api.git

  # Acesse a pasta
  cd serasa-brain-ag-api
```

---

### Variáveis de Ambiente

_Note:_ Este app foi desenvolvido para fins de teste técnico, então para facilitar o run da aplicação, o arquivo _.env_ foi mantido com todas as informações necessárias.

_NÃO FAÇA ISSO EM PRODUÇÃO_

---

### Rodando com Docker

```bash
 # Certifique-se que você tem o Docker instalado.

 # Subir container Banco de Dados PostgreSQL e container da api
  docker-compose up -d
```

---

### Desenvolvimento

#### 1. Instalando as dependencias

```bash
  npm i
  # ou
  npm install
```

#### 2. Banco de Dados

```bash
 # Certifique-se que você tem o Docker instalado.

 # Subir somente container Banco de Dados PostgreSQL
  docker-compose up postgres -d
```

#### 3. Seeding

```bash
  # Este seed popula o banco de dados com um usuário para acessar a plataforma e alguns dados de produtores, propriedades, safras e culturas.

  npx prisma db seed
```

#### 4. Rodando API

```bash
 npm run start:dev
```

---

### Testes

```bash
  npm test
```

---

### Swagger

```bash
  http://localhost:3001/api
```
