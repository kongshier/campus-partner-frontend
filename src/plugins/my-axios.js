import axios from "axios";
import {showFailToast} from "vant";

export const URL = process.env.NODE_ENV === "development"
    ? "http://localhost:8105/api"
    : "http://47.121.118.209:8105/api";

let myAxios = axios.create({
    baseURL: URL
});

// export const URL = 'localhost:8105/api';
//
// let myAxios = axios.create({
//     baseURL: 'http://' + URL
// });
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
    if (response?.data?.code === 40100) {
        showFailToast("请先登录！")
        const redirectUrl = window.location.href
        window.location.href = `/user/login?redirect=${redirectUrl}`
    }
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default myAxios
