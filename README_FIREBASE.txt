###
# Firebase Hosting (aka Google Hosting) Update Live Website
# 
  Upload website files to firebase hosting with CLI command:

  $ firebase deploy --only hosting

  If you run the deploy command without '--only hosting' firebase will update 
  all services related files for: Database, Cloud Functions, and Hosting.  This
  takes up to a couple minutes and should not be done unless you know what you 
  are doing. 

#
#
################################################################################

###
# Google reCaptcha
#
  Create New reCaptcha for use on website
     https://www.google.com/recaptcha/admin#site/343992646?setup

  Setup Instructions
    https://developers.google.com/recaptcha/docs/invisible#auto_render

#
#
################################################################################

###
# IMPORTANT: Missing Firebase File
#
There is 1 Firebase file that is not tracked by git; the 'Service Account' file. 
Be sure to ask for a copy of that file and paste it into the directory: /functions

#
#
################################################################################

###
# Firebase Setup for local development:
#

1) Install Firebase NPM dependencies from the directory /functions by entering
the following command:
$ npm install

2) This step should not be needed if the services have already been added to 
the firebase project, but if for some reason they need to be added again, doing
so it not a problem EXCEPT when prompted with question about if a/any file should
be OVERWRITTEN you must indicate NO; otherwise it will overwrite your previous work.

Initialize Firebase from Home Directory Using Command Line

$ firebase init
...Select these three services by using up/down arrow key and use space bar to select
A) Firestore
B) Functions
C) Hosting

#
#
################################################################################

###
# Firebase Cloud Function Environment Variables 
# 
  Usage of cloud function environment variables is documented in /functions/index.js

  Local Development Environment: 
    How do you setup local environment variables for Cloud Functions for Firebase?
    See answer at: https://stackoverflow.com/questions/44766536/how-do-you-setup-local-environment-variables-for-cloud-functions-for-firebase

    1) create environment variables with the command as instructed in /functions/index.js

    2) save envioronment variables to a local file with one of two commands:

      $ firebase functions:config:get > .runtimeconfig.json

      If you are using Windows Powershell, replace the above command with:

      $ firebase functions:config:get | ac .runtimeconfig.json 

#
#
################################################################################
