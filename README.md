# node-koa-boilerplate

[![GitHub Super-Linter](https://github.com/aquariophilie/node-koa-boilerplate/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

A boilerplate for a simple API in [Node.js](https://nodejs.org/) using the [Koa.js framework](https://koajs.com/) with [TypeScript](https://www.typescriptlang.org/) and dependency injection using [InversifyJS](https://inversify.io/).

## Prerequisites

* [Node.js](https://nodejs.org/) v14.x or later
* Connection details (URI, user, password and db name) to a running instance of [MongoDB](https://www.mongodb.com/)

### Prerequisites for Kubernetes deployment with Helm chart

* You have [kubectl](https://kubernetes.io/docs/tasks/tools/) installed and configured for your cluster

* You have a Kubernetes cluster like [Minikube](https://kubernetes.io/docs/setup/minikube/)

* You have the [Helm](https://helm.sh/docs/intro/install/) command line installed

* You have created and published a Docker image for your application, in this example we use the public repository rafaelesposito/node-koa-boilerplate

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the dependencies.

```bash
npm install
```

For the authentication in this example we are using a [JWT](https://jwt.io/) token with "ES256" algorithm and async keys.
For generating private and public keys for authentication use [OpenSSL](https://www.openssl.org/).
We are also using a short-lived token and a long-lived refresh token.

```bash
openssl ecparam -genkey -name prime256v1 -noout -out private.pem
openssl ec -in private.pem -pubout -out public.pem
```

## Usage

### Runtime customization

Before running the code you need to customize its runtime enviroment.
Create an `.env` file starting from the provided `.env.example`, then customize it as described in the comments
(for instance you need the supply the database configuration).

### Initialize (or migrate) database

```bash
# View database migrations status
npm run migrate:status
# Run database migrations
npm run migrate:up
```

### Start in development mode

```bash
# Start in development mode with nodemon
npm start
```

### Build for production

Make sure your `.env` file has the line `NODE_ENV=development` commented out, then run

```bash
# Build
npm run build
```

### Deploy to Kubernetes using the chart

From the directory `chart` run:

```sh
# Deploy with helm
helm install my-release koa-mongo-k8s
```

For change the database username and password create the secrets with base64 encoded:
```sh
echo -n 'username' | base64
dXNlcm5hbWU=

echo -n 'password' | base64
cGFzc3dvcmQ=
```
and replace the values ​​in the secret.yaml file.

### API documentation

Documentation built with [Swagger](https://swagger.io/) is available under "api/swagger-html" (only in development environment).

## Copyright and license

Copyright (C) 2022 by the [Aquariophilie team](https://github.com/aquariophilie), all rights reserved.

The code contained in this repository and the executable distributions are licensed under the terms of the MIT license as detailed in the [LICENSE](LICENSE) file.

<!-- EOF -->
