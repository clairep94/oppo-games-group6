const parseJwt = (token) => {
    try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };
    



const getSessionUserID = (token) => {
   
    const decodedToken = parseJwt(token);    
    const userID = decodedToken ? decodedToken.user_id : null;
   
    return userID;

}


export default getSessionUserID;