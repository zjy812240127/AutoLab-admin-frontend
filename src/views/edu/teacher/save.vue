<template>
  <div class="app-container">
    讲师添加

    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="eduTeacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="eduTeacher.sort"
                         controls-position="right"
                         min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="eduTeacher.level"
                   clearable
                   placeholder="请选择">
          <!--
数据类型一定要和取出的json中的一致，否则没法回填
因此，这里value使用动态绑定的值，保证其数据类型是number
-->
          <el-option :value="1"
                     label="高级讲师" />
          <el-option :value="2"
                     label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="eduTeacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="eduTeacher.intro"
                  :rows="10"
                  type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO, todo表示要去实现的功能 -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="eduTeacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary"
                   icon="el-icon-upload"
                   @click="imagecropperShow=true">更换头像
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
import teacher from '@/api/edu/teacher'
// 引入上传文件的api组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  // 声明引入添加图像的组件
  components: { ImageCropper, PanThumb },
  data () {
    return {
      eduTeacher: {
        avatar: ''
      },
      // 上传弹框的组件是否显现：默认为false
      imagecropperShow: false,
      // 上传组件的key
      imagecropperKey: 0,
      BASE_API: process.env.BASE_API, // 接口API地址
      saveBtnDisabled: false // 保存按钮是否禁用
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
      this.eduTeacher.avatar = data.url
      // 每次关闭窗口初始化该值，可以防止出现不能重复上传图像的bug
      this.imagecropperKey = this.imagecropperKey + 1
    },

    // 显示修改操作时根据id查到的讲师信息
    showMessage (id) {
      teacher.getTeacherById(id)
        .then(response => {
          // 根据双向绑定，自动在html程序中填充数据，后端接口中注意要用data（）方法返回eduTeacher
          this.eduTeacher = response.data.eduTeacher
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
        this.eduTeacher = {}
      }
    },

    saveOrUpdate () { // 添加和修改都用同一个方法
      // 根据保存时是否有id值判断执行的是修改还是添加操作
      // 没有id值说明是添加操作
      // 有id值说明是修改操作，因为修改前要先查到id值的信息
      if (!this.eduTeacher.id) {
        // 添加
        this.saveTeacher()
      } else {
        // 修改
        this.modify()
      }
    },

    // 修改操作
    modify () {
      teacher.modifyTeacher(this.eduTeacher)
        .then(response => {
          // 修改成功信息提示
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 跳转到列表页
          this.$router.push({ path: '/teacher/table' })
        })
    },

    saveTeacher () { // 添加操作
      teacher.addTeacher(this.eduTeacher)
        .then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          })

          // 回到列表信息页  =======》 路由跳转（重定向）
          // path就是router中相应页面的redirect的值
          // router加r是指不同页面下，route指的是相同页面
          this.$router.push({ path: '/teacher/table' })
        })
        .catch(error => {
          console.log('添加失败')
        })
    }

  }
}
</script>
