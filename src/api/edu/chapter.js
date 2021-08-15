import request from '@/utils/request'

export default{

 

    getChapterList(){  // 要填入传到后端的参数
        return request({
         url: `/eduservice/chapter/findChapter`,
         method: 'get',  // 要和后端方法的请求方式一致
         
        })
     },

     getChapterListById(courseId){
        return request({
            url: `/eduservice/chapter/findChapterById/`+courseId,
            method: 'get',  // 要和后端方法的请求方式一致
            
           })
     },

    //  添加章节
     addChapter(eduChapter){
        return request({
            url: `/eduservice/chapter/addChapter/`,
            method: 'post',  // 要和后端方法的请求方式一致
            data: eduChapter
           })
     },

    //  根据id插叙章节
     findChapter(chapterId){
        return request({
            url: `/eduservice/chapter/findById/${chapterId}`,
            method: 'get',  // 要和后端方法的请求方式一致
           })
     },

     //  修改章节
     updateChapter(eduChapter){
        return request({
            url: `/eduservice/chapter/updateChapter/`,
            method: 'post',  // 要和后端方法的请求方式一致
            data: eduChapter
           })
     },

      //  删除章节
      deleteChapter(id){
        return request({
            url: `/eduservice/chapter/deleteChapter/${id}`,
            method: 'delete',  // 要和后端方法的请求方式一致        
           })
     },

 


}