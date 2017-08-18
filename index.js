var AWS = require('aws-sdk');
var ses = new AWS.SES({apiVersion: '2017-08-17'});

var successMsg = 'Thank you for contacting us! Your message has been sent.';
var charset = 'UTF-8';
var numberOfSubjectWords = 8;

var validateEmail = function (email) {
    if (!validateFormValue(email, true, 255)) return false;
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) return false;
    return true;
}

var validateFormValue = function (value, required, maxLength) {
    required = typeof required !== 'undefined' ? required : true;
    maxLength = typeof maxLength !== 'undefined' ? maxLength : 255;
    if (required && !value) return false;
    if (value.length > maxLength) return false;
    return true;
}

exports.handler = function (data, context) {
    var email = data.email;
    var name = data.name;
    var phone = data.phone;
    var message = data.message;
    var toAddress = data.toAddress;
    var source = data.source;

    if (!validateEmail(email)) {
        context.fail('Email is invalid.');
        return;
    }

    if (!validateFormValue(name, true, 100)) {
        context.fail('Name is invalid.');
        return;
    }

    if (!validateFormValue(phone, true, 20)) {
        context.fail('Phone is invalid.');
        return;
    }

    if (!validateFormValue(message, true, 1024)) {
        context.fail('Message is invalid.');
        return;
    }

    var replyTo = data.name + " <" + email + ">";
    var emailData = [];
    emailData.push("Name: " + data.name);
    emailData.push("Phone: " + data.phone);
    emailData.push("Message: " + data.message);

    // subject will be the first numberOfSubjectWords words from the message
    var subject = message.replace(/\s+/g, ' ').split(' ').slice(0, numberOfSubjectWords).join(' ');

    ses.sendEmail({
        Destination: {ToAddresses: [toAddress]},
        Message: {
            Body: {Text: {Data: emailData.join("\r\n"), Charset: charset}},
            Subject: {Data: subject, Charset: charset}
        },
        Source: source,
        ReplyToAddresses: [replyTo]
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            context.fail(err);
            return;
        }

        console.log(data);
        context.succeed({'successMsg': successMsg});
    });
};
