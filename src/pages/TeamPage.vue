<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <van-tabs v-model:active="active" @change="tabChange">
      <van-tab title="公开" name="public"/>
      <van-tab title="加密" name="private"/>
    </van-tabs>
    <van-pull-refresh
        v-model="refreshLoading"
        success-text="刷新成功"
        @refresh="onRefresh"
    >
      <van-list
          v-model:loading="listLoading"
          :finished="listFinished"
          offset="0"
          finished-text="🌐 没有更多队伍了 🌏"
          @load="onLoad"
      >
        <TeamCardList :team-list="teamList" @refresh="onRefresh"/>
      </van-list>
    </van-pull-refresh>
    <van-empty image="search" v-if="(!teamList || teamList.length===0) && !listLoading"
               description="暂无符合要求的队伍"/>
    <van-button class="add-button" icon="plus" type="primary" @click="toCreateTeam"></van-button>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {ref} from "vue";
import myAxios from "../plugins/my-axios.js";
import {showConfirmDialog, showFailToast} from "vant";
import {getCurrentUser} from "../services/user.ts";

const active = ref('public')
let router = useRouter();
const searchText = ref("")
const teamList = ref([])
const loading = ref(false);
const refreshLoading = ref(false)
const listLoading = ref(false)
const listFinished = ref(false)
const currentPage = ref(0)
const tabChange = (name) => {
  teamList.value = []
  listFinished.value = false
  currentPage.value = 1
  if (name === 'public') {
    listTeams(currentPage.value, searchText.value, 0)
  } else {
    listTeams(currentPage.value, searchText.value, 2)
  }
}
const toCreateTeam = async () => {
  let user = await getCurrentUser();
  if (!user) {
    showConfirmDialog({
      message:
          "该功能需要登陆后使用,是否登录",
      confirmButtonText: "去登录"
    })
        .then(() => {
          router.replace("/user/login")
        })
        .catch(() => {
        });
  } else {
    await router.push("/team/add")
  }
}
const listTeams = async (currentPage, val = '', status = 0) => {
  listLoading.value = true
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      status,
      currentPage
    }
  })
  if (res?.data.code === 0) {
    if (res.data.data.records.length === 0) {
      listFinished.value = true
      return
    }
    res.data.data.records.forEach(team => teamList.value.push(team))
  } else {
    showFailToast("队伍加载失败" + (res.data.message ? `,${res.data.message}` : ''))
  }
  listLoading.value = false
}
const onSearch = async (val: any) => {
  teamList.value = []
  listFinished.value = false
  currentPage.value = 1
  if (active.value === 'public') {
    await listTeams(currentPage.value, searchText.value, 0)
  } else {
    await listTeams(currentPage.value, searchText.value, 2)
  }
}
const onLoad = async () => {
  currentPage.value++
  await listTeams(currentPage.value)
  // onLoading.value=false
}

const onRefresh = async () => {
  teamList.value = []
  listFinished.value = false
  currentPage.value = 1
  if (active.value === 'public') {
    await listTeams(currentPage.value, searchText.value)
  } else {
    await listTeams(currentPage.value, searchText.value, 2)
  }
  refreshLoading.value = false
}

</script>

<style scoped>
#teamPage {
  margin-top: -30px;
}

</style>
