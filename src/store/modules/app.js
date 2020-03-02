import { Login } from "@/api/login";
import { setToKen, removeToKen, removeUserName, setUserName, getUserName } from "@/utils/app";
const state = {
  isCollapse: false || JSON.parse(sessionStorage.getItem('isCollapse')),
  to_ken: '',
  username: getUserName() || ''
  // count: 10
}

const getters = { // computed
  // count: state => state.count + 10
  isCollapse: state => state.isCollapse,
}

const mutations = { // 必须的 同步 不需要回调处理事情
  SET_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    // html5本地存储
    sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
  },
  // SET_COUNT(state, value){
  //   state.count = value
  //   console.log(state.count)
  // }
  SET_TOKEN(state, value){
    state.to_ken = value
  },
  SET_USERNAME(state, value){
    state.username = value
  }
}

const actions = { // 可以回调处理事情
  login({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      // 接口
      Login(requestData).then((response) => {
        // console.log(response)
        let data =  response.data.data
        // console.log(content)
        // 普通的
        // content.commit('SET_TOKEN', data.toKen);
        // content.commit('SET_USERNAME', data.username);
        // 解构的
        commit('SET_TOKEN', data.token);
        commit('SET_USERNAME', data.username);
        setToKen(data.token);
        setUserName(data.username);
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  exit({ commit }) {
    return new Promise((resolve, reject) => {
      removeToKen();
      removeUserName();
      commit('SET_TOKEN', '');
      commit('SET_USERNAME', '');
      resolve();
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