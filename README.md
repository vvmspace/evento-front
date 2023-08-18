# Serverless Microservices Boilerplate

This is a boilerplate for building serverless microservices using the [Serverless Framework](https://serverless.com/).

## Features

- Monorepo: all services are in the same repository
- TypeScript
- Serverless Framework
- Serverless Offline
- DynamoDB

## Services

- [Events Service](services/events-service/README.md) - Event entity CRUD, using DynamoDB and API_KEY authorization
- [Parser Prototype Service](services/parser-proto-service/README.md) - an example of `code/adapters/event.adapter.ts` usage

## Structure

- `core` - shared code
- `core/models` - shared models
- `core/adapters` - shared adapters
- `services` - services
- `services/<service-name>/src` - service source code
- `services/<service-name>/src/handlers` - service handlers
- `services/<service-name>/src/utils` - service utils
- `services/<service-name>/serverless.yml` - service configuration


## Common SSM Parameters

The following SSM parameters are passed to environment variables in the serverless.yml files:

- `/event-service/${opt:stage, self:provider.stage}/api-key` - API key for the Events Service
- `/event-service/${opt:stage, self:provider.stage}/api-url` - API URL for the Events Service