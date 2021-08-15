<template>
  <div class="app-container">
    讲师添加

    <el-form label-width="120px">
      <el-form-item label="活动标题">
        <el-input v-model="activity.title" />
      </el-form-item>
      <!-- <el-form-item label="讲师排序">
        <el-input-number v-model="eduTeacher.sort"
                         controls-position="right"
                         min="0" />
      </el-form-item> -->
      <!-- <el-form-item label="讲师头衔">
        <el-select v-model="eduTeacher.level"
                   clearable
                   placeholder="请选择"> -->
      <!--
数据类型一定要和取出的json中的一致，否则没法回填
因此，这里value使用动态绑定的值，保证其数据类型是number
-->
      <!-- <el-option :value="1"
                     label="高级讲师" />
          <el-option :value="2"
                     label="首席讲师" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="活动简介">
        <el-input v-model="activity.description" />
      </el-form-item> -->
      <el-form-item label="活动简介">
        <el-input v-model="activity.description"
                  :rows="10"
                  type="textarea" />
      </el-form-item>

      <el-form-item label="上传视频">
        <el-upload :on-success="handleVodUploadSuccess"
                   :on-remove="handleVodRemove"
                   :before-remove="beforeVodRemove"
                   :on-exceed="handleUploadExceed"
                   :file-list="fileList"
                   :action="BASE_API+'/eduvod/video/uploadVideo'"
                   :limit="1"
                   class="upload-demo">
          <el-button size="small"
                     type="primary">上传视频</el-button>
          <el-tooltip placement="right-end">
            <div slot="content">最大支持1G，<br>
              支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
              GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
              MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
              SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
            <i class="el-icon-question" />
          </el-tooltip>
        </el-upload>
      </el-form-item>

      <!-- 讲师头像：TODO, todo表示要去实现的功能 -->
      <!-- 讲师头像 -->
      <el-form-item label="活动封面">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="activity.photoUrl" />
        <!-- 文件上传按钮 -->
        <el-button type="primary"
                   icon="el-icon-upload"
                   @click="imagecropperShow=true">更换封面
        </el-button>

        <!--
v-show：是否显示上传组件
:key：类似于id，如果一个页面多个图片上传控件，可以做区分
:url：后台上传的url地址
@close：关闭上传组件
@crop-upload-success：上传成功后的回调 -->
        <image-cropper v-show="imagecropperShow"
                       :width="300"
                       :height="300"
                       :key="imagecropperKey"
                       :url="BASE_API+'/eduoss/fileoss'"
                       field="file"
                       @close="close"
                       @crop-upload-success="cropSuccess" />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled"
                   type="primary"
                   @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
// 引入api中的接口文件
// import teacher from '@/api/edu/teacher'
// 引入上传文件的api组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import activity from '@/api/edu/activity'
import video from '@/api/edu/video'

export default {
  // 声明引入添加图像的组件
  components: { ImageCropper, PanThumb },
  data () {
    return {
      activity: {
        videoUrl: ''
      },
      // 上传弹框的组件是否显现：默认为false
      imagecropperShow: false,
      // 上传组件的key
      imagecropperKey: 0,
      BASE_API: process.env.BASE_API, // 接口API地址
      saveBtnDisabled: false, // 保存按钮是否禁用
      video: {// 课时对象
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        videoOriginalName: ''
      },
      fileList: [] // 上传文件列表
    }
  },
  watch: { // 路由监听，每当路由发生改变时就会执行该方法
    $route (to, from) {
      this.init()
    }
  },
  created () {
    // 这里定义的是页面加载初始化时执行的方法，因此不要调用按钮事件
    this.init()
  },
  methods: {
    close () { // 关闭上传弹框的方法
      this.imagecropperShow = false
      // 每次关闭窗口初始化该值，可以防止出现不能重复上传图像的bug
      this.imagecropperKey = this.imagecropperKey + 1
    },
    cropSuccess (data) { // 头像上传成功的方法
      this.imagecropperShow = false // 上传成功后也要关闭窗口
      // 上传成功后接口返回图片的地址，
      this.activity.photoUrl = data.url
      // 每次关闭窗口初始化该值，可以防止出现不能重复上传图像的bug
      this.imagecropperKey = this.imagecropperKey + 1
    },

    // 确认删除的时候调用
    handleVodRemove () {
      video.deleteAliVideo(this.video.videoSourceId)
        .then(response => {
          this.$message({
            type: 'response',
            message: '删除视频成功'
          })
          // 将文件列表亲清空
          this.fileList = []
          // 将视频的id和名称清空，防止存入数据库
          // 上传视频id赋值
          this.video.videoSourceId = ''
          // 上传视频名称赋值
          this.video.videoOriginalName = ''
        })
    },

    // 点击×的时候调用弹出提示框
    beforeVodRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    // 视频上传成功的回调函数
    handleVodUploadSuccess (response, file, fileList) {
      this.activity.videoUrl = response.data.vodId
      // 上传视频id赋值
      this.video.videoSourceId = response.data.vodId
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name
    },
    // 视频上传多于一个时的提示
    handleUploadExceed () {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    // 显示修改操作时根据id查到的讲师信息
    showMessage (id) {
      activity.getById(id)
        .then(response => {
          // 根据双向绑定，自动在html程序中填充数据，后端接口中注意要用data（）方法返回eduTeacher
          this.activity = response.data.data.activity
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
        this.activity = {}
      }
    },

    saveOrUpdate () { // 添加和修改都用同一个方法
      // 根据保存时是否有id值判断执行的是修改还是添加操作
      // 没有id值说明是添加操作
      // 有id值说明是修改操作，因为修改前要先查到id值的信息
      if (!this.activity.id) {
        // 添加
        this.saveActivity()
      } else {
        // 修改
        this.modify()
      }
    },

    // 修改操作
    modify () {
      activity.updateActivityById(this.activity)
        .then(response => {
          // 修改成功信息提示
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 跳转到列表页
          this.$router.push({ path: '/activity/list' })
        })
    },

    saveActivity () { // 添加操作
      activity.uploadActivity(this.activity)
        .then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          })

          // 回到列表信息页  =======》 路由跳转（重定向）
          // path就是router中相应页面的redirect的值
          // router加r是指不同页面下，route指的是相同页面
          this.$router.push({ path: '/activity/list' })
        })
        .catch(error => {
          console.log('添加失败')
        })
    }

  }
}
</script>
