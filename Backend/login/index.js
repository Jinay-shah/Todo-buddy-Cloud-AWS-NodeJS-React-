const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

// Define the name of the DynamoDB table
const userDataTable = 'userData';

// Create an instance of DynamoDB's DocumentClient
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Lambda function for user login
exports.handler = async (event) => {
    const userLoginData = JSON.parse(event.body);
    const username = userLoginData.username;
    const password = userLoginData.password;

    if (!username || !password) {
        return createResponse(401, {
            message: 'Username and password are required'
        });
    }

    try {
        const dynamoMember = await getUser(username);

        if (!dynamoMember || !dynamoMember.username) {
            return createResponse(403, {
                message: 'Username does not exist'
            });
        }

        if (!bcrypt.compareSync(password, dynamoMember.password)) {
            return createResponse(403, {
                message: 'Password is incorrect'
            });
        }

        const userCred = {
            username: dynamoMember.username,
            name: dynamoMember.name,
            userId: dynamoMember.userId
        };

        const jwtToken = createToken(userCred);
        const response = {
            user: userCred,
            token: jwtToken
        };

        return createResponse(200, response);
    } catch (error) {
        console.error("Error:", error);
        return createResponse(500, {
            message: 'Internal server error'
        });
    }
};

// Utility function to create an HTTP response object
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

// Function to create a JWT token
function createToken(userInfo) {
    if (!userInfo) {
        return null;
    }

    return jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '2h'
    });
}

// Function to get user data from DynamoDB
async function getUser(username) {
    const params = {
        TableName: userDataTable,
        Key: {
            username: username
        }
    };

    try {
        const response = await dynamodb.get(params).promise();
        return response.Item;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
