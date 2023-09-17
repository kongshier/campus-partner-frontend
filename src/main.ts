import {createApp} from 'vue'

import App from './App.vue'
import {Button, ConfigProvider, Icon, NavBar} from 'vant';
import 'vant/lib/index.css';
import * as VueRouter from 'vue-router'
import routes from "./config/routes.ts";
import "./global.css"
import BasicLayout from "./layouts/BasicLayout.vue";
import BlogEditPage from "./pages/BlogEditPage.vue";
import "../public/icon/iconfont.css"
import BlogPage from "./pages/BlogPage.vue";
import ForgetPasswordPage from "./pages/ForgetPasswordPage.vue";
import AfterSignUp from "./pages/AfterSignUp.vue";
import ChatPage from "./pages/ChatPage.vue";
import UpdatePasswordPage from "./pages/UpdatePasswordPage.vue";
import {Dialog} from 'vant';

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})
const app = createApp(App);
app.component("default-layout", BasicLayout)
app.component("blog-edit-layout", BlogEditPage)
app.component('blog-layout', BlogPage)
app.component("forget-layout", ForgetPasswordPage)
app.component("after-layout", AfterSignUp)
app.component("chat-layout", ChatPage)
app.component("password-layout", UpdatePasswordPage)
app.use(Button);
app.use(NavBar);
app.use(Icon);
app.use(router)
app.use(ConfigProvider);
app.use(Dialog)
app.mount('#app')
