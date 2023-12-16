const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const taskTableName = 'taskData';

// Lambda function for getting all tasks for a user
exports.handler = async (event) => {
  try {
    //const requestData = JSON.parse(event.body);
    const userId = event.queryStringParameters.userId;

    // Check if the userId is provided in the query parameters
    if (!userId) {
      return createResponse(400, { message: 'Please provide a userId in the query parameters' });
    }

    // Query the DynamoDB table to retrieve tasks for the specified user
    const tasks = await getTasksByUserId(userId);

    // Return the list of tasks as a JSON array
    return createResponse(200, { tasks });
  } catch (error) {
    console.error(error);
    return createResponse(400, { message: 'An error occurred while fetching tasks' });
  }
};

// Function to retrieve tasks for a user based on userId
async function getTasksByUserId(userId) {
  const params = {
    TableName: taskTableName,
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  } catch (error) {
    console.error('Error fetching tasks by userId:', error);
    throw error;
  }
}

// Function to create an HTTP response object
function createResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}
