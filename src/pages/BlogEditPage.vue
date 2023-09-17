<template>
  <div id="blogEditPage">
    <van-sticky>
      <van-nav-bar
          title="发布博文"
          left-arrow
          @click-left="onClickLeft"
          @click-right="onClickRight"
          style="margin: 5px"
      >
        <template #right>
          发布
        </template>
      </van-nav-bar>
    </van-sticky>
    <div style="padding: 15px;">
      <van-field v-model="title"
                 show-error
                 placeholder="请输入标题："
                 style="margin: 5px 0"
                 :rules="[{ required: true, message: '请输入博文标题：' }]"/>
      <van-field
          v-model="content"
          rows="1"
          autosize
          type="textarea"
          style="margin: 5px 0"
          placeholder="请输入内容："
          :rules="[{ required: true, message: '请输入博文内容' }]"
      />
      <van-uploader v-model="fileList" preview-size="100" multiple :max-count="5" :max-size="2 * 1024 * 1024"
                    @oversize="overSize" :preview-full-image="false">
        <template #default>
          <div class="updateArea">
            <van-icon name="add-o" class="updateIcon" size="50px"/>
          </div>
        </template>
      </van-uploader>
    </div>
    <van-overlay :show="addingOverlay">
      <div class="wrapper">
        <van-loading vertical>
          <template #icon>
            <van-icon name="star-o" size="30"/>
          </template>
          添加中...
        </van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import {getCurrentUser} from "../services/user.ts";
import myAxios from "../plugins/my-axios.js";

const addingOverlay = ref(false)
const fileList = ref([])
const title = ref("")
const content = ref("")
const router = useRouter()
const user = ref()
const blogId = ref()
const onClickLeft = () => {
  router.push("/")
};
const onClickRight = async () => {
  if (title.value === '') {
    showFailToast("请填写标题")
  }
  if (content.value === '') {
    showFailToast("请填写正文")
  }
  addingOverlay.value = true
  if (!blogId.value) {
    let formData = new FormData();
    for (let i = 0; i < fileList.value.length; i++) {
      formData.append("images", fileList.value[i].file)
    }
    formData.append("title", title.value)
    formData.append("content", content.value)
    let res = await myAxios.post("/blog/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    if (res?.data.code === 0) {
      addingOverlay.value = false
      showSuccessToast("添加成功")
      await router.replace("/")
    } else {
      addingOverlay.value = false
      showFailToast("添加失败" + (res.data.message ? `,${res.data.message}` : ''))
    }
  } else {
    let formData = new FormData();
    formData.append("id", blogId.value)
    const imgStr = []
    for (let i = 0; i < fileList.value.length; i++) {
      if (fileList.value[i].url) {
        imgStr.push(fileList.value[i].url)
      } else {
        formData.append("images", fileList.value[i].file)
      }
    }
    let finalImgStr = imgStr.join(",");
    formData.append("imgStr", finalImgStr)
    formData.append("title", title.value)
    formData.append("content", content.value)
    let res = await myAxios.put("/blog/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    if (res?.data.code === 0) {
      addingOverlay.value = false
      showSuccessToast("更新成功")
      await router.replace("/blog?id=" + blogId.value)
    } else {
      addingOverlay.value = false
      showFailToast("更新失败," + (res.data.message ? `,${res.data.message}` : ''))
    }
  }
};
const overSize = () => {
  showFailToast("单个图片不能超过2M")
}
let route = useRoute();
onMounted(async () => {
  if (route.query.id) {
    blogId.value = route.query.id
  }
  if (route.query.images) {
    route.query.images.forEach((item) => {
      const image = {
        url: item,
        isImage: true
      }
      fileList.value.push(image)
    })
  }
  if (route.query.title) {
    title.value = route.query.title
  }
  if (route.query.content) {
    content.value = route.query.content
  }
  let currentUser = await getCurrentUser();
  if (currentUser) {
    user.value = currentUser
  } else {
    showFailToast("未登录")
    await router.replace("/user/login")
  }
})
</script>

<style scoped>
#blogEditPage{
  margin-top: -15px;
}
.updateIcon {
  left: 25px;
  top: 25px;
  border-radius: 50%;
}

.updateArea {
  margin-top: 10px;
  border-radius: 10%;
  width: 100px;
  height: 100px;
  background-color: #c7c7c7;
  color: #ffffff;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
