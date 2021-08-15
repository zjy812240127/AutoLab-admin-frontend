import request from '@/utils/request'

export default {
    getTeacherListPage(current, limit, teacherQuery) { // 要填入传到后端的参数
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post', // 要和后端方法的请求方式一致
            data: teacherQuery // 如果后端方法定义时采用注解@RequestBody就要用data
        })
    },

    // 删除讲师
    deleteTeacherById(id) { // 要填入传到后端的参数
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete' // 要和后端方法的请求方式一致

        })
    },

    // 添加讲师
    addTeacher(eduTeacher) {
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post', // 要和后端方法的请求方式一致
            data: eduTeacher // 如果后端方法定义时采用注解@RequestBody就要用data
        })
    },

    // 根据id查询讲师信息
    getTeacherById(id) {
        return request({
            url: `/eduservice/teacher/getById/${id}`,
            method: 'get' // 要和后端方法的请求方式一致

        })
    },

    // 修改讲师信息
    modifyTeacher(eduTeacher) {
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post', // 要和后端方法的请求方式一致
            data: eduTeacher // 如果后端方法定义时采用注解@RequestBody就要用data

        })
    },

    // 获取所有讲师
    findTeacher() {
        return request({
            url: `/eduservice/teacher/findAll`,
            method: 'get' // 要和后端方法的请求方式一致

        })
    }

}