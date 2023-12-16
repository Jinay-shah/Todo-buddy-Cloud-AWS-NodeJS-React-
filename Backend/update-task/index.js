const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const taskTableName = 'taskData';

// Lambda function for updating a task
exports.handler = async (event) => {
  try {
    const requestData = JSON.parse(event.body);
    const userId = event.queryStringParameters.userId;
    const taskId = event.queryStringParameters.taskId;
    const title = requestData.title;
    const description = requestData.description;
    const dueDate = requestData.dueDate;
    const status = requestData.status;

    // Check if required fields are provided
    if (!taskId || !userId) {
      return createResponse(400, { message: 'Please provide task ID and user ID!' });
    }

    // Fetch the task to be updated
    const existingTask = await getTaskById(taskId);

    // Verify that the task exists and belongs to the user
    if (!existingTask || existingTask.userId !== userId) {
      return createResponse(404, { message: 'Task not found or unauthorized access!' });
    }

    // Update the task's fields if new values are provided
    if (title) existingTask.title = title;
    if (description) existingTask.description = description;
    if (dueDate) existingTask.dueDate = dueDate;
    if (status) existingTask.status = status;

    // Save the updated task
    await saveTask(existingTask);

    return createResponse(200, { message: 'Task updated successfully', updatedTask: existingTask });
  } catch (error) {
    console.error(error);
    return createResponse(400, { message: 'Invalid JSON or an error occurred' });
  }
};
// Function to fetch a task by its unique ID
async function getTaskById(taskId) {
  console.log(taskId);
  const params = {
    TableName: taskTableName,
     Key: {
      taskId: taskId,
    },
  };

  const result = await dynamoDB.get(params).promise();

  return result.Item;
}

// Function to save an updated task
async function saveTask(task) {
  const params = {
    TableName: taskTableName,
    Item: task,
  };

  await dynamoDB.put(params).promise();
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
