<template>
  <div id="userPage">
    <template v-if="user">
      <van-space style="margin-left: 20px">
        <van-image
            round
            width="80"
            height="80"
            :src="user?.avatarUrl"
            @click="toUserUpdatePage"

        />
        <van-cell :title="user.username" is-link to="/user/update" style="width: 260px" :center="true">
          <template #label>
            <van-text-ellipsis :content="user.profile || '点此编辑个性签名'" @click="toEditProfile"/>
          </template>
        </van-cell>
      </van-space>
      <van-cell center style="margin-top: 15px">
        <template #title>
          <span style="margin-left: 20px">我的标签</span>
        </template>
        <template #value>
          <van-tag v-for="tag in user.tags" plain type="danger" style="margin-right: 8px;margin-top: 8px">
            {{ tag }}
          </van-tag>
        </template>
      </van-cell>
      <van-grid :border="false" style="padding: 10px">
        <van-grid-item text="创建的队伍" to="/user/team/create">
          <template #icon>
            <van-icon class-prefix="my-icon" name="wochuangjiande" size="23" style="margin-bottom: 8px;color: #0048ff"/>
          </template>
        </van-grid-item>
        <van-grid-item text="加入的队伍" to="/user/team/join">
          <template #icon>
            <van-icon class-prefix="my-icon" name="jiarubanji" size="23" style="margin-bottom: 8px;color: #11d35d"/>
          </template>
        </van-grid-item>
        <van-grid-item text="我的博文" to="/user/blog">
          <template #icon>
            <van-icon class-prefix="my-icon" name="wofadetiezi" size="23" style="margin-bottom: 8px;color: #10d1d9"/>
          </template>
        </van-grid-item>
        <van-grid-item text="好友列表" to="/my/friends">
          <template #icon>
            <van-icon name="contact" size="23" style="margin-bottom: 8px;color: #0a0dd2"/>
          </template>
        </van-grid-item>
        <van-grid-item text="用户签到" @click="userSign(user.id)">
          <template #icon>
            <van-icon name="bulb-o" size="23" style="margin-bottom: 8px;color: #0a0dd2"/>
          </template>
        </van-grid-item>
        <van-grid-item text="历史签到" @click="toUserSignPage">
          <template #icon>
            <van-icon name="records" size="23" style="margin-bottom: 8px;color: #0c9dea"/>
          </template>
        </van-grid-item>
        <van-grid-item text="联系作者" @click="customerService">
          <template #icon>
            <van-icon class-prefix="my-icon" name="fankui" size="23" style="margin-bottom: 8px;color: #0a0dd2"/>
          </template>
        </van-grid-item>
      </van-grid>
      <van-cell title="我的信息" style="padding: 20px" is-link to="/user/update" :center="true">
        <template #icon>
          <van-icon name="setting-o" size="20" style="margin-right: 5px" color="#1989fa"/>
        </template>
      </van-cell>
      <div style="margin: 16px;">
        <van-button style="background-color:#f3f0f0 ;margin-left: 60px;margin-top: 10px;width: 220px; font-size: 16px"
                    round
                    type="default" native-type="submit"
                    @click="logout">
          退 出
        </van-button>
      </div>
      <van-dialog v-model:show="showCustomerService" title="请加客服微信">
        <van-image
            :src=authorWxImage
        />
      </van-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/my-axios.js";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user.ts";
import authorWxImage from "../assets/defalutTeamImg.jpg"

let router = useRouter();
const user = ref()
const showCustomerService = ref(false)
onMounted(async () => {
  let currentUser = await getCurrentUser();
  if (currentUser) {
    user.value = currentUser
    if (currentUser.tags) {
      currentUser.tags = JSON.parse(currentUser.tags)
    }
  } else {
    showFailToast("未登录")
    await router.replace("/user/login")
  }
})
const toEdit = (editKey: string, editName: string, editValue: string) => {
  router.push({
    path: 'user/edit',
    query: {
      editKey,
      editName,
      editValue
    }
  })
}
const logout = async () => {
  let res = await myAxios.post("/user/logout");
  if (res?.data.code === 0) {
    showSuccessToast("退出成功")
    await router.replace("/")
  } else {
    showFailToast("内部错误," + res?.data.message)
  }
}

const userSign = async (userId: any) => {
  let userSign = await myAxios.post("/user/sign/" + userId);
  if (userSign.data.code === 0) {
    showSuccessToast("签到成功!")
  } else {
    showFailToast("签到失败," + userSign.data.description)
  }
}
const toEditProfile = () => {
  router.push({
    path: "/user/edit",
    query: {
      editKey: "profile",
      editName: "个性签名",
      editValue: user.value.profile
    }
  })
}


const customerService = () => {
  showCustomerService.value = true
}
const toUserUpdatePage = () => {
  router.push("/user/update")
}

const toUserSignPage = () => {
  router.push("/user/sign")
}
</script>

<style scoped>
#userPage {
  margin-top: -20px;
}

:deep(.van-grid-item__text) {
  font-size: 12px;
}

</style>
