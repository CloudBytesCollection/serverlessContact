# Serverless Contact

### Description
Serverless Contact is an AWS Lambda function that utilizes AWS SES to send emails from a registered web page by a potential client to the site owner.

### Usage
In order to use the serverless contact form, the user must have all mail records with aws assigned in SES and the email address verified. After that, simply modify the contactForm.js with the user's individual email address in the '_toAddress' and '_source' variables at the top of the file.
