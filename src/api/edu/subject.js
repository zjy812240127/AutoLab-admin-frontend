import request from '@/utils/request'

export default{

    getSubjectList(){  // 要填入传到后端的参数
       return request({
        url: `/eduservice/subject/listSubject`,
        method: 'get',  // 要和后端方法的请求方式一致
        
       })
    },


    


}
