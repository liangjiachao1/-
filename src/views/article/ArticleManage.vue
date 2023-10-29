<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/channelselect.vue'
import { formatTime } from '@/utils/format'
import { artGetListService, artDelService } from '@/api/article'
import { ElMessage } from 'element-plus'
import ArticleEdit from './components/ArticleEdit.vue'
const articleList = ref([])

const loading = ref(false)

const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

const total = ref(0)

// 搜索逻辑 => 按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}

// 重置逻辑 => 将筛选条件清空，重新检索，从第一页开始展示
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 基于params 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

const onSizeChange = (size) => {
  // 只要是每页条数变化了，那么原本访问的当前页意义不大了，数据大概率已经不在原来的那一页了
  // 重新从第一页渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的当前页 和 每页条数，渲染数据
  getArticleList()
}

const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

const articleEditRef = ref()

// 添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 删除逻辑
const onDeleteArticle = async (row) => {
  // 提示用户是否要删除
  await ElMessageBox.confirm('此操作将永久删除改文件，是否继续', '提示', {
    type: 'warning',
    cinfirmButtonText: '确定',
    canceButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}

// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 发布或者编辑文章 重新渲染数据
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPasge = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPasge
  }
  getArticleList()
}
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- vue2 => v-model  :value 和 @input 的简写 -->
        <!-- vue3 => v-model  :modelValue 和 @update:modelValue 的简写 -->
        <!-- v-model === v-model:modelValue    -->
        <!-- 这里的modelValue可以自己定义名字 ，然后再把父组件和子组件的modelValue全部修改成你想要的名字即可 -->
        <!-- 比如  想要修改成   cid 
              那么 父组件： v-model:cid 
                   子组件  :cid   @update:cid
         -->
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select v-model="params.state">
          <!-- 这里后台标记发布状态，就是通过中文标记的，已发布/草稿 -->
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="articleList" style="width: 100%">
      <el-table-column prop="title" label="文章标题">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">
            {{ row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column prop="put_date" label="发布时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            circle
            plain
            @click="onEditArticle(row)"
            :icon="Edit"
          ></el-button>
          <el-button
            type="danger"
            circle
            plain
            @click="onDeleteArticle(row)"
            :icon="Delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top:20px,justify-content:flex-end"
    />
    <!-- 添加编辑抽屉 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </PageContainer>
</template>
