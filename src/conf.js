const dev = 'http://10.0.1.37:8000'

const url = {
    v1: {
        paper: {
            detail: function (id){
                return {path: dev + "/paper/detail/" + id + "/", method: "get"}
            },
            save: function (id){
                return {path: dev + "/paper/save/" + id + "/", method: "put"}
            }
        }
    }
}

export default {
    url: url,
    dev: dev
}