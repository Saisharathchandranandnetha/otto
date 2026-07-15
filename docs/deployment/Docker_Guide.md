# Docker Guide for Otto

This document outlines how Docker is used within the Otto project, specifically for local development and database management.

## Dockerized Services

The Otto project relies on Docker to provide a consistent database environment.

### Database (`db`)
- **Image**: `pgvector/pgvector:pg16`
- **Purpose**: Provides a PostgreSQL 16 database with the `pgvector` extension for vector operations.
- **Port**: `5432` mapped to the host.
- **Data Persistence**: Uses a Docker volume named `otto_pgdata` to ensure database state is maintained across container restarts.

## Managing the Database Container

The project's `package.json` provides handy scripts to manage the Docker lifecycle.

### Starting the Database
To start the database in detached mode:
```bash
pnpm db:up
```
This is equivalent to running `docker compose up -d db`.

### Stopping the Database
To stop and remove the container:
```bash
pnpm db:down
```
This is equivalent to running `docker compose down`. The data volume `otto_pgdata` will persist.

### Viewing Logs
To view the logs of the database container:
```bash
docker compose logs -f db
```

## Docker Compose Configuration (`docker-compose.yml`)

```yaml
services:
  db:
    image: pgvector/pgvector:pg16
    container_name: otto-db
    environment:
      POSTGRES_USER: otto
      POSTGRES_PASSWORD: otto
      POSTGRES_DB: otto
    ports:
      - "5432:5432"
    volumes:
      - otto_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U otto"]
      interval: 3s
      timeout: 3s
      retries: 10

volumes:
  otto_pgdata:
```

## Production Considerations
Currently, Docker is only explicitly configured for the database in the `docker-compose.yml` file. For a full production deployment using Docker, you would need to create a `Dockerfile` for the Next.js application to containerize the frontend and backend API routes. Otherwise, a standard Next.js deployment (e.g., on Vercel or a traditional Node.js server) paired with a managed PostgreSQL instance is recommended.
