<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="file标题">
        <el-input v-model="file.title"
                  placeholder=" 请输入file的标题" />
      </el-form-item>

      <el-form-item label="选择文件">
        <!-- 此处auto-upload自动提交必须设置为true，否则不会触发成功的事件 -->
        <el-upload ref="upload"
                   :auto-upload="true"
                   :on-success="fileUploadSuccess"
                   :on-error="fileUploadError"
                   :disabled="importBtnDisabled"
                   :limit="1"
                   :action="BASE_API+'/educms/banner/uploadBanners'"
                   name="file">
          <!-- name属性很重要，要和后端定义的文件名一致，此处后端为 MultipartFile file , 所以这里要取名file -->
          <el-button slot="trigger"
                     size="small"
                     type="primary">选取文件</el-button>
          <el-button :loading="loading"
                     style="margin-left: 10px;"
                     size="small"
                     type="success"
                     @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>

import Tinymce from '@/components/Tinymce' // 引入富文本编辑器组件
import banner from '@/api/edu/banner'

export default {
  components: { Tinymce }, // 第三方组件必须声明后才能使用
  data () {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false,
      file: {}

    }
  },
  created () {
    this.init()
  },
  methods: {

    // 点击上传文件到后端接口的方法

    submitUpload () {
      // 如果存在文件id标明是更新文件信息
      if (this.$route.params && this.$route.params.id) {
        this.file.id = this.$route.params.id
        banner.updateBannerById(this.file)
          .then(response => {
            this.$message({
              type: 'success',
              message: 'file信息更新成功'
            })
          })
        // 没有文件id表明第一次上传文件
      } else {
        banner.uploadBanner(this.file).then(response => {
          this.$message({
            type: 'success',
            message: 'file信息数据库录入成功成功'
          })
        })

        // this.importBtnDisabled = true
        // this.loading = true
        // vue中提交表单的方法
        // this.$refs.upload.submit()
      }
    },
    // 上传成功的方法
    fileUploadSuccess (response) {
      // alert(response.data.url)
      // 返回下载地址给后端存入数据库

      this.file.imageUrl = response.data.url
      // alert(response.data.url)
      // 将文件信息传给后端存入数据库
      // this.uploadFileInfo()

      this.loading = false
      // this.$message({
      //   type: 'success',
      //   message: '上传文件成功'
      // })

      // 跳转到list列表
      // this.$router.push({ path: '/subject/list' })
    },
    // 上传失败的方法
    fileUploadError () {
      this.loading = false
      this.$message({
        type: 'error',
        message: '上传文件失败'
      })
    },

    uploadFileInfo () {
      banner.uploadBanner(this.file)
        .then(response => {
          this.$message({
            type: 'success',
            message: '文件信息入库成功'
          })
        })
    },

    init () {
      // 修改时查询信息  根据url中是否有id值判断是否执行方法
      // route不加 r 表示所在当前页面的路由
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.showMessage(id)
      } else { // 否则表示添加操作，要先把页面信息消除
        // 如果不清空数据，当从修改页面跳转到添加页面时原数据会被保留
        this.file = {}
      }
    }

  }
}
</script>

<style scoped>
/* // 样式组件，调整上传图片按钮的高度，
// scoped表示该样式只在当前页面有效 */
.tinymce-container {
  line-height: 29px;
}
</style>
