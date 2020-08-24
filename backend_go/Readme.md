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

- run locally
```
go run . 
```

#### docker
To run the backend build and run the available Docker container.

```
docker build -t syntropic-backend -f Dockerfile.dev .
```

## Admin panel

The backend is serving an API but also the HTML files for adding data to the db.
When running locally the admin panel can be accessed at http://localhost:3001/assets/

## Built With

* [Go](https://golang.org/) - Go language 
* [gorilla/mux](ihttps://www.gorillatoolkit.org/) - Request router and dispatcher for incoming request
* [pq](https://github.com/lib/pq) - Postgres Go driver 
