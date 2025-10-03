# Cosmic Grid

A Node.js / TypeScript service that fetches goal maps and draws its astral objects, using a Crossmint API.

## Architecture

The service is small and simple, but it does validate data correctness (via the `zod` library) and follows clean architecture patterns:

- Entities: business objects (astral items, positions, goals)
- Repositories: data access layer
- Mappers: transform API responses into entities
- Clients: HTTP client for API communication
- Configuration: layer to compose and validate the service configuration

## Getting Started

### Requisites

- Node.js (v22+) and npm.

### Installation

1. Install dependencies:

```bash
npm i
```

2. Configure the environment:

```bash
cp example.env .env
```

Edit `.env` and set your values:

```env
CANDIDATE_ID=your-candidate-id-here
```

### Running the tests

```bash
npm run build && npm run test
```

### Running the service

```bash
npm run start
```
