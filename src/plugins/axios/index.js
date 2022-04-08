import axios from "axios";
import router from "@/router/index.js"

const axiosInstance = axios.create({
    baseURL : "http://dev1.itpw.ru:8005/",
    // baseURL : "http://127.0.0.1:8000/",
    headers : {
        'Authorization': localStorage.getItem('token') ? "Bearer " + localStorage.getItem('token') : null,
    }
})


axiosInstance.interceptors.response.use(
    response => {
        return response
    },
    error => {

        if(error.response.status === 401){
            console.log("Error iterseptor. Code 401");
            router.push("/login")
        }
        else{
            return error
        }
    }
)

export default axiosInstance
