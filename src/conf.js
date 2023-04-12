const dev = 'http://10.0.1.37:8000'

const url = {
    v1: {
        paper: {
            user: function () {
                return {path: dev + "/paper/user/", method: "post"}
            },
            detail: function (id) {
                return {path: dev + "/paper/detail/" + id + "/", method: "get"}
            },
            save: function () {
                return {path: dev + "/paper/save/", method: "put"}
            }
        }
    }
}

export default {
    url: url,
    dev: dev
}