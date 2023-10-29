<script setup>
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const formRef = ref()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const checkOldSame = (rule, value, cb) => {
  if (value === pwdForm.value.old_pwd) {
    cb(new Error('原密码和新密码不能一样!'))
  } else {
    cb()
  }
}

const checkNewSame = (rule, value, cb) => {
  if (value !== pwdForm.value.new_pwd) {
    cb(new Error('新密码和确认再次输入的新密码不一样!'))
  } else {
    cb()
  }
}

const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '原密码长度在6到15个字符',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '新密码长度在6到15个字符',
      trigger: 'blur'
    },
    { validator: checkOldSame, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '确认密码长度在6到15个字符',
      trigger: 'blur'
    },
    { validator: checkNewSame, trigger: 'blur' }
  ]
}

const router = useRouter()
const userStore = useUserStore()
const onSubmit = async () => {
  formRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('修改成功')
  userStore.removeToken()
  userStore.setUser({})
  router.push('/login')
}
const onReset = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <PageContainer title="修改密码">
    <el-row>
      <el-col :span="12">
        <el-form
          ref="formRef"
          :model="pwdForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input
              v-model="pwdForm.old_pwd"
              placeholder="请输入原密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input
              v-model="pwdForm.new_pwd"
              placeholder="请输入新密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="re_pwd">
            <el-input
              v-model="pwdForm.re_pwd"
              placeholder="请确认新密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">修改密码</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </PageContainer>
</template>
