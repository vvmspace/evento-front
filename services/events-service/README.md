# Events Service

This service is responsible for managing events.

## Endpoints

Check core/models/event.model.ts for the Event model.

### `GET /events`

Returns a list of events.

### `GET /events/:id`

Returns a single event.

### `PUT /events`

Creates a new event.

### `PATCH /events/:id`

## Serverless setup

This service is deployed using the [Serverless Framework](https://serverless.com/).

### SSM Parameters

The following SSM parameters are passed to environment variables in the serverless.yml file:

- `/event-service/${opt:stage, self:provider.stage}/api-key`

### Environment Variables

The following environment variables are used in the serverless.yml file:

```yaml
EVENTS_TABLE: ${opt:stage, self:provider.stage}-events # DynamoDB table name
API_KEY: ${ssm:/event-service/${opt:stage, self:provider.stage}/api-key} # API key for the service
```

## Deploying

To deploy the service, run one of the following commands:

```bash
yarn deploy
```

```bash
npm run deploy
```

```bash
npx serverless deploy
```
