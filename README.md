# Node.js Docker Application

This project demonstrates how to deploy a Node.js application using Docker with separate frontend and backend containers that communicate with each other.

## Project Structure

```
Docker/
├── client/              # Frontend application
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── public/
│   │   └── index.html
│   └── .dockerignore
├── backend/             # Backend API
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── user.js
│   │   └── user.test.js
│   └── .dockerignore
└── docker-compose.yml   # Orchestration file
```

## Prerequisites

- Docker Desktop installed on your system
- Basic understanding of Docker and Node.js

## Installation

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/

2. Clone or copy this project to your local machine

## Building and Running

### Option 1: Using Docker Compose (Recommended)

Build and start both containers:

```bash
docker-compose up --build
```

This will:
- Build the backend and frontend Docker images
- Start both containers
- Create a network for communication between containers
- Map ports 3000 (backend) and 8080 (frontend) to your host machine

### Option 2: Running Backend Only

Build and run the backend container:

```bash
cd backend
docker build -t node-backend .
docker run -p 3000:3000 node-backend
```

### Option 3: Running Frontend Only

Build and run the frontend container:

```bash
cd client
docker build -t node-client .
docker run -p 8080:8080 -e BACKEND_URL=http://localhost:3000 node-client
```

## Accessing the Application

Once the containers are running:

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

The frontend provides a simple interface to fetch users from the backend API.

## Stopping the Containers

### Using Docker Compose:

```bash
docker-compose down
```

### Using Docker:

```bash
docker stop node-backend node-client
docker rm node-backend node-client
```

## Docker Configuration Details

### Backend Dockerfile

- Uses Node.js 20 Alpine image
- Installs production dependencies only
- Exposes port 3000
- Runs `node server.js` as the default command

### Client Dockerfile

- Uses Node.js 20 Alpine image
- Installs production dependencies only
- Exposes port 8080
- Runs `node server.js` as the default command
- Uses axios to communicate with the backend

### Docker Compose

- Creates a bridge network for container communication
- Backend service runs on port 3000
- Frontend service runs on port 8080
- Frontend connects to backend using the service name "backend"
- Both containers restart automatically unless stopped manually

## Testing the Application

1. Open http://localhost:8080 in your browser
2. Click the "Fetch Users from Backend" button
3. The application will make a request to the backend API
4. Users will be displayed if the backend is running correctly

## Troubleshooting

### Container won't start

Check the logs:
```bash
docker logs node-backend
docker logs node-client
```

### Port already in use

Change the port mapping in docker-compose.yml:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead of 3000
```

### Frontend can't connect to backend

- Ensure both containers are running
- Check that they are on the same Docker network
- Verify the BACKEND_URL environment variable is correct

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)