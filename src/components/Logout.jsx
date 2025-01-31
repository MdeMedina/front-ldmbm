import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Logout () {
    const navigate = useNavigate()
    useEffect(() => {
        localStorage.removeItem('role')
        localStorage.removeItem('name')
        localStorage.removeItem('key')
        localStorage.removeItem('email')
        localStorage.removeItem("cVend")   
        localStorage.removeItem("cantidadM")
        localStorage.removeItem("messageID")
        localStorage.setItem("nav", false)  
        localStorage.setItem("visto", true);        

        navigate('/login')
    

    })
}