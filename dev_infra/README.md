# Development Infrastructure

This folder contains the development infrastructure setup for the project.

## Database Setup

### Quick Start

1. Start the development database:

   ```bash
   cd dev_infra
   docker compose up -d
   ```

   **Or use the helper scripts:**

   **Linux/macOS:**

   ```bash
   cd dev_infra
   ./start-db.sh
   ```

   **Windows:**

   ```powershell
   cd dev_infra
   .\start-db.ps1
   ```

2. The database will be available at:
   - Host: `localhost`
   - Port: `5432`
   - Database: `tracker`
   - Username: `postgres`
   - Password: `postgres`

3. Update your `.env` file with:

   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tracker?schema=public
   ```

4. Run Prisma commands:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   pnpm prisma db push
   ```

### Stopping the Database

```bash
cd dev_infra
docker compose down
```

### Resetting the Database

```bash
cd dev_infra
docker compose down -v
docker compose up -d
```

## Environment Variables

The following environment variables are required for development:

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to `development` for local development
