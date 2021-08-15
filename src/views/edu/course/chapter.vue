<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2"
              process-status="wait"
              align-center
              style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList"
          :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text"
                       @click="openVideo(chapter.id)">添加小节</el-button>
            <el-button type="text"
                       @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text"
                       @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children"
              :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text"
                           @click="EditVideo(video.id)">修改</el-button>
                <el-button type="text"
                           @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 添加章节 -->
    <el-button type="text"
               @click="openChapterDialog">添加章节</el-button>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible"
               title="添加章节">
      <el-form :model="chapter"
               label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort"
                           :min="0"
                           controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible"
               title="添加课时">
      <el-form :model="video"
               label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort"
                           :min="0"
                           controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
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

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled"
                   type="primary"
                   @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled"
                   type="primary"
                   @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {
  data () {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList: [],
      courseId: '',
      dialogChapterFormVisible: false, // 默认添加章节的弹窗不显示
      chapter: {// 章节对象
        title: '',
        sort: 0
      },
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的章节id
      video: {// 课时对象
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        videoOriginalName: ''
      },
      fileList: [], // 上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址

    }
  },
  created () {
    //  获取url中传过来的课程id
    // route表示从当前页面获取数据，router表示从其他页面获取
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getCourse()
    }
  },
  methods: {

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
      // 上传视频id赋值
      this.video.videoSourceId = response.data.vodId
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name
    },
    // 视频上传多于一个时的提示
    handleUploadExceed () {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    // ========================小节操作=====================
    openVideo (chapterId) {
      this.dialogVideoFormVisible = true
      this.video.chapterId = chapterId
      this.video.courseId = this.courseId
    },

    // 修改video信息，先查询数据
    EditVideo (videoId) {
      video.findVideo(videoId)
        .then(response => {
          this.video = response.data.video
        })
      this.dialogVideoFormVisible = true
    },

    updateVideo () {
      video.updateVideo(this.video)
        .then(response => {
          // 关闭弹窗
          this.dialogVideoFormVisible = false
          // 提示消息
          this.$message({
            type: 'response',
            message: '修改小节成功'
          })
          // 刷新页面
          this.getCourse()
        })
    },

    removeVideo (videoId) {
      this.$confirm('此操作将永久删除小节信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 若确认删除，走后台  刷新列表
        // id由按钮中的scope.row.id传递
        video.deleteVideo(videoId)
          .then(response => {
            // 显示信息
            this.$message({
              type: 'response',
              message: '删除小节成功'
            })

            // 刷新页面
            this.getCourse()
          })
      })
    },

    addVideo () {
      video.addVideo(this.video)
        .then(response => {
          // 显示信息
          this.$message({
            type: 'response',
            message: '添加小节成功'
          })
          this.dialogVideoFormVisible = false
          // 清除数据
          this.video = {}
          // 刷新页面
          this.getCourse()
        })
    },

    // 保存要添加的video信息
    saveOrUpdateVideo () {
      if (!this.video.id) {
        this.addVideo()
      } else {
        this.updateVideo()
      }
    },

    // =========================章节操作==========================
    // 删除章节
    removeChapter (chapterId) {
      this.$confirm('此操作将永久删除章节信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 若确认删除，走后台  刷新列表
        // id由按钮中的scope.row.id传递
        chapter.deleteChapter(chapterId)
          .then(response => {
            // 显示信息
            this.$message({
              type: 'response',
              message: '删除章节成功'
            })

            // 刷新页面
            this.getCourse()
          })
      })
    },

    // 修改章节信息
    editChapter (chapterId) {
      console.log(chapterId)

      // 回显数据
      chapter.findChapter(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })

      console.log(this.chapter.title)
      this.dialogChapterFormVisible = true
    },

    openChapterDialog () {
      // 打开弹窗
      this.dialogChapterFormVisible = true
      // 表单数据清空
      this.chapter.title = ''
      this.chapter.sort = 0
    },

    // 添加chapter
    addChapter () {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response => {
          // 关闭弹窗
          this.dialogChapterFormVisible = false
          // 提示消息
          this.$message({
            type: 'response',
            message: '添加章节成功'
          })

          // 刷新页面
          this.getCourse()
        })
    },

    updateChapter () {
      chapter.updateChapter(this.chapter)
        .then(response => {
          // 关闭弹窗
          this.dialogChapterFormVisible = false
          // 提示消息
          this.$message({
            type: 'response',
            message: '修改章节成功'
          })
          // 刷新页面
          this.getCourse()
        })
    },

    // 点击保存按钮添加或者修改章节
    saveOrUpdate () {
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    },

    // 根据课程id获取章节与小节信息
    getCourse () {
      chapter.getChapterListById(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.list
        })
    },

    previous () {
      console.log('previous')
      // this.$router.push({ path: '/course/info/'+ this.courseId })
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    next () {
      console.log('next')
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }
}
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
