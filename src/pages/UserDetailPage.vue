<template>
  <van-row justify="center">
    <van-image :src="user?.avatarUrl" round width="86" height="86"/>
  </van-row>
  <van-cell-group inset style="margin-top: 10px">
    <van-cell icon="contact" title="昵称" :value="user?.username"/>
    <van-cell title="标签">
      <template #value>
        <van-tag v-if="user?.tags.length>0" v-for="tag in user?.tags" plain type="danger"
                 style="margin-right: 8px">
          {{ tag }}
        </van-tag>
        <span v-else>他太懒了，暂无标签</span>
      </template>
      <template #icon>
        <van-icon name="like-o" style="top: 5px;margin-left: 5px;right: 5px;color: #ff0000"/>
      </template>
    </van-cell>
    <van-cell title="简介">
      <template #value>
        <van-text-ellipsis :content="user?.profile || '他太懒了，暂无简介'"/>
      </template>
      <template #icon>
        <van-icon name="award-o" style="top: 5px;margin-left: 5px;right: 5px;color: #ffa600"/>
      </template>
    </van-cell>
    <van-cell icon="user-circle-o" title="性别">
      <span v-if="user?.gender===1">男</span>
      <span v-else-if="user?.gender===0">女</span>
      <span v-else-if="user?.gender===2">保密</span>
      <span v-else>该用户暂未填写性别</span>
    </van-cell>
    <van-cell icon="phone-o" title="电话" :value="user?.phone"/>
    <van-cell icon="send-gift-o" title="邮箱" :value="user?.email || '他太懒了，暂无邮箱'"/>
  </van-cell-group>
  <div style="margin: 16px">
    <div v-if="user?.id !== currentUser?.id">
      <van-button v-if="user?.isFollow" style="width: 80%;margin-left: 40px" plain round type="danger"
                  @click="followUser">
        取消关注
      </van-button>
      <van-button v-else style="width: 80%;margin-left: 40px;margin-top: 10px" plain round type="primary"
                  @click="followUser">关注
      </van-button>
      <van-button style="width: 80%;margin-left: 40px;margin-top: 10px" round type="primary" @click="toChat">
        私聊
      </van-button>
      <van-button style="width: 80%;margin-left: 40px;margin-top: 10px" plain round type="primary" @click="addFriends">
        添加好友
      </van-button>
    </div>
  </div>
  <van-dialog v-model:show="showAddUserApply" :title="'添加好友：'+user?.username.slice(0,10)" show-cancel-button
              @confirm="toAddUserApply(user?.id)">
    <div style="padding-top:8px"></div>
    <van-field v-model="addUserApplyText"
               type="text"
               placeholder="请输入验证信息："
               style="text-align: center;width: 150px;margin-left: 75px;"
    />
    <div style="padding-top:8px "></div>
  </van-dialog>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/my-axios.js";
import {showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user.ts";

const showAddUserApply = ref(false)
const addUserApplyText = ref("")
let route = useRoute();
const user = ref()
const currentUser = ref()
onMounted(async () => {
  currentUser.value = await getCurrentUser();
  let res = await myAxios.get("/user/" + route.query.id);
  if (res?.data.code === 0) {
    if (res.data.data.tags) {
      res.data.data.tags = JSON.parse(res.data.data.tags)
    }
    user.value = res.data.data
  }
})
const toAddUserApply = async (id) => {
  const status = await myAxios.post("/friends/add", {
    "receiveId": id,
    "remark": addUserApplyText.value
  })
  if (status) {
    showSuccessToast("申请成功")
  }
}
const followUser = async () => {
  let res = await myAxios.post("/follow/" + user.value.id);
  if (res?.data.code === 0) {
    let res_ = await myAxios.get("/user/" + user.value.id);
    if (res_.data.code === 0) {
      user.value.isFollow = res_.data.data.isFollow
    }
  }
}
let router = useRouter();
const toChat = () => {
  router.push({
    path: "/chat",
    query: {
      id: user.value.id,
      username: user.value.username,
      userType: 1
    }
  })
}

/**
 * 显示弹窗
 */
const addFriends = () => {
  // 将弹窗显示 设置为true
  showAddUserApply.value = true;
}
</script>

<style scoped>

</style>
