const parseJwt = (token) => {
    try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };
    


const getSessionUserID = (token) => {
// This function returns the sessionUserID from the token
    const decodedToken = parseJwt(token);    
    const userID = decodedToken ? decodedToken.user_id : null;
   
    return userID;

}

// const getUserData = (id, token) => {
// // This function returns the user data from the DB given the user._id
//     fetch(`/users/${id}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//     .then((res) => res.json())
//     .then((data) => {
//         return data.user;
//     })
// }



// export { getSessionUserID, getUserData };
export default getSessionUserID



// Example usage of getUserData
// const userID = comment.user_id;
// const token = //... get the token from somewhere;
// const FoundUser = getSessionUserData(userID, token);
// const userEmail = FoundUser && FoundUser.email ? FoundUser.email : '';
