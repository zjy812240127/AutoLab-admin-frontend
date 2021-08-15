import request from '@/utils/request'

export default{

   // 获取所有课程list
   getCourseList(current,limit,courseQuery){
      return request({
         url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
         method: 'post',  // 要和后端方法的请求方式一致
         data: courseQuery
        })
   },

    addCourse(courseInfo){  // 添加课程
       return request({
        url: `/eduservice/course/addCourse`,
        method: 'post',  // 要和后端方法的请求方式一致
        data: courseInfo
       })
    },

    getChapterList(){  // 要填入传到后端的参数
        return request({
         url: `/eduservice/chapter/findChapter`,
         method: 'get',  // 要和后端方法的请求方式一致
         
        })
     },

     findCourseById(id){  // 根据id查询课程信息
         return request({
            url: `/eduservice/course/findById/${id}`,
            method: 'get',  // 要和后端方法的请求方式一致
        })

     },

     updateCourse(courseVo){  // 更新课程信息
      return request({
         url: `/eduservice/course/updateCourse`,
         method: 'post',  // 要和后端方法的请求方式一致
         data: courseVo
     })

  },

  getPublishInfo(id){  // 获取要发布的课程的信息
   return request({
      url: `/eduservice/course/getCoursePublishInfo/${id}`,
      method: 'get',  // 要和后端方法的请求方式一致
     
  })

},

publish(id){  // 发布课程
   return request({
      url: `/eduservice/course/publish/${id}`,
      method: 'post',  // 要和后端方法的请求方式一致
     
  })

},

deleteById(id){  // 删除课程
   return request({
      url: `/eduservice/course/deleteById/${id}`,
      method: 'post',  // 要和后端方法的请求方式一致
     
  })

},


}
