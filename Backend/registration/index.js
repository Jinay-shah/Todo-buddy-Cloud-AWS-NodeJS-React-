const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Create a DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

// DynamoDB table name
const tableName = 'userData';
const snsTopicArn = 'arn:aws:sns:us-east-1:966503693276:confirm-user-registration'; 

// Function to create an HTTP response object
function createResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

// Registration endpoint
exports.handler = async (event) => {
  try {
    const userData = JSON.parse(event.body);
    console.log("userData:",userData);
    const name = userData.name;
    const email = userData.email;
    const username = userData.username;
    const password = userData.password;

    // Check if required fields are provided
    if (!name || !email || !username || !password) {
      return createResponse(400, { message: 'Please provide all required fields!' });
    }

    // Generate a unique user ID
    const userId = uuidv4();

    // Trim and convert the username to lowercase
    const trimmedUsername = username.trim().toLowerCase();

    // Check if the username is already taken
    const existingUser = await getUserByUsername(username);
    if (existingUser && existingUser.username) {
      return createResponse(400, { message: 'Username already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password.trim(), saltRounds);

    // Store user data in DynamoDB
    const user = {
      userId, // Include the generated user ID
      name,
      email,
      username: trimmedUsername,
      password: hashedPassword
    };

    const params = {
      TableName: tableName,
      Item: user,
    };

    await dynamoDB.put(params).promise();

    // Subscribe user's email to SNS topic
    await subscribeUserEmail(email, snsTopicArn);
    console.log("hii");
    
    return createResponse(201, { message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    return createResponse(400, { message: 'Invalid JSON ' });
  }
};

// Function to subscribe a user's email to SNS topic
async function subscribeUserEmail(email, snsTopicArn) {
  const params = {
    Protocol: 'email',
    TopicArn: snsTopicArn,
    Endpoint: email,
  };

  try {
    await sns.subscribe(params).promise();
  } catch (error) {
    console.error('Error subscribing email:', error);
    
  }
}

// Function to get a user by username
async function getUserByUsername(username) {
  const params = {
    TableName: tableName,
    Key: {
      username,
    },
  };

  const result = await dynamoDB.get(params).promise();

  return result.Item;
}
