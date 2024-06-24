<template>
  <div id="userSignPage">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="🌈请坚持每天签到哦🌟"
          @load="onLoad"
      >
        <van-cell v-for="sign in signList" :key="sign" :title="`&nbsp&nbsp`+sign">
          <template #icon>
            <van-icon name="star" style="color: #0854f1"/>
          </template>
          <template #right-icon>
            <van-icon name="checked" style="color: #11d35d"/>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>

</template>

<script setup lang="ts">
import {ref} from "vue";
import myAxios from "../../plugins/my-axios";

const signList = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = async () => {
  let res = await myAxios.get("/user/my/list/sign");
  console.log("签到信息：", res)
  if (refreshing.value) {
    signList.value = [];
    refreshing.value = false;
  }
  if (res.data.code === 0) {
    signList.value = res.data.data.map(sign => sign.signDate);
    signList.value.reverse();
  }
  loading.value = false;
  finished.value = true;
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};

</script>

<style scoped>
#userSignPage {
  margin: -20px 80px 0;

}

</style>