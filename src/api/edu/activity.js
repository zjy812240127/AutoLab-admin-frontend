import request from '@/utils/request'

export default {

    // 分页条件查询
    getActivityList(current, limit, activity) {
        return request({
            url: `/eduservice/activity/getByConditions/${current}/${limit}`,
            method: 'post', // 要和后端方法的请求方式一致
            data: activity
        })
    },

    // 修改操作时根据id查询活动信息
    getById(id) {
        return request({
            url: `/eduservice/activity/selectById/${id}`,
            method: 'get' // 要和后端方法的请求方式一致
        })
    },

    uploadActivity(activity) { // 要填入传到后端的参数
        return request({
            url: `/eduservice/activity/addActivity`,
            method: 'post', // 要和后端方法的请求方式一致
            data: activity
        })
    },

    updateActivityById(activity) { // 要填入传到后端的参数
        return request({
            url: `/eduservice/activity/alterActivity`,
            method: 'post', // 要和后端方法的请求方式一致
            data: activity
        })
    },

    deleteById(id) {
        return request({
            url: `/eduservice/activity/deleteActivity/${id}`,
            method: 'delete' // 要和后端方法的请求方式一致
        })
    }

}