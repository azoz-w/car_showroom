# showrooms challenge

A full-stack application for managing car showrooms and their inventory.

## Prerequisites

- Java 21
- Node.js 20.x
- Docker & Docker Compose
- PostgreSQL (if running without Docker)

## Getting Started

### 1. Database Setup

Clone the repository and start the database using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/azoz-w/car_showroom.git
cd showroom-management

# Start PostgreSQL container
docker-compose up -d
```

Docker Compose file (docker-compose.yml):
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:latest
    container_name: showroom-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: showroom_db
    ports:
      - "5432:5432"
    volumes:
      - showrooms_data:/var/lib/postgresql/data

volumes:
  showrooms_data:
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd API/showrooms

# Build the project
./gradlew build

# Run the application
./gradlew bootRun
```

The backend will be available at `http://localhost:8080`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd showrooms_ui

# Install dependencies
npm install

# Run the development server
npm run start
```

The frontend will be available at `http://localhost:4200`

## API Documentation

### Swagger UI
The API documentation is available through Swagger UI when the backend is running:
- URL: `http://localhost:8080/swagger-ui.html`

### Postman Collection
A Postman collection is included for API testing:

1. Import the collection from `postman/Showroom-Management.postman_collection.json`

2. Run the "Login" request first to get the authentication token
    - the username and password are "admin" and " admin123" respectively
    - The token will be automatically set in the environment variables
    - All subsequent requests will use this token

## Authentication

The application uses JWT for authentication. To access protected endpoints:

1. Get a token using the login endpoint:
```bash
POST /api/auth/login
{
    "username": "admin",
    "password": "admin123"
}
```

## Project Structure

```
showroom-management/
├── API/
│     └── showrooms/     
│           ├── src/
│           │   └── main/
│           │        ├── java/
│           │        └── resources/
│           │
│           └── build.gradle
├── showroom_ui/
│   ├── src/
│   │   ├── app/
│   │   └── environments/
│   ├── package.json
│   └── angular.json
├── docker-compose.yml
└── README.md
```

## Database Migrations

Migrations are handled by Flyway and run automatically when the application starts.

Location: `API/showrooms/src/main/resources/db/migration`

## Assumptions 
1. Car list api is assumed to be fetched with regards to a showroom commercial registration number, for use in the showroom details api
2. 