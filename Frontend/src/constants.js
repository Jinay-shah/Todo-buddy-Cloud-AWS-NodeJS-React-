const GATEWAY_URL = process.env.REACT_APP_API_ENDPOINT;

const APIs = {
    REGISTER: `${GATEWAY_URL}/user-registration`,
    LOGIN: `${GATEWAY_URL}/user-login`,
    CREATETASK:`${GATEWAY_URL}/create-task`,
    USERTASK: `${GATEWAY_URL}/get-user-tasks`,
    TASKBYSTATUS: `${GATEWAY_URL}/getTaskByStatus`,
    TASKBYTITLE: `${GATEWAY_URL}/getTaskByTitle`,
    UPDATETASK: `${GATEWAY_URL}/update-task`,
    DELETETASK: `${GATEWAY_URL}/delete-task`
}

export default APIs;
export {GATEWAY_URL};