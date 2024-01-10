const APIProfilePicture = (id) => {
    // Placeholder profile picture corresponding to userID from the picsum API.
    return(
        <img src={`https://picsum.photos/seed/${id}/300`} alt="Profile" className='profilepic'/>
    )
}

export default APIProfilePicture;