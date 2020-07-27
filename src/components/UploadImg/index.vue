<template>
  <el-upload
    class="avatar-uploader"
    :action="config.action"
    :show-file-list="false"
    :data="options.uploadKey"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="options.image" :src="form.imgUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
import { QiniuToken } from "@/api/common";
export default {
  name: "uploadImg",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup (props, { root, emit }){
    /**
     * 声明数据
     */
    const options = reactive({
      image: "",
      uploadKey: {
        token: "",
        key: ""
      }
    })
    const handleAvatarSuccess = (res, file) => {
      let image = `${$root.$store.getters["common/qiniuUrl"]}/${res.key}`;
        options.imgae = image;
        emit("update:imgUrl", image);
    }
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        root.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        root.$message.error('上传头像图片大小不能超过 2MB!');
      }
      let suffix = file.name
      let key = encodeURI(`${suffix}`)
      options.uploadKey.key = key

      return isJPG && isLt2M;
    }
    const getQiniuToken = () => {
      let requestData = {
        "accesskey": props.config.accesskey,
        "secretkey": props.config.secretkey,
        "buckety": props.config.buckety
      }
      QiniuToken(requestData).then(response => {
        options.uploadKey.token = response.data.data.token
      })
    }
    onMounted(() => {
      getQiniuToken()
    })
    watch(() => props.imgUrl, (value) => {
      options.imgae = value
    })
    return {
      // reactive
      options,
      //methods
      handleAvatarSuccess, beforeAvatarUpload,
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

