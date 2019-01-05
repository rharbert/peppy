
###
# Google reCaptcha
#
  Create New reCaptcha for use on website
     https://www.google.com/recaptcha/admin#site/343992646?setup

  Setup Instructions
    https://developers.google.com/recaptcha/docs/invisible#auto_render

    1. Add to head: script to include:
        a. google recaptcha api file
        b. <script> with function call for <form> submit

    2. Verify <form> id matches id used in 1. b above
    
    3. <button> Add class, data-sitekey, and data-callback as instructed in above
       google doc webpage

