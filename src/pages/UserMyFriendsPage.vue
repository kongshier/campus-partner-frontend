<template>
  <div id="userMyFriendsPage">
    <van-empty
        v-if="(!userList || userList.length===0) && loading===false"
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        image-size="80"
        description="暂无好友申请"
    />
    <van-loading vertical v-if="loading">
      <template #icon>
        <van-icon name="star-o" size="30"/>
      </template>
      加载中...
    </van-loading>
    <van-card v-for="(user,index) in userList"
              :title="user.username"
              :key="index"
              :desc="user.profile"
              style="border-radius: 15px;background-color: #e8e8e8"
    >
      <template #thumb>
        <van-image :src="user?.avatarUrl" round width="88" height="88" @click="showUserDetail(user?.id)"/>
      </template>
      <template #tags>
        <van-tag v-for="tag in user?.tags" plain type="danger" style="margin-right: 8px;margin-top: 8px">
          {{ tag }}
        </van-tag>
      </template>
      <template #price>
        <van-icon name="phone-o" style="">{{ ':' + user.phone }}</van-icon>
      </template>
      <template #num>
        <van-button size="mini" plain type="primary"
                    style="width: 48px;height: 28px;margin-top: 10px" @click="toChat(user)">
          私聊
        </van-button>
      </template>
    </van-card>
  </div>
</template>


<script setup>
import {onMounted, ref} from "vue";
import myAxios from "../plugins/my-axios.js";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const userList = ref([])
const friendStatus = ref([]);
onMounted(async () => {
  let res = await myAxios.get("/friends/my/list");
  console.log("申请列表", res.data.data);
  if (res?.data.code === 0) {
    res.data.data.forEach((user) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
      userList.value.push(user)
      friendStatus.value.push(user.status)
    })
  }
  loading.value = false
})

const showUserDetail = (id) => {
  router.push({
    path: "/user/detail",
    query: {
      id: id
    }
  })
}

const toChat = (user) => {
  console.log(user.id)
  router.push({
    path: "/chat",
    query: {
      id: user.id,
      username: user.username,
      userType: 1
    }
  })
}

</script>

<style scoped>
#userMyFriendsPage {
  margin-top: -15px;
  margin-left: 15px;
  margin-right: 15px;
}

.friend-button {
  position: fixed;
  bottom: 60px;
  right: 20px;
}

</style>
