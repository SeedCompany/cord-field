Notes for Webstorm setup:

1) yarn start  (to start the application locally so that the tests can be run against it

2) Create 'Run/Debug' configurations for each suite.
  Example:
     Menu--> Run : Edit Configuarations : + :

     Node.js

     Name: Protractor fist tests suite
     Working directory: ~/Documents/develop/cord2/cord-field
     Javascript file: node_modules/protractor/built/cli.js
     Application parameters: protractor.conf.js --suite firsttests

     The only difference for another run/debug configuration would be change the Name and —suite name
     Eg
     Name: Protractor header-search
     Application parameters: protractor.conf.js --suite headersearch

3) Now these can be launched from Run/Debug
