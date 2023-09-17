<template>
    <van-empty
        v-if="(!likeList || likeList.length===0) && loading===false"
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        image-size="80"
        description="您还没有收到过赞"
    />
    <van-loading vertical v-if="loading">
        <template #icon>
            <van-icon name="star-o" size="30"/>
        </template>
        加载中...
    </van-loading>
    <user-like-list :like-list="likeList"/>
</template>

<script setup>
import UserCommentList from "../components/UserCommentList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/my-axios.js";
import UserLikeList from "../components/UserLikeList.vue";

const loading = ref(true)
const likeList = ref([])
onMounted(async () => {
    let res = await myAxios.get("/message/like");
    if (res?.data.code === 0) {
        likeList.value = res.data.data
    }
    loading.value = false
})
</script>

<style scoped>

</style>
