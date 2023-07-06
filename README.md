# CORD Field

## Developer Setup

- `yarn`

*note*: Node 15+ is required and 18+ is recommended. If you run in to an compilation with the node server error where the Buffer object does not have a 'blob' property this is likely the issue. You can check your node version by running 'node -v'

First run the graphql server 'yarn gql-gen'

Next to run the web server (for development) run: `yarn start`

### Connecting to the API Server

By default, this project will attempt to access the `cord-api-v3` project that's running locally on your machine.

If you'd like to change the API server that you're connected to: create an `.env.local` file with the following contents:

```
REACT_APP_API_BASE_URL=http://your-api-server-host.com:3000
```
