# Petri UI

The user interface for the Petri project.

## Development

### Prerequisites

#### Required

- [Node.js](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)

#### Optional

- [pnpm](https://pnpm.js.org/en/installation)

### Setup

#### Clone the repo

```bash
git clone https://github.com/jt05610/petri-ui
cd petri-ui
```

#### Setup the environment

Copy the `.env.example` file to `.env` and fill in the values

```bash
cp .env.example .env
```

#### Install dependencies

(If you have pnpm installed)

```bash
pnpm install
```

(If you don't have pnpm installed)

```bash
npm install
```

#### Create a PostgreSQL database

```bash
createdb petri
```

#### Set up the database

```bash
npm run setup
```

#### Get the GraphQL schema and documents

```bash
cd petri-graph
git submodule init
```

#### Generate the GraphQL schema

```bash
npm run compile
```

#### Start the development server

```bash
npm run dev
```
