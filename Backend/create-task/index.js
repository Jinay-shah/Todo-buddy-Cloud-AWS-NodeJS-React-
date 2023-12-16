const AWS = require('aws-sdk');
// For generating unique task IDs
const uuid = require('uuid'); 
// Create a DynamoDB instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name for tasks
const taskTableName = 'taskData';

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

// Lambda function for creating a task
exports.handler = async (event) => {
  try {
    const requestData = JSON.parse(event.body);

    // Check if required fields are provided
    const userId = requestData.userId;
    const title = requestData.title;
    const description = requestData.description;
    const dueDate = requestData.dueDate;
    const status = requestData.status;

    if (!userId || !title || !dueDate || !status) {
      return createResponse(400, { message: 'Please provide all required fields!' });
    }

    // Check if a task with the same title already exists for the user
    const existingTask = await getTaskByTitle(userId, title);

    if (existingTask) {
      return createResponse(400, { message: 'A task with the same title already exists!' });
    }

    // Generate a unique task ID
    const taskId = uuid.v4();

    // Store task data in DynamoDB
    const task = {
      taskId,
      userId,
      title,
      description,
      dueDate,
      status
    };

    const params = {
      TableName: taskTableName,
      Item: task,
    };

    await dynamoDB.put(params).promise();

    return createResponse(201, { message: 'Task created successfully', taskId });
  } catch (error) {
    console.error(error);
    return createResponse(400, { message: 'Invalid JSON ' });
  }
};

// Function to get a task by title and user ID
async function getTaskByTitle(userId, title) {
  const params = {
    TableName: taskTableName,
    FilterExpression: 'userId = :userId AND title = :title',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':title': title,
    },
  };

  try {
    const result = await dynamoDB.scan(params).promise();

    if (result.Items.length > 0) {
      return result.Items[0]; 
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error getting task by title:', error);
    throw error;
  }
}
