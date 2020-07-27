import { GetCategory } from "@/api/news";
const state = {
    qiniuUrl: "http://qiniu.dumpnoodles.cn/"
}
const getters = {
    qiniuUrl: state => state.qiniuUrl
}
const actions = {
    getInfoCategory(content, repuestData) {
        return new Promise((resolve, reject) => {
            GetCategory({}).then((response) => {
                resolve(response.data.data.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions
};
