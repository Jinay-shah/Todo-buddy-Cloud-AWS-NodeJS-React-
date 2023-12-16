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

// Lambda function for getting a task by title
exports.handler = async (event) => {
  try {
    // Parse the JSON from the event body
    const userId = event.queryStringParameters.userId;
    const title = event.queryStringParameters.title;

    // Check if required fields are provided
    if (!userId || !title) {
      return createResponse(400, { message: 'Please provide user ID and task title!' });
    }

    // Fetch the task by title
    const task = await getTasksByTitle(userId, title);

    // Check if the task was found
    if (!task) {
      return createResponse(404, { message: 'Task not found!' });
    }

    return createResponse(200, { message: 'Task retrieved successfully', task });
  } catch (error) {
    console.error(error);
    return createResponse(400, { message: 'Invalid JSON or an error occurred' });
  }
};

async function getTasksByTitle(userId, titleSubstring) {
  const params = {
    TableName: taskTableName,
  };

  try {
    const result = await dynamoDB.scan(params).promise();

    if (result.Items.length > 0) {
      // Filter and sort tasks by title
      const matchingTasks = result.Items.filter(task => task.userId === userId && task.title.includes(titleSubstring));
      matchingTasks.sort((a, b) => {
        if (a.taskId !== b.taskId) {
          return a.taskId.localeCompare(b.taskId);
        } else if (a.title !== b.title) {
          return a.title.localeCompare(b.title);
        } else if (a.description !== b.description) {
          return a.description.localeCompare(b.description);
        } else if (a.dueDate !== b.dueDate) {
          return a.dueDate.localeCompare(b.dueDate);
        } else {
          return a.status.localeCompare(b.status);
        }
      });

      // Remove userId from the output
      const formattedTasks = matchingTasks.map(({ taskId, title, description, dueDate, status }) => ({
        taskId,
        title,
        description,
        dueDate,
        status,
      }));

      return formattedTasks;
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error getting tasks by title:', error);
    throw error;
  }
}
