# Docker Deployment Guide for Node.js Application

## Current Status

✅ **Docker Configuration Complete** - All Docker files are ready
✅ **Application Tested** - Backend and frontend work perfectly without Docker
⏳ **Docker Installation Required** - Docker Desktop needs to be installed manually

## Quick Start (After Docker Installation)

### 1. Install Docker Desktop

Download and install Docker Desktop from: https://www.docker.com/products/docker-desktop/

After installation, verify with:
```bash
docker --version
docker-compose --version
```

### 2. Build and Run with Docker Compose

Navigate to the Docker directory and run:
```bash
cd Docker
docker-compose up --build
```

This will:
- Build both backend and frontend Docker images
- Create a Docker network for communication
- Start both containers
- Map ports: backend (3000) and frontend (8080)

### 3. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **API Endpoint**: http://localhost:3000/users

### 4. Stop the Application

```bash
docker-compose down
```

## Manual Docker Commands (Alternative Approach)

### Build Backend Container
```bash
cd backend
docker build -t node-backend .
```

### Run Backend Container
```bash
docker run -p 3000:3000 --name node-backend node-backend
```

### Build Frontend Container
```bash
cd client
docker build -t node-client .
```

### Run Frontend Container
```bash
docker run -p 8080:8080 -e BACKEND_URL=http://backend:3000 --name node-client node-client
```

### Stop Containers
```bash
docker stop node-backend node-client
docker rm node-backend node-client
```

## Docker Configuration Details

### Backend Dockerfile (backend/Dockerfile)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Frontend Dockerfile (client/Dockerfile)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

### Docker Compose Configuration (docker-compose.yml)
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: node-backend
    ports:
      - "3000:3000"
    networks:
      - app-network
    restart: unless-stopped

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: node-client
    ports:
      - "8080:8080"
    environment:
      - BACKEND_URL=http://backend:3000
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge
```

## Testing the Application

### Test Backend API
```bash
curl http://localhost:3000/users
```

Expected response:
```json
{
  "users": [
    {"id": 1, "name": "John Doe", "email": "john@example.com"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com"},
    {"id": 3, "name": "Bob Johnson", "email": "bob@example.com"}
  ]
}
```

### Test Frontend
1. Open http://localhost:8080 in your browser
2. Click "Fetch Users from Backend" button
3. Verify users are displayed

### Test Container Communication
```bash
# Check if containers are running
docker ps

# Check backend logs
docker logs node-backend

# Check frontend logs
docker logs node-client

# Test communication from frontend container
docker exec node-client curl http://backend:3000/users
```

## Docker Commands Reference

### Container Management
- `docker ps` - List running containers
- `docker ps -a` - List all containers
- `docker stop <container>` - Stop a container
- `docker start <container>` - Start a stopped container
- `docker rm <container>` - Remove a container
- `docker logs <container>` - View container logs

### Image Management
- `docker images` - List images
- `docker build -t <name> .` - Build an image
- `docker rmi <image>` - Remove an image

### Docker Compose
- `docker-compose up` - Start services
- `docker-compose up --build` - Rebuild and start
- `docker-compose down` - Stop and remove services
- `docker-compose logs` - View logs
- `docker-compose ps` - List services

## Troubleshooting

### Port Already in Use
If port 3000 or 8080 is already in use:
```bash
# Find process using the port
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Container Won't Start
```bash
# Check logs for errors
docker logs node-backend
docker logs node-client

# Rebuild images
docker-compose build --no-cache
docker-compose up
```

### Frontend Can't Connect to Backend
- Ensure both containers are running: `docker ps`
- Check they're on the same network: `docker network inspect app-network`
- Verify backend URL in frontend logs: `docker logs node-client`

### Docker Desktop Won't Start
- Ensure WSL 2 is enabled (Windows 10/11)
- Check virtualization is enabled in BIOS
- Restart Docker Desktop
- Check Docker Desktop logs for errors

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Docker Host                           │
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐      │
│  │   Frontend       │         │    Backend       │      │
│  │   Container      │────────▶│   Container     │      │
│  │   Port: 8080     │         │   Port: 3000     │      │
│  │   node-client     │         │   node-backend    │      │
│  └──────────────────┘         └──────────────────┘      │
│         ▲                           ▲                  │
│         │                           │                  │
│    Port 8080                   Port 3000             │
│         │                           │                  │
└─────────┼───────────────────────────┼──────────────────┘
          │                           │
    http://localhost:8080      http://localhost:3000
          │                           │
    Browser/Client              API Requests
```

## Key Features

1. **Containerization**: Both backend and frontend run in isolated containers
2. **Networking**: Containers communicate via Docker bridge network
3. **Port Mapping**: Backend (3000) and Frontend (8080) accessible from host
4. **Auto-restart**: Containers restart automatically unless stopped manually
5. **Production Ready**: Uses production dependencies only
6. **Scalable**: Easy to scale by adding more containers

## Next Steps

1. Install Docker Desktop
2. Run `docker-compose up --build`
3. Test the application
4. Explore Docker features (volumes, networks, etc.)
5. Consider adding:
   - Database container (MongoDB, PostgreSQL)
   - Reverse proxy (Nginx)
   - CI/CD pipeline
   - Monitoring and logging

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Docker Hub](https://hub.docker.com/)