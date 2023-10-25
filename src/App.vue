<script setup>
import { useUserStore } from '@/stores'

const userToken = useUserStore()
</script>

<template>
  <div>
    <router-view></router-view>
    <hr />
    {{ userToken.token }}
    <el-button @click="userToken.setToken('28da4ds5')">登录</el-button>
    <el-button @click="userToken.removeToken()">退出</el-button>
  </div>
</template>

<style scoped></style>
