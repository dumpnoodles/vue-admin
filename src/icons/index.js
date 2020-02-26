import Vue from "vue";

import SvgIcon from "./SvgIcon";

Vue.component('svg-icon', SvgIcon);

/**
 * require.context: 读取指定目录的所有文件
 * 第一个参数： 目录
 * 第二个参数： 是否遍历子集目录
 * 第三个参数： 定义遍历文件规则（正则黎明表示结尾， 读取结尾为.svg的文件）
 */ 

 // ES6写法
const req = require.context('./svg', false, /\.svg$/)

const requireAll = requireContext => {
  // console.log(requireContext.keys().map(requireContext))
  return requireContext.keys().map(requireContext)
}
requireAll(req)

// ES5写法
// const requireAll = function(requireContext) {
//   return requireContext.keys().map(requireContext)
// }
