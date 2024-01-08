import { FaGamepad } from "react-icons/fa6";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";


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

    return (
        <div className="flex flex-col  items-center justify-center h-screen w-[8rem] bg-[#22233a] text-[#b4bceb]
        shadow-xl shadow-[#4d547d]
        " >

            <div className="w-[6rem] h-[28rem] flex flex-col items-center space-y-3">
                <div className="w-[6rem] h-[6rem] hover:bg-gray-600/30 bg-black/30 rounded-xl items-center justify-center flex hover:cursor-pointer">
                    <a href='/lobby' className="text-[3rem]">
                        <FaGamepad />
                    </a>
                </div>

                <div className="w-[6rem] h-[6rem] hover:bg-gray-600/30 bg-black/30 rounded-xl items-center justify-center flex hover:cursor-pointer">
                    <a href={`/users/${sessionUserID}`} className="text-[2.6rem]">
                        <FaUserCircle /> 
                    </a>
                </div>

                <div className="w-[6rem] h-[6rem] hover:bg-gray-600/30 bg-black/30 rounded-xl items-center justify-center flex hover:cursor-pointer">
                    <p className="text-[2.6rem]">
                        <FaUserFriends />
                    </p>                    
                </div>

                <button onClick={logout} className=" text-[3rem] w-[6rem] h-[6rem] hover:bg-gray-600/30 bg-black/30 rounded-xl items-center justify-center flex hover:cursor-pointer">
                    <IoLogOut />
                </button>                
            </div>


        </div>
    );

}


export default NavBar;