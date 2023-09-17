<template>
  <div id="userFriendsPage">
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
        <van-image :src="user?.avatarUrl" round width="88" height="88"/>
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
        <van-button v-if="friendStatus[index]===0" size="mini" plain type="danger"
                    style="width: 40px;height: 24px;margin-top: 10px" @click="notAgreeFriend(user.id)">
          拒绝
        </van-button>
        <van-button v-if="friendStatus[index]===0" size="mini" plain type="primary"
                    style="width: 40px;height: 24px;margin-top: 10px" @click="agreeFriend(user.id)">
          同意
        </van-button>
        <van-button v-if="friendStatus[index]===1" size="mini" plain type="default" disabled
                    style="width: 48px;height: 24px;margin-top: 10px">
          已同意
        </van-button>
        <van-button v-if="friendStatus[index]===3" size="mini" plain type="danger" disabled
                    style="width: 48px;height: 24px;margin-top: 10px">
          已拒绝
        </van-button>
      </template>
    </van-card>
    <van-button class="friend-button" round text="好友列表" plain type="primary" to="/my/friends"/>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import myAxios from "../plugins/my-axios.js";
import {showFailToast, showSuccessToast} from "vant";

const loading = ref(true)
const userList = ref([])
const friendStatus = ref([]);

onMounted(async () => {
  let res = await myAxios.get("/friends/getRecords");
  console.log("申请列表", res.data.data);
  if (res?.data.code === 0) {
    res.data.data.forEach((user) => {
      if (user.applyUser.tags) {
        user.applyUser.tags = JSON.parse(user.applyUser.tags)
      }
      userList.value.push(user.applyUser)
      friendStatus.value.push(user.status)
    })
  }
  loading.value = false
})
const agreeFriend = async (userId) => {
  let res = await myAxios.post("/friends/agree/" + userId);
  if (res.data.code === 0) {
    window.location.reload()
    showSuccessToast("已同意添加好友");
  } else {
    showFailToast("同意失败," + res.data.description)
  }
}

const notAgreeFriend = async (userId) => {
  let res = await myAxios.post("/friends/canceledApply/" + userId);
  if (res.data.code === 0) {
    window.location.reload()
    showSuccessToast("已同意添加好友");
  } else {
    showFailToast("同意失败," + res.data.description)
  }
}

</script>

<style scoped>
#userFriendsPage {
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

