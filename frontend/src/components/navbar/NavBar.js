const NavBar = (props) => {
    const navigate = props.navigate
    const sessionUserID = props.sessionUserID
    const sessionUserData = props.sessionUserData


    // TODO: Add live search, sessionUser profile link, etc.

      // ============= LOGOUT ======================== //
        const logout = () => {
            window.localStorage.removeItem("token")
            navigate('/login')
        }

    return(
        <>
        THIS IS MY PLACEHOLDER NAVBAR: {sessionUserID}
        <a href='/lobby'>LOBBY</a>
        <button onClick={logout}>
            Logout
        </button>
        </>

    )

}


export default NavBar;