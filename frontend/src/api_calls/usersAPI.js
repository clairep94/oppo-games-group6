const SignUpEndpoint = '/signup'; // API endpoint for signup route
const API_Endpoint = '/users'; //API endpoint for authenticated routes


const signUp = async (signUpPayload) => {
    // This call returns the response and response code, not the JSON
    try {
        const response = await fetch(`${SignUpEndpoint}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signUpPayload)
        });
        return response;
        // const newUserData = await response.json();
        // return newUserData;
    } catch (error) {
        console.error("UsersAPI.signUp:", error);
        throw error;
    }
}

const findUser = async (token, userID) => {
    try {
        const response = await fetch(`/users/${userID}`, {
            headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        const userData = await response.json();
        return userData;
        
    } catch (error) {
        console.error("UsersAPI.findUser:", error);
        throw error;
    }
}


const allUsers = async (token) => {
    console.log("running AllUsersMethod")
    try {
        const response = await fetch(`/users`, {
            headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        const usersData = await response.json();
        console.log(usersData)
        return usersData;
    } catch (error) {
        console.error("UsersAPI.allUsers:", error);
        throw error;
    }
}


export { signUp, findUser, allUsers, };