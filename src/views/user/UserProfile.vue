<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateService } from '@/api/article'
import { ElMessage } from 'element-plus'

const {
  user: { nickname, username, email, id },
  getUser
} = useUserStore()

const userInfo = ref({
  nickname,
  username,
  email,
  id
})

const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { pattern: /^\S{2,10}$/, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
  ]
}

const formRef = ref()
// 更新用户信息
const onSubmit = async () => {
  await formRef.value.validate()
  // 提交修改
  await userUpdateService(userInfo.value)
  getUser()
  ElMessage.success('更新成功')
}
</script>

<template>
  <PageContainer title="基本资料">
    <!-- <el-row> -->
    <!-- <el-col :span="12"> -->
    <el-form
      size="large"
      label-width="100px"
      ref="formRef"
      :model="userInfo"
      :rules="rules"
    >
      <el-form-item label="登录名称">
        <el-input v-model="userInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交更改</el-button>
      </el-form-item>
    </el-form>
    <!-- </el-col> -->
    <!-- </el-row> -->
  </PageContainer>
</template>
