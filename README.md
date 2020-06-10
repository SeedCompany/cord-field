# CORD Field

## Developer Setup

- `yarn`
- symlink the graphql schema file from the server.  
  This allows your editor to be smart with the graphql queries and provides it for the typescript generation.  
  (The server will automatically generate this file on run.)  
  Example:

  ```shell
  ln -s ../cord-api-v3/schema.graphql
  ```

To run the web server (for development) run: `yarn start`

To view storybook run: `yarn storybook`

### Connecting to API Server

By default, this project will attempt to access the `cord-api-v3` project that's running locally on your machine.

If you'd like to change the API server that you're connected to: create an `.env.local` file with the following contents:

```
REACT_APP_API_BASE_URL=http://your-api-server-host.com:3000
```
