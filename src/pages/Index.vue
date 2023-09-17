<template>
  <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      left-icon="volume-o"
      style="margin-bottom: 10px;margin-top: -20px"
      text="校园有着你朗朗书声，有着你写不完的试卷，有着你忘不掉的老师，有着你共同学习的同学，在这里你可以尽情发挥你最好的水平。在这里可以找到志同道合的校友奋笔直追！！"
  />
  <div style="position: relative;height: 100%;width: 100%">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" lazy-render
               style="width: 90%;height: 150px;margin: 0 auto">
      <van-swipe-item v-for="image in Images" :key="image">
        <img :src="image" style="width: 100%;height: 150px"/>
      </van-swipe-item>
    </van-swipe>
    <van-tabs v-model:active="active">
      <van-tab title="🏫校园寻友">
        <van-pull-refresh
            v-model="refreshLoading"
            success-text="刷新成功"
            @refresh="onRefresh">
          <van-search v-model="userSearch" placeholder="请输入搜索关键词" shape="round" @search="searchUser"/>
          <van-list
              v-model:loading="listLoading"
              :finished="listFinished"
              offset="0"
              @load="onLoad"
              style="margin: 15px"
          >
            <template #finished>
              <span v-if="!searching">
                <van-empty :image-size="[60, 40]" description="🌏没有匹配小伙伴？可以搜索伙伴"/>
              </span>
            </template>
            <UserCardList :user-list="userList"/>
          </van-list>
          <van-back-top right="20px" bottom="60px"/>
          <van-empty v-if="(!userList ||　userList.length===0) && !listLoading && !searching" image="search"
                     description="暂无用户"/>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="🔥热门博文">
        <van-pull-refresh
            v-model="refreshLoading"
            success-text="刷新成功"
            @refresh="blogRefresh">
          <van-search v-model="blogSearch" placeholder="请输入搜索关键词" shape="round" @search="searchBlog"/>
          <van-list
              v-model:loading="listLoading"
              :finished="blogListFinished"
              offset="0"
              @load="blogLoad"
              style="margin: 15px"
          >
            <template #finished>
              <van-empty :image-size="[60, 40]" v-if="!searching">🌈没有更多博文了</van-empty>
            </template>
            <blog-card-list :blog-list="blogList"/>
          </van-list>
          <van-back-top right="20px" bottom="60px"/>
          <van-empty v-if="(!blogList ||　blogList.length===0) && !listLoading &&!searching" image="search"
                     description="暂无博文"/>
        </van-pull-refresh>
      </van-tab>
      <van-loading vertical v-if="searching">
        <template #icon>
          <van-icon name="star-o" size="30"/>
        </template>
        加载中...
      </van-loading>
    </van-tabs>
  </div>


</template>
<script setup>
import {onMounted, ref} from "vue";
import myAxios from "../plugins/my-axios.js";
import {showFailToast, showSuccessToast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import BlogCardList from "../components/BlogCardList.vue";
import Images from "../constants/teamImg.ts";

const searching = ref(false)
const listLoading = ref(false)
const listFinished = ref(false)
const userList = ref([])
const refreshLoading = ref(false)
const currentPage = ref(0)
const userSearch = ref("")
const active = ref(0)
const blogList = ref([])
const blogListFinished = ref(false)
const blogCurrentPage = ref(0)

const blogLoad = async () => {
  blogCurrentPage.value++
  await getBlogList(blogCurrentPage.value)
}

const getBlogList = async (currentPage) => {
  let res = await myAxios.get("/blog/list", {
    params: {
      currentPage: currentPage,
      title: blogSearch.value
    }
  });
  if (res?.data.code === 0) {
    if (res.data.data.records.length > 0) {
      res.data.data.records.forEach(item => blogList.value.push(item))
    } else {
      blogListFinished.value = true
    }
    listLoading.value = false
  }
}

async function getUserList(currentPage) {
  const userListData = await myAxios.get("/user/match", {
    params: {
      currentPage: currentPage,
      username: userSearch.value
    }
  })
  if (userListData?.data.code === 0) {
  } else {
    showFailToast("加载失败")
  }
  if (userListData?.data.data.records.length === 0) {
    listFinished.value = true
    return
  }
  if (userListData?.data.data.records) {
    userListData.data.data.records.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    for (let i = 0; i < userListData.data.data.records.length; i++) {
      userList.value.push(userListData.data.data.records[i])
    }
  }
}

const onLoad = async () => {
  currentPage.value++
  await getUserList(currentPage.value)
  listLoading.value = false;
}
const onRefresh = async () => {
  currentPage.value = 1
  userList.value = []
  listFinished.value = false
  await getUserList(currentPage.value)
  refreshLoading.value = false
  listLoading.value = false;
}

const blogRefresh = async () => {
  blogCurrentPage.value = 1
  blogList.value = []
  blogListFinished.value = false
  await getBlogList(blogCurrentPage.value)
  refreshLoading.value = false
  listLoading.value = false
}
const searchUser = async () => {
  searching.value = true
  userList.value = []
  currentPage.value = 1
  await getUserList(currentPage.value)
  searching.value = false
}
const blogSearch = ref("")
const searchBlog = async () => {
  searching.value = true
  blogList.value = []
  blogCurrentPage.value = 1
  await getBlogList(blogCurrentPage.value)
  searching.value = false
}
</script>
<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}

.my-swipe {
  margin: 15px;
  border-radius: 3%;
}


</style>
