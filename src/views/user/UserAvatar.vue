<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'

const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()
const onSelectFile = (uploadFile) => {
  //基于FileReader读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}

// 上传头像
const onUpdateAvayar = async () => {
  // 发送请求更新头像
  await userUpdateAvatarService(imgUrl.value)
  // userStore 重新渲染
  await userStore.getUser()
  // 提示用户
  ElMessage.success('头像上传成功')
}
</script>

<template>
  <PageContainer title="更换头像">
    <el-upload
      class="avatar-uploader"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onSelectFile"
      ref="uploadRef"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <br />
    <el-button
      type="primary"
      :icon="Plus"
      size="large"
      @click="uploadRef.$el.querySelector('input').click()"
      >选择图片</el-button
    >
    <el-button
      type="primary"
      :icon="Upload"
      size="large"
      @click="onUpdateAvayar"
      >确认上传</el-button
    >
  </PageContainer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
