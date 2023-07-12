# CORD Field

This is the UI for the CORD Field application.  
The API is [here](https://github.com/SeedCompany/cord-api-v3).

## Pre-requisites

You can see the complete setup guide for your local environment in the [cord-docs wiki](https://github.com/SeedCompany/cord-docs/wiki#new-hire-on-boarding).

*Note*: Current version of nodejs or at least the LTS version is recommended. If you run in to a compilation with the node server error where the Buffer object does not have a 'blob' property, this is likely the issue. You can check your node version by running `node -v`

## Local Development

1. `yarn install`
2. Ensure local API is running (see below)
3. `yarn gql-gen` to generate schema files from API & operations
4. `yarn start` to run the web server for development

### Connecting to the API Server

By default, this project will attempt to access the [cord api project](https://github.com/SeedCompany/cord-api-v3) that's running locally on your machine on port `3000`.

If you'd like to change the API server that you're connected to, create an `.env.local` file with the following contents:
```dotenv
RAZZLE_API_BASE_URL=http://your-api-server-host.com:3000
```
