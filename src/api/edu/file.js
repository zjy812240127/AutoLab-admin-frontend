import request from '@/utils/request'

export default {

    uploadFile(file) { // 要填入传到后端的参数
        return request({
            url: `/fileservice/file/saveDB`,
            method: 'post', // 要和后端方法的请求方式一致
            data: file
        })
    },

    getList(current, limit) {
        return request({
            url: `/fileservice/file/${current}/${limit}`,
            method: 'get' // 要和后端方法的请求方式一致
        })
    },

    getFileListPage(current, limit, fileQuery) { // 要填入传到后端的参数
        return request({
            url: `/fileservice/file/findFileList/${current}/${limit}`,
            method: 'post', // 要和后端方法的请求方式一致
            data: fileQuery
        })
    },

    deleteFileById(id) { // 要填入传到后端的参数
        return request({
            url: `/fileservice/file/deleteFile/${id}`,
            method: 'post' // 要和后端方法的请求方式一致
        })
    },

    updateFileById(file) { // 要填入传到后端的参数
        return request({
            url: `/fileservice/file/updateFile`,
            method: 'post', // 要和后端方法的请求方式一致
            data: file
        })
    },

    getFileById(id) { // 更新信息时先根据id查询文件内容
        return request({
            url: `/fileservice/file/selectFileById/${id}`,
            method: 'get' // 要和后端方法的请求方式一致

        })
    }

}