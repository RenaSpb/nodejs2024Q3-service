# Home Library Service

## Prerequisites
- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading
git clone https://github.com/RenaSpb/nodejs2024Q3-service

## Configuration
Create .env file from .env.example

## Installing NPM modules`
npm install

## Running application
npm start:dev

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing
After application running open new terminal and enter:

To run all tests without authorization

npm run test

To run only one of all test suites
npm run test -- <path to suite>


### Auto-fix and format
npm run lint
npm run format

### Users
- `GET /user` - get all users
- `GET /user/:id` - get single user by id
- `POST /user` - create user
- `PUT /user/:id` - update user's password
- `DELETE /user/:id` - delete user

### Artists
- `GET /artist` - get all artists
- `GET /artist/:id` - get single artist by id
- `POST /artist` - create artist
- `PUT /artist/:id` - update artist
- `DELETE /artist/:id` - delete artist

### Albums
- `GET /album` - get all albums
- `GET /album/:id` - get single album by id
- `POST /album` - create album
- `PUT /album/:id` - update album
- `DELETE /album/:id` - delete album

### Tracks
- `GET /track` - get all tracks
- `GET /track/:id` - get single track by id
- `POST /track` - create track
- `PUT /track/:id` - update track
- `DELETE /track/:id` - delete track

### Favorites
- `GET /favs` - get all favorites
- `POST /favs/track/:id` - add track to favorites
- `DELETE /favs/track/:id` - remove track from favorites
- `POST /favs/album/:id` - add album to favorites
- `DELETE /favs/album/:id` - remove album from favorites
- `POST /favs/artist/:id` - add artist to favorites
- `DELETE /favs/artist/:id` - remove artist from favorites


### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
