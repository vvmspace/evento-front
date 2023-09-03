# Serverless Microservices Boilerplate

This is a boilerplate for building serverless microservices using the [Serverless Framework](https://serverless.com/).

Boilerplate was created as a public version of main repository. Repository will be forked to private repository and used as a base for a commercial project.

## Features

- Monorepo: all services are in the same repository
- TypeScript
- Serverless Framework
- Serverless Offline
- Cloud MongoDB

## Services

- [Events Service](services/events-service/README.md) - Event entity CRUD, using Cloud MongoDB and API_KEY authorization
- [Parser Prototype Service](services/parser-proto-service/README.md) - an example of `core/adapters/event.adapter.ts` usage

## Private services

Private services are added to .gitignore by mask `*-private-service` and not included into public repository.

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

- `/event-service/${opt:stage, self:provider.stage}/mongo-uri` - MongoDB connection string
- `/event-service/${opt:stage, self:provider.stage}/api-key` - API key for the Events Service
- `/event-service/${opt:stage, self:provider.stage}/api-url` - API URL for the Events Service

## To Do

- API Gateway
- Add event bus, e.g. SNS
- Emit event creation event
- Next.js frontend or static site generator
- Add CI/CD
