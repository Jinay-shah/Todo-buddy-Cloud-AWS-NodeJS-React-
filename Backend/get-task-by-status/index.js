const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const taskTableName = 'taskData';

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

// Lambda function for getting tasks by status
exports.handler = async (event) => {
  try {
    const userId = event.queryStringParameters.userId;
    const status = event.queryStringParameters.taskstatus;
    // Check if required fields are provided
    if (!status || !userId) {
      return createResponse(400, { message: 'Please provide both a task status and user ID!' });
    }

    // Fetch tasks by status and userId
    const tasks = await getTasksByStatusAndUserId(status, userId);

    return createResponse(200, { message: 'Tasks retrieved successfully', tasks });
  } catch (error) {
    console.error(error);
    return createResponse(400, { message: 'Invalid JSON or an error occurred' });
  }
};

// Function to get tasks by status and userId
async function getTasksByStatusAndUserId(status, userId) {
  const params = {
    TableName: taskTableName,
    FilterExpression: '#s = :status AND userId = :userId', 
    ExpressionAttributeNames: {
      '#s': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':userId': userId,
    },
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Items; 
  } catch (error) {
    console.error('Error getting tasks by status and userId:', error);
    throw error;
  }
}
