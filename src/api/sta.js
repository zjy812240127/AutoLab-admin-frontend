import request from '@/utils/request'
const api_name = '/staservice/statisticsdaily/'
export default {
    createStatistics(day) {
        return request({
            url: `${api_name}/countRegisterNum/${day}`,
            method: 'get'
        })
    },
    showChart(searchObj) {
        return request({
            url: `${api_name}/showChart/${searchObj.begin}/${searchObj.end}/${searchObj.type}`,
            method: 'get'
        })
    }
}