## Quick start

Running locally while watching filesystem for changes, for development.

1. Run `npm i` to install dependencies.
2. To run and auto-rebuild when changes occur, use:
   - `npm start` if you want to **run frontend locally, but use staging server backend for API calls** (https://interactions.dev.deepsine.com/api/)
   - `npm start-local` if you **are also running the backend locally** (http://localhost:8000/)
3. Go to `localhost:3000`

## Building

Building static app that can be deployed to production and server by a
server like Nginx.

- **Build for production:** `npm run build` - this will build a version of the app
  optimized for production (not debuggable with React and Redux browser tools), and
  which uses **https://interactions.otsuka.deepsine.com/api/ for API calls**

  - do this after each merging of `dev` branch into `master` (production) branch!

- **Build for deployment to staging server:** `npm run build-staging` - builds a version
  of the app which uses **https://interactions.dev.deepsine.com/api/ for API calls**
  and is optimized for production

_IMPORTANT NOTE:_ Commands that use the staging server API have evironment
variable `NODE_ENV=development`, and those intended for fully local development
have `NODE_ENV=''`. If you control execution by manually setting env vars instead,
take care at this!
