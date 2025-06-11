import axios from 'axios'

let request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000
})

//@ts-ignore
request.interceptors.request.use((config) => {
    return config
})

//@ts-ignore
request.interceptors.response.use((response) => {
    // blob数据
    if (response.data instanceof Blob) {
        return Promise.resolve(response)
    }
    // 一般情况
    return Promise.resolve(response.data)
})


export default request