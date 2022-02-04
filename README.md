# Node - Koa - Boilerplate Project

A boilerplate for a simple api in Node using KOA framework with TypeScript and dependency injection using Inversify.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the dependencies.

```bash
npm install
```

For the authentication in this example we are using JWT token with "ES256" algorithm and async keys. For generate private and public keys for authentication use openssl. We are also using a short-lived token and a long-lived refresh token.

```bash
openssl ecparam -genkey -name prime256v1 -noout -out private.pem
openssl ec -in private.pem -pubout -out public.pem
```

## Usage

Make a copy of .env.example to .env and add database configurations

```bash
# View database migrations status
npm run migrate:status
# Run database migrations
npm run migrate:up
```

```bash
# Start in development mode with nodemon
npm start
```

```bash
# Build
npm run build
```

Swagger docs available at "api/swagger-html" only in development environment

## Copyright and license

Copyright (C) 2022 by the [Aquariophilie team](https://github.com/aquariophilie), all rights reserved.

The code contained in this repository and the executable distributions are licensed under the terms of the MIT license as detailed in the [LICENSE](LICENSE) file.

<!-- EOF -->
