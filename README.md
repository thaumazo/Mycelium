# Project introduction

## Project Structure
This project includes 3 large components
1. Supabase
2. Sveltekit 
3. Tailwind & Daisy UI


# Project Setup
1. Clone this repo with Git
2. Follow database connection instructions in env_ex.txt
3. Install project dependencies with `npm install` (or `pnpm install` or `yarn`). This requires having npm installed on your computer (https://nodejs.org/en/download)
4. Run the project using:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

It is recommended to use VS code as your main code editor for this project, which can be downloaded here (https://code.visualstudio.com/download)
 
# Project Tasks
✅ = Complete
➡️ = In progress
⌛ = Planned/Upcoming

1. ~~Authentication~~ ✅
- Sign in via Google (thaumazo.org accounts only)
- Database has now been secured and will check for an API key on any request. If invalid API will deny request. If no API key is provided it will check for an authenticated user. Then if there is no user it will deny the request.
2. ~~Route Protection~~ ✅
- Anyone visiting with a browser who is not signed in will be redirected to the /auth page to sign in. Uses 
3. Database population ➡️
- In progress: defining database tables & data connections
- Easiest way to port from notion is to export notion table as CSV and then import that into supabase. 
4. ~~Database endpoints~~ ✅
- Creating routes for each table in the database. 
- this approach has been wildly successful and has become a core part of the functionality of the application. queries can be edited directly in the url, making it easy to copy for later
5. Fine grained roles and permissions ⌛
- Right now all users are treated equally. Plan is to add roles (ex: 'user', 'developer', 'admin) which will affect which actions a user can take on which parts of the database. These roles can also be attached to API keys. Only developers and above should be able to generate API keys.
- all tables are also being treated equally, and all tables can be accessed via the table/[data] endpoint. A combo of RLS and, api key checking, and table access customization can be used to increase security.
6. Self hosting ⌛
- Reid looking into options for local deploys of database using docker. Will investigate more earnestly after building out database and endpoints.

## More tasks brain dump
- langchain ⌛
    - install
- supabase api request helper ➡️
- fetch request database table ➡️
- workflow table ⌛
    - stringing together functions, fetches, langchain into an editable workflow 
- custom functions table ⌛
- Tasks table ➡️
    - basically exactly this section of the readme, but embedded into the project so it can contain more context like exact page/table, project, status, people assigned, hours allocated, etc...
    - yes, it does make sense to manage this ourselves rather than outsource it to an app like todoist

 
# Notes on Project Structure:
- This app is developed from an API first perspective. Basically all endpoints are publicly accessible via fetch (once hosted)
- This means that all data is loaded via API calls at their respective endpoints, and then that data is turned into html if needed. The reason this is optimal is so that the database interface is only written in a single place, which should be the +server.js file in each route folder. This allows external interfacing, where another server (ex: pipedream) could interface with the application via fetch api calls -> for example:
```fetch(mycelium.thaumazo.org/people)``` 
would return the data seen if a user goes to https://mycelium.thaumazo.org/people. It does this without needing to rewrite the code for each use case. 
Ideally, search params and filters will also be added to url so a user can create a query using the web GUI and then just copy and paste the url into a fetch request ex:
```fetch(mycelium.thaumazo.org/people?organization="thaumazo"&name="Reid")``` 


# How to make the api access
Things that I did
- update hooks to validate jwt keys
- add jwt env variable
  - add that to netlify
- give service role ability to sign api_users (GRANT api_user TO service_role;)
- give api_users access to public schema (GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "public" TO api_user;)
