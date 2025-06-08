import axios from "axios";

let request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000
});

//@ts-ignore
request.interceptors.request.use((config) => {
    return config;
});

//@ts-ignore
request.interceptors.response.use((response) => {

});


export default request