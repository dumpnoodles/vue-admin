const state = {
  isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
  // count: 10
}

const getters = { // computed
  // count: state => state.count + 10
}

const mutations = { // 必须的 同步 不需要回调处理事情
  SET_COLLAPSE(state) {
    // console.log('login');
    state.isCollapse = !state.isCollapse;
    // html5本地存储
    sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
  },
  // SET_COUNT(state, value){
  //   state.count = value
  //   console.log(state.count)
  // }
}

const actions = { // 可以回调处理事情
  login(content, requestData) {
    return new Promise((resolve, reject) => {
      // 接口
      Login(requestData).then((response) => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
  // setMenuStatus(content, data) {
  // 异步， 请求接口返回数据后， 接着去做别的事情
  /**
   * 接口A， 接口B
   * B接口需要A接口的参数
   */
  // console.log(content)
  // content.commit('SET_COLLAPSE')
  // setMenuStatus({ state, getters, commit, rootGetters, rootState }, data) {
  // content.state
  // content.getters
  // content.commit
  // content.rootGetters
  // content.rootState
  // console.log(data)
  // console.log(1111)
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
