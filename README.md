# Cord Field
This is the front end for the Cord Field application of the Cord Platform.  

# Starting

1. Clone the project
1. yarn
1. yarn start

## Dependencies

You will need the following:

* Node (8+)
* [Angular CLI](https://github.com/angular/angular-cli)
* [Docker](https://www.docker.com/community-edition)
* [amazon-ecr-credential-helper](https://github.com/awslabs/amazon-ecr-credential-helper), see set up hints in the [Appendix](#set-up-amazon-ecr-credential-helper) 
* [yarn](https://yarnpkg.com/lang/en/docs/install/)
* Access to AWS ECR (talk to J.P. or Daniel to get this)

# Testing
```
yarn test
```
This will docker compose a test environment with the latest profile server and a mongoDB server.

While the tests are running, you can connect to:

* MongoDB - localhost:37001
* Profile server - localhost:8001
* Project Language Organization server - localhost:8002

If you need to monitor traffic coming into the profile server, run `docker ps`. You will see a list of containers; one of these containers will be named something like `docker_profile-service_1`.

Whatever that name is (it should probably be that exact name, `docker_ilb-profile-service_1`), use it with this command:
```
docker logs -f docker_profile-service_1
```

Behold the logging glory as connections come in.

## Test users
Creating users requires that their email addresses be confirmed. Since email is disabled during unit testing, this isn't available to you, so you have to use one of the test users:

Import the `testUsers` object into your tests for access to the test users' details and their credentials. If you need more test users, this is done on the server side via the bootstrap function for QA. 

## Failing Tests
If you get weird / unexpected errors (e.g., tests were passing and suddenly lots of things are broken and you didn't change much or anything), try quitting `yarn test` (control-c), then make sure docker has no running containers:
```
docker ps
```

You can remove a running docker container with:
```
docker rm -f CONTAINER_ID
```

If things are really weird, try:
```
docker system prune -f
```

If that didn't help... your "small" change probably has bigger implications than you realized... take a deep breath... thank the unit tests for saving you... and track down the problem you just introduced.

Sometimes it's helpful to "stash" all of your changes in in git to make sure the tests are passing without any of your changes.

## Testing Courtesy
It's easy to get frustrated because tests are broken. It's even easier to resolve that frustration by simply commenting out or disabling tests. This defeats the whole purpose/advantage of automated testing. If you disable tests so that you do no have to deal with them, keep in mind that you just made this someone else's problem. This is not only extremely rude, it is not acceptable for developers working on this project. Fix your tests if you break them.  

# Environments
This project is integrated with the Olive Technology CI/CD eco-system, which is built around Atlassian Bamboo (https://bamboo.olivetech.com). 

The configuration for various environments is located in: `src/environments`:

* `src/environments/environment.bamboo.ts`: used by Bamboo when running automated unit tests
* `src/environments/environment.dev.ts`: used by https://cord-field-dev.ci.olivetech.com
* `src/environments/environment.sqa.ts`: used by https://cord-field-sqa.ci.olivetech.com
* `src/environments/environment.uat.ts`: used by https://cord-field-uat.ci.olivetech.com
* `src/environments/environment.ts`: used by `yarn start` for local builds and local `yarn test`.

TypeScript will use the `src/environments/environment.ts` file to determine the shape of the `environment` object that's imported into various parts of the application. `src/environments/environment.ts` gets replaced by the afore mentioned environment files based on the environment that's being deployed to.

# Angular CLI

This project does use Angular CLI (`ng`). Note, however, that you should not use `ng serve` or `ng test` as these commands will not launch the required docker environments to support the application. Instead, use `yarn start` or `yarn test`.

# Production Testing

`yarn run start:production` will load the client build with the production configuration. Be careful, this points to production.

In the console of a browser, you can type `ilbDebug` to get the current configuration for conformation purposes.

# Appendix
## Set up amazon-ecr-credential-helper
Several new team members have had issues with getting set up with access to docker so that docker can pull the server images from the development server.  The following steps are specifically for __MacOS__ set up.  
1) Make sure docker is installed.
1) Make sure AWS CLI is installed.  version 1.14+.  If you have homebrew installed `brew install awscli`. This might prompt you to `xcode-select --install` for xcode command line tools to be installed.
1) Clone the repository from [github](https://github.com/awslabs/amazon-ecr-credential-helper).
1) In the cloned repo, `make docker TARGET_GOOS=darwin`. 
1) Verify this last step by running `./bin/docker-credential-ecr-login`.  You should have a Usage help message.  
1) Either add the path to the resulting ` bin` directory to your path or move the resulting binary `docker-credential-ecr-login` to a directory in your path.  `echo $PATH` for a list of places you can put it. 
1) Verify the last step with `which docker-credential-ecr-login`
1) edit `~/.docker/config.json` to 
```json
{
	"credsStore": "ecr-login"
}
```
1) If you need to request AWS credentials from JP or Daniel, you will need a way to send and receive encrypted messages. We will __NOT__ send you AWS secret keys unencrypted ever.  Mac users can go get the [GPG Suite](http://gpgtools.org.  After installing that, generate a key, and export your public key to a file.  Send one of us the public key.  
1) When you have the keys, add them to `~/.aws/credentials`
format will be similar to 
```text
[default]
aws_access_key_id = AKsomecharactersandnumbers
aws_secret_access_key = SOMEOTHERCHARACTERSANDNUMBERS
```
1) Test the setup with `docker pull 103805181946.dkr.ecr.us-west-2.amazonaws.com/client/tsco-ilb-profile:latest`.  That should download the docker image for the profile server.
