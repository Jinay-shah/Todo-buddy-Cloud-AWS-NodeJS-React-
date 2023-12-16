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

// Updated Lambda function for deleting a task
exports.handler = async (event) => {
  try {
    
    // Check if required fields are provided
    const taskId = event.queryStringParameters.id;
    if (!taskId) {
      return createResponse(400, { message: 'Please provide a task ID!' });
    }

    // Fetch the task to be deleted
    const existingTask = await getTaskById(taskId);

    // Verify that the task exists
    if (!existingTask) {
      return createResponse(404, { message: 'Task not found!' });
    }

    // Delete the task
    await deleteTask(taskId);

    return createResponse(200, { message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    return createResponse(400, { message: 'Invalid JSON or an error occurred' });
  }
};

// Function to fetch a task by its unique ID
async function getTaskById(taskId) {
  const params = {
    TableName: taskTableName,
    Key: {
      taskId: taskId,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error;
  }
}

// Function to delete a task by its unique ID
async function deleteTask(taskId) {
  const params = {
    TableName: taskTableName,
    Key: {
      taskId: taskId,
    },
  };

  try {
    await dynamoDB.delete(params).promise();
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}
