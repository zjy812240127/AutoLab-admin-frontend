<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
import subject from '@/api/edu/subject'

export default {

  data() {
    return {
      filterText: '',
      data2:[],
    //   data2: [

    //     {
    //     id: 1,
    //     label: '一级分类1',

    //     children: [
    //         {
    //       id: 4,
    //       label: '二级分类1-1',  
    //     },

    //     {
    //       id: 9,
    //       label: '二级分类1-2',  
    //     },

    //     ]
    //   }, 
      

    //   {
    //     id: 2,
    //     label: '一级分类2',
    //     children: [
    //         {
    //       id: 5,
    //       label: '二级分类2-1'
    //     }, {
    //       id: 6,
    //       label: '二级分类2-2'
    //     }
    //     ]
    //   }, 
      
    //   {
    //     id: 3,
    //     label: '一级分类3',
    //     children: [
    //         {
    //       id: 7,
    //       label: '二级分类3-1'
    //     }, 
    //     {
    //       id: 8,
    //       label: '二级分类3-2'
    //     }
    //     ]
    //   }],


      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created(){
      this.getList()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {

    getList(){
        subject.getSubjectList()
        .then(response => {
            this.data2 = response.data.list
        })
    },
      
    //  关键字搜索功能
    filterNode(value, data) {
      if (!value) return true
    //   统一转化成大写或者小写进行比较， 忽略大小写
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>

