import request from '@/utils/request'

// 获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')

// 编辑文章分类
export const artEditChannelsService = (data) =>
  request.put('/my/cate/info', data)

// 添加文章分类
export const artAddChannelsService = (data) =>
  request.post('/my/cate/add', data)

// 删除文章分类
export const artSubChannelsService = (id) =>
  request.delete('/my/cate/del', {
    params: {
      id
    }
  })

//获取文章列表
export const artGetListService = (params) => {
  return request.get('/my/article/list', {
    params
  })
}

// 添加文章
// 注意：data需要是一个formData格式的对象
export const artPublicshService = (data) =>
  request.post('/my/article/add', data)

// 获取文章详情
export const artGetDatailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })

// 更新文章
export const artEditService = (data) => request.put('/my/article/info', data)

// 删除文章
export const artDelService = (id) =>
  request.delete('/my/article/info', {
    params: { id }
  })

// 更新用户信息
export const userUpdateService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })
