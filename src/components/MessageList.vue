<template>
    <van-cell-group v-for="message in messageList">
        <van-cell :title="message.title" :label="message.label" :value="message.value">
            <template #icon>
                <div class="icon_area">
                    <van-icon name="volume" color="#2a2e31" class="icon" size="20px"/>
                </div>
            </template>
        </van-cell>
    </van-cell-group>
</template>

<script setup>
import {ref} from "vue";

const messageList=ref([{
    title:"111",
    label:"222",
    value:"333"
},{
    title:"111",
    label:"222",
    value:"333"
},{
    title:"111",
    label:"222",
    value:"333"
}])
</script>

<style>
.icon_area {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #ededed;
    position: relative;
    margin-right: 5px;
    margin-left: 10px;
}

.van-cell {
    padding-left: 5px;
}

.icon {
    position: absolute;
    left: 14px;
    top: 14px
}
</style>