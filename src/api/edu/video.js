import request from '@/utils/request'

export default{

    //  查询小节
    findVideo(id){
        return request({
            url: `/eduservice/video/findVideo/${id}`,
            method: 'get',  // 要和后端方法的请求方式一致
            
           })
     },


    //  添加小节
     addVideo(eduVideo){
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',  // 要和后端方法的请求方式一致
            data: eduVideo
           })
     },

 

     //  修改小节
     updateVideo(eduVideo){
        return request({
            url: `/eduservice/video/updateVideo/`,
            method: 'post',  // 要和后端方法的请求方式一致
            data: eduVideo
           })
     },

      //  删除小节
      deleteVideo(id){
        return request({
            url: `/eduservice/video/deleteVideo/${id}`,
            method: 'delete',  // 要和后端方法的请求方式一致        
           })
     },

     //  删除视频
     deleteAliVideo(id){
        return request({
            url: `/eduvod/video/removeById/${id}`,
            method: 'delete',  // 要和后端方法的请求方式一致        
           })
     },



 


}