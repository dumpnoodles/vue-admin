<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script>
import { ref, reactive, computed,onMounted } from "@vue/composition-api";
export default {
  name: "svgIcon",
  // props: ['iconClass', 'className'],
  props: {
    iconClass: {
      type: String,  //定义接受的值类型
      default: '' // 基础数据类型
      // defalut: () => [], //对象数据类型 ES6写法
      // default: function() {  // ES5写法
      //   return []
      // }
      // required: true,
      // validator: (value) => {
      //   return value >= 0
      // }
    },
    className: {
      type: String, 
      default: ''
    }
  },
  setup(props) {
    // console.log(props.iconClass)
    // console.log(props.className)
    /**
     * computed 监听属性变化，并计算属性
     */
    // 计算属性，得出最终结果，并返回
    const iconName = computed(() => `#icon-${props.iconClass}`)
    const svgClass = computed(() => { 
      if(props.className) {
        return `svg-icon ${props.className}`
      }else {
        return `svg-icon`
      }
    })

    return {
      iconName,
      svgClass
    }
  }
}
</script>
<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
