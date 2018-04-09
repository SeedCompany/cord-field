##Webstorm setup for  e2e Tests:


1.  run `yarn start`  to start the application locally so that the tests can be run against it.

1.  tests can be put into suites so that they can be run as groups. Suites are defined in `protractor.conf.js`

2. In Webstorm create 'Run/Debug' configurations for each `suite`.

  Example for adding a configuration:
  
   *  Menu--> Run : Edit Configuarations : + :
   *  Node.js

  Example fields values for Run/Debug
   *  **Name:** Protractor fist tests suite
   *  **Node Parameters:**  leave this blank
   *  **Working directory:** ~/Documents/develop/cord2/cord-field
   *  **Javascript file:** node_modules/protractor/built/cli.js
   *  **Application parameters:** protractor.conf.js --suite firsttests

     The only difference for another run/debug configuration would be change the Name and —suite name
     Eg
     * **Name:** Protractor header-search
     * **Application parameters:** protractor.conf.js --suite headersearch

3. Now these can be launched from Run/Debug
