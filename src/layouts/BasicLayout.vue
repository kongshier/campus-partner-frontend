<template>
  <van-sticky>
    <van-nav-bar
        :title="title"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        style="margin: 5px"
    >
      <template #right>
        <van-icon name="search" size="18"/>
      </template>
    </van-nav-bar>
  </van-sticky>
  <div class="content">
    <router-view/>
  </div>
  <van-tabbar route v-model="active">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="flag-o" name="team">队伍</van-tabbar-item>
    <van-tabbar-item replace class="van-tabbar-addBlog" @click="checkLogin('/blog/edit',2)">
      <van-icon name="add-o" size="40" class="add-blog-btn"/>
    </van-tabbar-item>
    <van-tabbar-item v-if="hasMessage" icon="chat-o" name="chat" class="message"
                     @click="checkLogin('/message',3)" dot>
    </van-tabbar-item>
    <van-tabbar-item v-else icon="chat-o" name="message" class="message" @click="checkLogin('/message',3)">
      消息
    </van-tabbar-item>
    <van-tabbar-item to="/user" icon="contact" name="user">我的</van-tabbar-item>
  </van-tabbar>
</template>
<script setup>
import {showConfirmDialog, showFailToast, showToast} from "vant";
import {useRouter} from "vue-router";
import routes from "../config/routes.ts";
import {ref} from "vue";
import {getCurrentUser} from "../services/user.ts";
import myAxios from "../plugins/my-axios.js";

const hasMessage = ref(false)
let router = useRouter();
const DEFAULT_TITLE = "CAMPUS 校园伙伴"
const title = ref(DEFAULT_TITLE)
const active = ref(0)
router.beforeEach(async (to) => {
  const toPath = to.path
  const route = routes.find((routes) => {
    return routes.path === toPath
  })
  document.title = " CAMPUS 校园伙伴"
  title.value = route?.title ?? DEFAULT_TITLE
  if (to.path !== '/user/login') {
    let res = await myAxios.get("/message");
    if (res?.data.code === 0) {
      if (res.data.data) {
        hasMessage.value = true
      } else {
        hasMessage.value = false
      }
    }
  }
})
const onClickLeft = () => {
  router.back()
};
const onClickRight = () => {
  router.push("/search")
};

const checkLogin = async (to, index) => {
  let user = await getCurrentUser();
  if (!user) {
    showConfirmDialog({
      message:
          "该功能需要登陆后使用,是否登录",
      confirmButtonText: "去登录"
    })
        .then(() => {
          showFailToast("未登录")
          router.replace("/user/login")
        })
        .catch(() => {
        });
  } else {
    await router.push(to)
    if (active.value === 'message') {
      let message = document.getElementsByClassName("message")
      message.item(0).style.color = '#007eff'
    }
  }
}
</script>

<style scoped>
.content {
  padding-bottom: 70px;
}
.add-blog-btn {
  border-radius: 50%;
  color: white;
  background: linear-gradient(to right, #548be3, #0059ff, #438aa9);
}

</style>
