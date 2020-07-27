<template>
  <el-dialog
    title="新增"
    :visible.sync="dialog_info_flag"
    width="576px"
    @open="openDialog"
    @close="close"
  >
    <el-form :model="form" ref="addInfoForm">
      <el-form-item label="类型：" :label-width="formLabelWidth" prop="category">
        <el-select v-model="form.category" placeholder="请选择类型">
          <el-option
            v-for="item in categoryOption.item"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="formLabelWidth" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="formLabelWidth" prop="content">
        <el-input type="textarea" v-model="form.content" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" :loading="submitLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AddInfo } from "@/api/news";
import { ref, reactive, watch } from "@vue/composition-api";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { root, emit, refs }) {
    /**
     * 声明数据
     */

    // ref
    const dialog_info_flag = ref(false);
    const formLabelWidth = ref("58px");
    const dialogFormVisible = ref(false);
    const submitLoading = ref(false);

    // reactive
    const form = reactive({
      category: "",
      title: "",
      content: ""
    });
    const categoryOption = reactive({
      item: []
    });
    // watch
    watch(() => {
      dialog_info_flag.value = props.flag;
    });

    /**
     * 声明函数
     */
    const close = () => {
      dialog_info_flag.value = false;
      resetForm();
      emit("update:flag", false);
    };
    const resetForm = () => {
      refs.addInfoForm.resetFields();
    };
    const openDialog = () => {
      categoryOption.item = props.category;
    };
    const submit = () => {
      let requestData = {
        category: form.category,
        title: form.title,
        content: form.content
      };
      if (!form.category) {
        root.$message({
          message: "分类不能为空！！",
          type: "error"
        });
        return false;
      }
      if (!form.title) {
        root.$message({
          message: "标题不能为空！！",
          type: "error"
        });
        return false;
      }
      if (!form.content) {
        root.$message({
          message: "内容不能为空！！",
          type: "error"
        });
        return false;
      }
      submitLoading.value = true;
      AddInfo(requestData).then(response => {
        let data = response.data;
        root.$message({
          message: data.message,
          type: "success"
        });
        submitLoading.value = false;
        emit("getListInfo")
        resetForm();
      })
      .catch(error => {
        submitLoading.value = false;
      });
    };

    return {
      /* ref */
      dialog_info_flag, formLabelWidth, dialogFormVisible,
      categoryOption,
      submitLoading,
      /* reactive */
      form,
      /* methods */
      close, openDialog, submit, resetForm
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
