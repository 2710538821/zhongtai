<template>
  <div>
    <!-- list-type 文件列表的类型	string	text/picture/picture-card -->
    <!-- limit 最大允许上传个数 -->
    <!-- action	必选参数，上传的地址 => 如果不加action会报错，没有地址就填个 # 即可 -->
    <!-- on-preview	点击文件列表中已上传的文件时的钩子 function(file) -->
    <!-- file-list 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]	array -->
    <!-- on-remove 文件列表移除文件时的钩子 function(file, fileList) -->
    <!-- on-change 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用	function(file, fileList) -->
    <!-- before-upload 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传 function(file) -->
    <!-- http-request	覆盖默认的上传行为，可以自定义上传的实现 function -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{ show : fileShow }"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :http-request="httpRequest"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showProgress" :percentage="percentage" style="width: 170px;margin-top:10px" />
    <el-dialog :visible.sync="showDialog" title="图片预览" center>
      <img :src="imgUrl" alt="" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
// 引入腾讯云cos包
import COS from 'cos-js-sdk-v5'
// 实例化一个COS对象
const cos = new COS({
  // 一定要拷贝自己的id和密钥才能上传到自己的存储桶里面
  SecretId: 'AKIDQcW8WdS4ORCfqjMhjV0EApCJ9hxvayA5', // 身份识别 ID
  SecretKey: 'h6D4j9G6dvuWrue7IBn8BwOXNxGHzRcX' // 身份密钥
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      // fileList: [{ url: 'https://img2.baidu.com/it/u=2339427985,1935737865&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=375' }],
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: '', // 记录正在上传的uid
      percentage: 0, // 当前的百分比
      showProgress: false
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileShow() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      // console.log(file)
      // console.log(file.url)
      this.imgUrl = file.url
      this.showDialog = true
    },

    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      // console.log(file) // file是要删除的文件
      // console.log(fileList) // fileList是删除之后的文件
      // console.log(this.fileList)
      this.fileList = fileList.filter(item => item.uid !== file.uid) // 将当前的删除文件排除在外
      // this.fileList = fileList
    },

    // 文件状态改变时的钩子
    // 这里不能用push，因为这个钩子会执行多次
    handleChange(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // console.log(this.fileList)
      // console.log(fileList.length)
      // file是当前的文件，fileList是当前的最新数组
      // 如果当前fileList中没有该文件的话，就往里面进行追加
      this.fileList = fileList.map(item => item)
      // on-change 文件状态改变时的钩子，添加文件(第一次)、上传成功(第二次)和上传失败(第二次)时都会被调用
      // 这里上传图片暂时没有成功，因为现在还没有上传，所以第二次进来的数据一定是个空的（上面的 action="#"，表示为空）
      // 如果完成上传动作了，第一次进入和第二次进入的fileList的长度应该都是1，这也代表了都有数据
      // 上传成功 => 数据才能进来 => 腾讯云cos
    },

    // 上传文件之前的钩子
    beforeUpload(file) {
      // console.log(file)
      const type = ['image/png', 'image/jpeg', 'image/gif', 'image/bmg']
      /* every相当于逻辑关系中的且，只有所有参数都满足条件时，才返回true，一旦有一个不满足，则逻辑中断，返回false；
      some相当于逻辑关系中的或，只要有一个参数满足条件，就中断遍历，返回true，若遍历完所有参数，没有符合的项，返
      回false，通俗一点就是 every:一假即假,some:一真即真 */
      // 用some的话，里面不能用 !==，因为some如果找到一个不等于上传图片的格式，那么就直接终止返回false
      if (!type.some(item => item === file.type)) {
      // if (!type.includes(file.type)) {
        this.$message.error('上传图片的格式不正确')
        return false // 终止上传
      }
      // 1024 => 2的十次方
      // 检查图片大小 1M = 1024KB   1KB = 1024B
      // 一天的毫秒数：1 * 24 * 60 * 60 * 1000
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传图片的大小不能大于5M')
        return false // 终止上传
      }
      // 目前已经确定当前上传的图片文件就是这个file了
      // console.log(file)
      this.showProgress = true
      this.currentFileUid = file.uid
      return true // 最后一定要return true
      // 说明检查通过了，可以进行正常的上传动作
    },

    // 进行上传操作
    httpRequest(params) {
      // console.log(params)
      // console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          // 上传到腾讯云 => 哪个存储桶，哪个地域的存储桶、文件、格式、名称、回调
          Bucket: 'hrsaas-1312760518', // 存储桶
          Region: 'ap-nanjing', // 地域名称
          Key: params.file.name, // 文件名，可选择使用上传图片的名称
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型，直接默认，标准模式即可
          onProgress: (params) => {
            // console.log(params)
            this.percentage = params.percent * 100
          }
        // }, function(err, data) {
        }, (err, data) => { // 换成箭头函数是因为下面的
          // console.log(err || data)
          // data返回数据之后，应该如何处理
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功，要获取成功的返回地址
            // fileList才能显示到上传组件上，此时我们要将fileList中的数据的url地址变成现在成功的地址
            // 目前虽然是一张图片，但是要注意的是我们现在的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的uid
              if (item.uid === this.currentFileUid) {
                // 如果两个uid相等，就将成功的图片地址把原来的fileList中的url的地址替换掉
                return { url: 'https://' + data.Location, upload: true } // 将上传成功的地址回写到fileList中
                // upload: true 表示这张图片已经上传完毕，这个属性要为我们后期应用的时候做标记(比如在员工列表中上传用户头像的时候)
              }
              // 如果上面判断不成立的话，要在下面返回一下，不返回就是一个undefined，这是map的固定用法
              return item // 将上传成功的地址回写到fileList中
              // fileList变化 => upload组件 就会根据fileList的变化而去渲染视图
            })
            // 如果图片过小加载过快想看进度的话可以加个延时器
            setTimeout(() => {
              this.percentage = 0 // 重置进度条为0
              this.showProgress = false // 关闭进度条
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
/* 这里style不能加scoped */
.show .el-upload--picture-card{
  display: none;
}
/* dialog内容居中 */
/* .el-dialog .el-dialog__body{
      display: flex;
      justify-content: center;
      align-items: center;
} */
</style>
