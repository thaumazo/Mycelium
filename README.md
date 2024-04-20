
# Project Setup
1. Clone this repo with Git
2. Follow database connection instructions in env_ex.txt
3. Install project dependencies with `npm install` (or `pnpm install` or `yarn`)
4. Run the project using:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

# Next Steps
1. Authentication
- enable on Supabase
- Use google account for now (restrict to @thaumazo.org to start?)
- Auth cookies
2. Route Protection
- Disable requests from routes if user is not authenticated
- Provide api auth header pathway? two use cases -> 1. Human using UI (check cookies for auth) 2. API fetch (check included header for auth). Reid currently unsure how to do this, but is confident it is possible
3. Database population
- Can happen at any time. But project should not be hosted with a filled database until Auth and Route Protection are completed

# Notes on Project Structure:
- This app is developed from an API first perspective. Basically all endpoints are publicly accessible via fetch (once hosted)
- This means that all data is loaded via API calls at their respective endpoints, and then that data is turned into html if needed. The reason this is optimal is so that the database interface is only written in a single place, which should be the +server.js file in each route folder. This allows external interfacing, where another server (ex: pipedream) could interface with the application via fetch api calls -> for example:
```fetch(mycelium.thaumazo.org/people)``` 
would return the data seen if a user goes to https://mycelium.thaumazo.org/people. It does this without needing to rewrite the code for each use case. 