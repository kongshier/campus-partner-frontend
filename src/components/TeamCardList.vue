<template>
  <van-card
      v-for="team in props.teamList"
      :desc="team.description"
      :thumb="team?.coverImage ||　defaultImg"
      @click-thumb="getTeamDetail(team.id)"
  >
    <template #title>
      <div class="team-title" @click="getTeamDetail(team.id)">{{ team.name }}</div>
    </template>
    <template #tags>
      <van-tag plain type="danger" style="margin-right: 8px;margin-top: 8px" @click="getTeamDetail(team.id)">
        {{ teamStatusEnum[team.status] }}
      </van-tag>
    </template>
    <template #bottom>
      <div style="margin-top: 2px" @click="getTeamDetail(team.id)">
        {{ '队伍人数：' + team.hasJoinNum + "/" + team.maxNum }}
      </div>
      <div style="margin-top: 2px">
        <span class="sp_font">过期时间</span>
        {{ ": " + (team.expireTime !== null ? team.expireTime : "永不过期") }}
      </div>
      <div style="margin-top: 2px">
        <span class="sp_font">创建时间</span>
        {{ ": " + team.createTime }}
      </div>
    </template>
    <template #footer>
      <van-button v-if="team.userId !==currentUser?.id && !team.hasJoin" size="small" plain type="primary"
                  @click="doJoinTeam(team)">
        加入队伍
      </van-button>
      <van-button v-if="team.hasJoin && team.userId!==currentUser?.id" size="small" plain
                  @click="doQuitTeam(team.id)">
        退出队伍
      </van-button>
      <van-button v-if="team.userId===currentUser?.id || currentUser?.role===1" size="small" plain
                  @click="doUpdateTeam(team.id)">
        更新队伍
      </van-button>
      <van-button v-if="team.userId===currentUser?.id || currentUser?.role===1" size="small" plain type="danger"
                  @click="doDeleteTeam(team.id)">
        解散队伍
      </van-button>
    </template>
  </van-card>
  <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button
              @confirm="joinTeam(joinTeamId,teamPassword)"
              @cancel="doClear">
    <van-field v-model="teamPassword" placeholder="请输入密码"/>
  </van-dialog>
</template>

<script setup lang="ts">
import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team.ts";
import defaultImg from "../assets/defalutTeamImg.jpg"
import myAxios from "../plugins/my-axios.js";
import {showConfirmDialog, showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user.ts";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const showPasswordDialog = ref(false)
const teamPassword = ref('')
let currentUser = ref()
const joinTeamId = ref()
let emits = defineEmits(['refresh']);

interface TeamCardListProps {
  teamList: TeamType[]
}

const props = withDefaults(defineProps<TeamCardListProps>(), {})

onMounted(async () => {
  currentUser.value = await getCurrentUser()
})
const router = useRouter()

const joinTeam = async (teamId, password = '') => {
  const res = await myAxios.post("/team/join", {
    teamId,
    password
  })
  if (res?.data.code === 0) {
    showSuccessToast("加入队伍成功")
    onRefresh()
  } else {
    showFailToast("加入队伍失败" + (res.data.message ? `,${res.data.message}` : ''))
  }
  doClear()
}
const doJoinTeam = async (team: TeamType) => {
  joinTeamId.value = team.id
  if (team.status === 2) {
    showPasswordDialog.value = true
  } else {
    await joinTeam(team.id)
  }
}
const doUpdateTeam = (id: number) => {
  router.push({
    path: "/team/update",
    query: {
      id
    }
  })
}

const doQuitTeam = async (id: number) => {
  const res = await myAxios.post("/team/quit", {
    teamId: id
  })
  if (res?.data.code === 0) {
    showSuccessToast("退出队伍成功")
    onRefresh()
  } else {
    showFailToast("退出队伍失败" + (res.data.message ? `,${res.data.message}` : ''))
  }
}

const doDeleteTeam = async (id: number) => {
  showConfirmDialog({
    title: '确定要解散队伍吗',
    message:
        '此操作无法撤回',
  })
      .then(async () => {
        const res = await myAxios.post("/team/delete", {
          id
        })
        if (res?.data.code === 0) {
          showSuccessToast("解散队伍成功")
          onRefresh()
        } else {
          showFailToast("解散队伍失败" + (res.data.message ? `,${res.data.message}` : ''))
        }
      })
      .catch(() => {
      });
}

const onRefresh = () => {
  emits("refresh")
}
const doClear = () => {
  joinTeamId.value = ''
  teamPassword.value = ''
}
const getTeamDetail = (id) => {
  router.push({
    path: "/team/info",
    query: {
      id
    }
  })
}
</script>

<style scoped>
:deep(.van-image__img) {
  height: 128px;
  object-fit: unset;
}

.team-title {
  color: rgb(50, 50, 51);
  display: -webkit-box;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Segoe UI", Arial, Roboto, "PingFang SC", miui, "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
  font-size: 12px;
  font-weight: 600;
  height: 16px;
  line-height: 16px;
  max-height: 32px;
  overflow-x: hidden;
  overflow-y: hidden;
  text-overflow: ellipsis;
  width: 247px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
