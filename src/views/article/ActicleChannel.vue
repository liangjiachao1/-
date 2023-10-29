<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artSubChannelsService } from '@/api/article'
import ChannelEdit from './components/ChannelEdit.vue'
import { Edit, Delete } from '@element-plus/icons-vue'

const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
  // console.log(channelList.value)
}
getChannelList()

const onEditChannel = (obj) => {
  dialog.value.open(obj)
}
const onDelChannel = async (obj) => {
  await ElMessageBox.confirm('你确定要删除该分类信息吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artSubChannelsService(obj.id)
  ElMessage.success('删除成功')
  getChannelList()
}

const onAddChannel = () => {
  dialog.value.open({})
}

const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" type="index" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            @click="onEditChannel(row)"
            type="primary"
            plain
            :icon="Edit"
            circle
          ></el-button>
          <el-button
            @click="onDelChannel(row)"
            type="danger"
            plain
            :icon="Delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </PageContainer>
</template>
