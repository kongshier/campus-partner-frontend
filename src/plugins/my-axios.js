import axios from "axios";

const url = process.env.NODE_ENV === "development"
    ? "http://localhost:8105/api"
    : "http://pt.kongshier.top/api";

let myAxios = axios.create({
    baseURL: url
});
myAxios.defaults.withCredentials = true

let token = sessionStorage.getItem("token");
// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    if (token) {
        config.headers['authorization'] = token
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default myAxios
