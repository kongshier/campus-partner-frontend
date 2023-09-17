<template>
  <van-card v-for="user in userList"
            :title="user.username"
            :desc="user.profile"
            style="border-radius: 15px;background-color: #e8e8e8"
  >
    <template #thumb>
      <van-image :src="user?.avatarUrl" round width="88" height="88" @click="showUserDetail(user?.id)"/>
    </template>
    <template #tags>
      <van-tag v-for="tag in user?.tags" plain type="danger" style="margin-right: 8px;margin-top: 8px"
               @click="showUserDetail(user?.id)">
        {{ tag }}
      </van-tag>
    </template>
    <template #price>
      <van-icon name="phone-o" style="">{{ ':' + user.phone }}</van-icon>
    </template>
    <template #num>
      <!--      <van-button v-if="user.isFollow" size="mini" plain type="danger"-->
      <!--                  style="width: 60px;height: 28px;margin-top: 10px"-->
      <!--                  @click="followUser(user)"-->
      <!--      >-->
      <!--        取消关注-->
      <!--      </van-button>-->
      <!--      <van-button v-else size="mini" plain type="primary"-->
      <!--                  style="width: 48px;height: 28px;margin-top: 10px"-->
      <!--                  @click="followUser(user)">-->
      <!--        关注-->
      <!--      </van-button>-->
      <van-button size="mini" plain type="primary"
                  style="width: 48px;height: 28px;margin-top: 10px" @click="toChat(user)">
        私聊
      </van-button>
    </template>
  </van-card>

</template>

<script setup lang="ts">
import {UserType} from "../models/user.js";
import myAxios from "../plugins/my-axios.js";
import {useRouter} from "vue-router";
import {showConfirmDialog, showFailToast} from "vant";
import {getCurrentUser} from "../services/user";

interface UserCardListProps {
  userList: UserType[]
}

const props = defineProps<UserCardListProps>()


const followUser = async (user: any) => {
  let res = await myAxios.post("/follow/" + user.id);
  if (res?.data.code === 0) {
    let res_ = await myAxios.get("/user/" + user.id);
    if (res_.data.code === 0) {
      user.isFollow = res_.data.data.isFollow
    }
  } else {
    showFailToast(res.data.message)
  }
}
let router = useRouter();
const showUserDetail = (id: any) => {
  router.push({
    path: "/user/detail",
    query: {
      id: id
    }
  })
}
const toChat = async (user: any) => {
  let currentUser = await getCurrentUser();
  if (!currentUser) {
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
    await router.push({
      path: "/chat",
      query: {
        id: user.id,
        username: user.username,
        userType: 1
      }
    })
  }
}
</script>

<style scoped>

</style>
