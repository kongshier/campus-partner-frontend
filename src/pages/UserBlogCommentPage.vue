<template>
    <van-empty
        v-if="(!commentList || commentList.length===0) && loading===false"
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        image-size="80"
        description="您还没有写过评论"
    />
    <van-loading vertical v-if="loading">
        <template #icon>
            <van-icon name="star-o" size="30"/>
        </template>
        加载中...
    </van-loading>
    <user-comment-list :comment-list="commentList"/>
</template>

<script setup>

import {onMounted, ref} from "vue";
import myAxios from "../plugins/my-axios.js";
import UserCommentList from "../components/UserCommentList.vue";

const loading = ref(true)
const commentList = ref()
onMounted(async () => {
    let res = await myAxios.get("/comments/list/my");
    if (res?.data.code === 0) {
        commentList.value = res.data.data
    }
    loading.value = false
})
</script>

<style scoped>

</style>
