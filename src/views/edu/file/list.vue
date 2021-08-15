<template>
  <div class="app-container">
    文件列表

    <!--查询表单-->
    <el-form :inline="true"
             class="demo-form-inline">
      <el-form-item>
        <el-input v-model="fileQuery.title"
                  placeholder="文件标题" />
      </el-form-item>
      <!-- <el-form-item>
        <el-select v-model="fileQuery.level"
                   clearable
                   placeholder="讲师头衔">
          <el-option :value="1"
                     label="高级讲师" />
          <el-option :value="2"
                     label="首席讲师" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="添加时间">
        <el-date-picker v-model="fileQuery.begin"
                        type="datetime"
                        placeholder="选择开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="00:00:00" />
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="fileQuery.end"
                        type="datetime"
                        placeholder="选择截止时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="00:00:00" />
      </el-form-item>
      <el-button type="primary"
                 icon="el-icon-search"
                 @click="getList()">查 询</el-button>
      <el-button type="default"
                 @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="rows"
              border
              fit
              highlight-current-row>

      <el-table-column label="序号"
                       width="70"
                       align="center">
        <template slot-scope="scope">
          <!-- current，limit是后端的参数 -->
          {{ (current - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title"
                       label="标题"
                       width="160" />

      <el-table-column prop="description"
                       label="简介"
                       width="200" />
      <!-- <el-table-column label="头衔"
                       width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>

      </el-table-column> -->

      <el-table-column prop="fileUrl"
                       label="下载地址" />

      <el-table-column prop="gmtCreate"
                       label="添加时间"
                       width="160" />

      <!-- <el-table-column prop="sort"
                       label="排序"
                       width="60" /> -->

      <el-table-column label="操作"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <!-- html里面的路由跳转实现 -->
          <router-link :to="'/file/info/'+scope.row.id">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger"
                     size="mini"
                     icon="el-icon-delete"
                     @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 传入参数current/limit/total @绑定事件 getList(默认会传入current参数) -->
    <el-pagination :current-page="current"
                   :page-size="limit"
                   :total="total"
                   style="padding: 30px 0; text-align: center;"
                   layout="total, prev, pager, next, jumper"
                   @current-change="getList" />

  </div>
</template>

<script>
// 引入api中的接口文件
import file from '@/api/edu/file'

export default {
  // 核心代码编写处（axios）
  data () { // 定义后端请求所需以及返回的变量以及初始值
    return {
      current: 1, // 当前页
      limit: 3, // 每页的记录数
      total: 0, // 查到的总记录数
      rows: null, // 查到的讲师列表
      fileQuery: {} // 传到后端方法的封装对象
    }
  },
  created () { // 调用methods中的方法
    this.getList()
  },
  methods: { // axios方法

    // 定义一个方法调用api中的接口方法定位到要访问的后端方法
    getList (current = 1) {
      this.current = current // 为了分页插件中点击页面后会进行相应的传递，分页插件会传入每次的current参数
      file.getList(this.current, this.limit).then(response => {
        console.log(response)
        this.rows = response.data.fileList
        this.total = response.data.total
        console.log(this.rows)
        console.log(this.total)
      })

      // file.getFileListPage(this.current, this.limit, this.fileQuery)
      //   .then(response => {
      //     console.log(response)
      //     this.rows = response.data.fileList
      //     this.total = response.data.total
      //     console.log(this.rows)
      //     console.log(this.total)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },
    resetData () { // 清空条件查询
      // 表单输入项清空
      this.fileQuery = {} // 因为是双向绑定，所以此处对象为空，表单中也会为空
      // 查询所有讲师数据
      this.getList()
    },
    removeDataById (id) { // 删除按钮，这里的id不能少，不然以下程序找不到id
      // 弹框确认是否删除
      alert(id)
      this.$confirm('此操作将永久删除文件信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 若确认删除，走后台  刷新列表
        // id由按钮中的scope.row.id传递
        file.deleteFileById(id)
          .then(response => {
            // 显示信息
            this.$message({
              type: 'success',
              message: '数据库记录删除成功!源文件保存在阿里云中'
            })
            // 刷新列表
            this.getList()
          })
      })
      // 统一不写.catch（）方法，因为有可能会报错
    }

  }

}
</script>
