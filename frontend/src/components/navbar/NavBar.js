import { FaGamepad } from "react-icons/fa6";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

import { CgGames } from "react-icons/cg";



const NavBar = (props) => {

    const navigate = props.navigate
    const token = props.token
    const setToken = props.setToken
    const sessionUserID = props.sessionUserID
    const sessionUser = props.sessionUser
    const setSessionUser = props.setSessionUser


    const navIcons = {

    }


    // ============= LOGOUT ======================== //
    const logout = () => {
        window.localStorage.removeItem("token")
        navigate('/login')
    }

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[32rem] w-[7.5rem] ml-4 backdrop-blur-md bg-purple-100/20
        shadow-xl shadow-[#444a6b] rounded-[2.5rem] border-[2.5px] border-white/10 place-self-center
        " >

            <div className="w-[6rem] h-[25rem] flex flex-col items-center justify-between">


                <div className="w-[5rem] h-[5rem] hover:bg-white/30 bg-white/20 rounded-xl items-center justify-center flex hover:cursor-pointer">
                    <a href='/lobby' className="text-[2rem] text-[#e5dbea]">
                        <FaGamepad />
                    </a>
                </div>
        
                <div className="w-[5rem] h-[5rem] hover:bg-white/30  rounded-xl items-center justify-center flex hover:cursor-pointer">
                    <a href={`/users/${sessionUserID}`} className="text-[2rem] text-[#1f1d22]/70 hover:text-[#1f1d22]/80">
                        <FaUserCircle /> 
                    </a>
                </div>

                <div className="w-[5rem] h-[5rem] hover:bg-white/30  rounded-xl items-center justify-center flex hover:cursor-pointer">
                    <p className="text-[2.4rem]  text-[#1f1d22]/70 hover:text-[#1f1d22]/80">
                        <FaUserFriends />
                    </p>                    
                </div>

                <button onClick={logout} className="text-[2.5rem] text-[#1f1d22]/70 hover:text-[#1f1d22]/80 w-[5rem] h-[5rem] hover:bg-white/30  rounded-xl items-center justify-center flex hover:cursor-pointer">
                    <IoLogOut />
                </button>                
            </div>


        </div>
    );

}


export default NavBar;