# SyntropicFarming frontend

This is the frontend for the Syntropic farming project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This frontend talks to the API served by the backend found under the `backend` directory of this repository.
The API details need to be added to the `.env` file of this directory.

```
SYNTROPIC_SERVER_API=http://<backend_adress>/api
```

### Installing

#### locally

Use `yarn` to install all dependencies and run the frontend locally.

- install dependencies
```
yarn install 
```

- run locally with auto reload
```
yarn start
```

## Deployment

//todo

## Built With

* [React](https://reactjs.org) - JavaScript UI library
* [webpack](https://webpack.js.org) - JavaScript module bundler