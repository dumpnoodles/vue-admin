<template>
  <el-select v-model="data.selectValue" @change="select" placeholder="请选择">
    <el-option v-for="item in data.initOption" :key="item.value" :value="item.value" :label="item.label"></el-option>
  </el-select>
</template>
<script>
import { reactive, onMounted } from "@vue/composition-api";
export default {
  name: "",
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    selectData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }){
    const data = reactive({
      selectValue: "",
      initOption: [],
      option: [
          {value: "name", label: "姓名"},
          {value: "phone", label: "手机"},
          {value: "email", label: "邮箱"},
          {value: "title", label: "标题"},
          {value: "id", label: "ID"}
        ]
    })

    const initOption = () => {
      let initData = props.config.init;
      let optionArr = [];
      if(initData.length === 0) {
        console.log("config的参数是空的，无法显示下拉菜单;");
        return false;
      }
      initData.forEach(item => {
        let arr = data.option.filter(elem => elem.value == item);
        if(arr.length > 0){
          optionArr.push(arr[0]);
        }
      })
      if(initData.length === 0 ){
        console.log("匹配的数据为空！")
        return false;
      }
      data.initOption = optionArr;
      data.selectValue = optionArr[0].value;
      emit("update:selectData", optionArr[0]);
    }

    const select = (val) => {
      let filterData = data.option.filter(item => item.value == val)[0];
      emit("update:selectData", filterData);
    }

    onMounted(() => {
      initOption();
    })
    return {
      // reactive
      data, select
    }
  }
}
</script>
<style lang="scss" scoped>

</style>