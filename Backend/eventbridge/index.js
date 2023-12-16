const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    // Determine the SNS topic ARN to send the message
    const snsTopicArn = 'arn:aws:sns:us-east-1:966503693276:confirm-user-registration'; 

    // Define the email message parameters
    const snsParams = {
      Message: 'Hello Users! Hoping you are doing good today.\nCreate your customise todo list and make your work organized.',
      Subject: 'Reminder!',
    };

    // Publish the email message to the SNS topic
    snsParams.TopicArn = snsTopicArn; 

    await sns.publish(snsParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent to all subscribers' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }
};
