# Home Library Service

## Prerequisites
### Docker Prerequisites
- Docker - [Download & Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose - [Download & Install Docker Compose](https://docs.docker.com/compose/install/)

### Other Prerequisites
- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/)

## Installation

### Downloading
```
git clone https://github.com/RenaSpb/nodejs2024Q3-service
cd nodejs2024Q3-service
git checkout part2
```

### Configuration
Create .env file from .env.example

### Installing NPM modules
```
npm install
```
## Docker Usage
### Build and Run
```
docker-compose up --build
```
The application will be available on http://localhost:4000
PostgreSQL will be running on port 5432

### Container Management
View running containers: ```docker ps```
View logs: ```docker-compose logs```
Restart containers: ```docker-compose restart```
Stop containers: ```docker-compose down```
Clean all: ```npm run docker:clean```

### Docker Hub
Images are available on Docker Hub:

renatamurzina/home-library-app
renatamurzina/home-library-db

### Pull and run images:
```docker pull renatamurzina/home-library-app```
```docker pull renatamurzina/home-library-db```
```npm run docker:pull```

## Development
Running application
```
npm run start
```
## Testing
```
npm run test
```

## Code Quality
```
npm run lint
npm run format
```
