// import $ from 'jquery'

const apiStatusDeal = function (page, data) {
    // console.log(JSON.stringify(data))
    switch (data.status) {
        case 0:
            return true
        case -1:
            alert('错误: ' + data.message)
            return false
        case -2:
            alert('错误: ' + data.message)
            page.$router.push({path: '/index/'})
            return false
        default:
            alert('error: error return status')
            return false
    }
}

export default {
    apiStatusDeal: apiStatusDeal,
}