const NavBar = (props) => {

    //TODO change to use-context
    const navigate = props.navigate
    const token = props.token
    const setToken = props.setToken
    const sessionUserID = props.sessionUserID
    const sessionUser = props.sessionUser
    const setSessionUser = props.setSessionUser



    // ============= LOGOUT ======================== //
    const logout = () => {
        window.localStorage.removeItem("token")
        navigate('/login')
    }

    return(
        <div className="w-full h-[4rem] bg-slate-400">
        THIS IS MY PLACEHOLDER NAVBAR: {sessionUserID}
        <a href='/lobby'> LOBBY </a>
        <a href={`/users/${sessionUserID}`}>PROFILE </a>

        <button onClick={logout}>
            Logout
        </button>
        </div>

    )

}


export default NavBar;