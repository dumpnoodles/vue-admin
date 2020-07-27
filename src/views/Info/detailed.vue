<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="信息分类:">
      <el-select v-model="form.categoryId" placeholder="请选择" style="width: 15%;">
        <el-option v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
                >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 新闻标题 -->
    <el-form-item label="新闻标题:" >
      <el-input v-model="form.title" style="width: 35%;"></el-input>
    </el-form-item>
    <!-- 缩略图 -->
    <el-form-item label="缩略图:">
      <UploadImg :imgUrl.sync="form.imgUrl" :config="uploadImgConfig" />
    </el-form-item>
    <!-- 发布日期 -->
    <el-form-item label="发布日期:">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.createDate" style="width: 23%;" disabled></el-date-picker>
    </el-form-item>
    <!-- 详细内容 -->
    <el-form-item label="详细内容:">
      <!-- 富文本编辑器 -->
      <quillEditor v-model="form.content" ref="myQuillEditor" :options="options.editorOption" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="submitLoading" @click="submit" >保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { ref, reactive, watch, onMounted } from "@vue/composition-api";
import { GetList, EditInfo } from "@/api/news";
import { common, QiniuToken } from "@/api/common";
// 引入组件
import UploadImg from "@c/UploadImg";
import { timestampToTime } from "@/utils/common";
// 富文本编辑器
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: "infoDetailed",
  components: { quillEditor, UploadImg },
  setup(props, { root, emit }) {
    const { getInfoCategory, categoryItem } = common();

    // reactive

    //图片上传配置
    const uploadImgConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accessKey: "xxxxxxxxx", // 七牛云 AK
      secretKey: "xxxxxxxxx", // 七牛云 SK
      buckety: "dumpnoodles"
    });
    const options = reactive({
      category: [],
      id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
      editorOption: {},
      uploadKey: {
        token: "",
        key: ""
      }
    });
    const submitLoading = ref(false);
    const form = reactive({
      categoryId: "",
      title: '',
      createDate: '',
      content: '',
      imgUrl: ''
    })

    // method
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: options.id
      };
      GetList(requestData).then(response => {
        let responseData = response.data.data.data[0];
        form.categoryId = responseData.categoryId;
        form.title = responseData.title;
        form.content = responseData.content;
        form.createDate = timestampToTime(responseData.createDate);
        form.imgUrl = responseData.imgUrl;
      })
    };
    const submit = () => {
      let requestData = {
        id: options.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: form.imgUrl
      };
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
      EditInfo(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          submitLoading.value = false;
        })
        .catch(error => {
          submitLoading.value = false;
        });
    };

    /**
     * watch
     */
    watch(() => categoryItem.item, (value) => {
      options.category = value
    })

    onMounted(() => {
      getInfoCategory()
      getInfo()
    })

    return{
      // ref
      options, form, submitLoading, uploadImgConfig,
      // methods
      submit,
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  cursor: pointer;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>