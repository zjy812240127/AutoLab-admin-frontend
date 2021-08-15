import request from '@/utils/request'

export default {

    uploadBanner(banner) { // 要填入传到后端的参数
        return request({
            url: `/educms/banner/addBanner`,
            method: 'post', // 要和后端方法的请求方式一致
            data: banner
        })
    },

    updateBannerById(banner) { // 要填入传到后端的参数
        return request({
            url: `/educms/banner/updateBanner`,
            method: 'put', // 要和后端方法的请求方式一致
            data: banner
        })
    },

    getBannerList(current, limit, banner) {
        return request({
            url: `/educms/banner/getBannerPage/${current}/${limit}`,
            method: 'get', // 要和后端方法的请求方式一致
            data: banner
        })
    },

    deleteById(id) {
        return request({
            url: `/educms/banner/removeBanner/${id}`,
            method: 'delete' // 要和后端方法的请求方式一致

        })
    }

}