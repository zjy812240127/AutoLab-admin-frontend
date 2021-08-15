<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1"
              process-status="wait"
              align-center
              style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title"
                  placeholder=" 示例：机器学习项目课：从基础到搭建项目视视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 一级分类下拉列表 -->
      <el-form-item label="课程一级分类">
        <el-select v-model="courseInfo.subjectParentId"
                   placeholder="请选择"
                   @change="findSecondSubject">
          <el-option v-for="subject in subjectList"
                     :key="subject.id"
                     :label="subject.title"
                     :value="subject.id" />
        </el-select>

        <el-select v-model="courseInfo.subjectId"
                   placeholder="二级分类">
          <el-option v-for="childSubject in childSubjectList"
                     :key="childSubject.id"
                     :label="childSubject.title"
                     :value="childSubject.id" />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId"
                   placeholder="请选择">
          <el-option v-for="teacher in teacherList"
                     :key="teacher.id"
                     :label="teacher.name"
                     :value="teacher.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0"
                         v-model="courseInfo.lessonNum"
                         controls-position="right"
                         placeholder=" 请填写课程的总课时数" />
      </el-form-item>
      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300"
                 v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload :show-file-list="false"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload"
                   :action="BASE_API+'/eduoss/fileoss'"
                   class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0"
                         v-model="courseInfo.price"
                         controls-position="right"
                         placeholder=" 课程价格" />
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled"
                   type="primary"
                   @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce' // 引入富文本编辑器组件

export default {
  components: { Tinymce }, // 第三方组件必须声明后才能使用
  data () {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/01.jpg',
        price: 0
      },
      teacherList: [],
      subjectList: [],
      childSubjectList: [],
      BASE_API: process.env.BASE_API, // 接口API地址
      courseId: ''

    }
  },
  created () {
    // 获取课程id,如果有id表明是后面的页面返回的，加载课程信息
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.findCourseById()
      // 查询所有的一级分类，并选出目前被默认选中的一级分类
      subject.getSubjectList()
        .then(response => {
          this.subjectList = response.data.list
          for (var i = 0; i < this.subjectList.length; i++) {
            // 当前页面选中的一级分类
            var oneSubject = this.subjectList[i]
            if (this.courseInfo.subjectParentId === oneSubject.id) {
              this.childSubjectList = oneSubject.children
            }
          }
        })
      this.findTeacher()
    } else {
      // 如果没有id表明是第一次访问该页面，没有课程信息，要去后端查询
      this.findTeacher(),
        this.findSubject()
    }
  },
  methods: {

    // findCourse
    findCourseById () {
      course.findCourseById(this.courseId)
        .then(response => {
          this.courseInfo = response.data.course
        })
    },

    // 上传完图片之后
    handleAvatarSuccess (res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data.url
    },

    // 上传封面之前规定图片格式
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 查询所有subjectList
    findSubject () {
      subject.getSubjectList()
        .then(response => {
          this.subjectList = response.data.list
        })
    },

    // 根据选择的一级分类查询二级分类
    findSecondSubject (value) {
      // value就是一级分类的id值（）下拉框中才能用，选中的下拉值的id
      // 遍历每一个一级分类，id值相同则获取该一级分类的children属性
      for (var i = 0; i < this.subjectList.length; i++) {
        // ===表示数据字面值和类型都必须一致
        if (value === this.subjectList[i].id) {
          this.childSubjectList = this.subjectList[i].children
          // 每次重新点击一级分类时清空二级分类
          this.courseInfo.subjectId = ''
        }
      }
    },

    // 查询所有讲师信息
    findTeacher () {
      teacher.findTeacher()
        .then(response => {
          this.teacherList = response.data.items
        })
    },

    addCourse () {
      // 这里的路径从course文件路径开始
      course.addCourse(this.courseInfo)
        .then(response => {
          // 添加成功显示信息
          this.$message({
            type: 'response',
            message: '添加课程信息成功'
          })

          // 跳转到下一页
          this.$router.push({ path: '/course/chapter/' + response.data.id })
        })
    },

    update () { // 修改课程
      course.updateCourse(this.courseInfo)
        .then(response => {
          // 显示信息
          this.$message({
            type: 'response',
            message: '修改课程信息成功'
          })

          // 跳转到下一页
          this.$router.push({ path: '/course/chapter/' + this.courseId })
        })
    },

    saveOrUpdate () { // 执行页面跳转
      if (!this.courseInfo.id) {
        //  如果没有id值表示第一次添加，id会自动生成
        this.addCourse()
      } else {
        //    如果有id表明是对原有数据的修改
        this.update()
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
