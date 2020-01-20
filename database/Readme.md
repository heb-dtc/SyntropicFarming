# SyntropicFarming database

This is the database for the Syntropic farming project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The database is using PostgreSQL.
For now, the data is linked to the docker container. If the container is destroyed so is the data.

### Installing

To run the database, build and run the available Docker container.

```
docker build -t syntropic-db -f Dockerfile.dev .
```

```
docker run -d --name syntropic-db-container -p 5555:5432 syntropic-db
```

## Deployment

//todo

## Built With

* [PostgreSQL](postgresql.org) - Relational database management system 