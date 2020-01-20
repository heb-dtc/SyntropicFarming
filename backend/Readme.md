# SyntropicFarming backend

This is the backend for the Syntropic farming project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This backend connects to a PostgreSQL database.
The database connection details need to be added to the `.env` file of this directory.

```
PGUSER=user_name
PGHOST=host
PGDATABASE=database_name
PGPASSWORD=database_password
PGPORT=database_port
```

### Installing

#### locally

Use `yarn` to install all dependencies and run the backend locally.

- install dependencies
```
yarn install 
```

- run locally
```
yarn start
```

- run with auto reload
```
yarn dev
```

#### docker
To run the backend build and run the available Docker container.

```
docker build -t syntropic-backend -f Dockerfile.dev .
```

## Deployment

//todo

## Built With

* [Node.js](https://nodejs.org) - Javascript runtime
* [Express](https://expressjs.com) - The web framework used