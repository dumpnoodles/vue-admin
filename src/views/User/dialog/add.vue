<template>
  <el-dialog
    title="新增"
    :visible.sync="dialog_info_flag"
    width="600px"
    @open="openDialog"
    @close="close"
  >
    <el-form :model="data.form" :rules="data.rules" ref="addUserForm">
      <el-form-item label="用户名：" :label-width="formLabelWidth" prop="username">
        <el-input v-model="data.form.username" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth" prop="password">
        <el-input type="password" v-model="data.form.password" placeholder="请设置6~20位数字+字母"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" :label-width="formLabelWidth" prop="truename">
        <el-input v-model="data.form.truename" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" :label-width="formLabelWidth" prop="phone">
        <el-input v-model.number="data.form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="地区：" :label-width="formLabelWidth" prop="region">
        <CityPicker :cityPickerData.sync="data.cityPickerData" />
      </el-form-item>
      <el-form-item label="是否启用：" :label-width="formLabelWidth" prop="status">
        <el-radio v-model="data.form.status" label="1">禁用</el-radio>
        <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>
      <el-form-item label="角色：" :label-width="formLabelWidth" prop="role">
        <el-checkbox-group v-model="data.form.role">
          <el-checkbox v-for="item in data.roleItem" :key="item.role" :label="item.role">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="按钮：" :label-width="data.formLabelWidth">
        <template v-if="data.btnPerm.length > 0">
          <div v-for="item in data.btnPerm" :key="item.value">
            <h4>{{ item.name }}</h4>
            <template v-if="item.perm && item.perm.length > 0">
              <el-checkbox-group v-model="data.form.btnPerm">
                <el-checkbox v-for="buttons in item.perm" :key="buttons.value" :label="buttons.value">{{ buttons.name }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
        </template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" :loading="submitLoading" @click="submit('addUserForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import sha1 from 'js-sha1';
import { ref, reactive, watch } from "@vue/composition-api";
import { GetRole, GetSystem, GetPermButton, UserAdd, UserEdit} from "@/api/user";

import { stripscript, validateEmail, validatePass } from "@/utils/validate";
import CityPicker from "@c/CityPicker" ;
export default {
  name: "dialogAdd",
  components: { CityPicker },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit, refs }) {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("请输入邮箱"));
      } else if (!validateEmail(value)) {
        callback(new Error("邮箱格式有误"));
      }
      else {
        callback(); //true
      }
    };
    const validatePassword = (rule, value, callback) => {
      if(data.form.id && !value) {
        callback();
      }
      if((data.form.id && value) || !data.form.id){
        if(value) {
          data.form.password = stripscript(value);
          value = data.form.password;
        }``
        if (value === ''){
          callback(new Error("请输入密码"));
        } else if (!validatePass(value)){
          callback(new Error("密码为6至20位的数字+字母"));
        }
        else{
          callback();
        }
      }

    };

    /**
     * 声明数据
     */

    /* ref */
    const dialog_info_flag = ref(false);
    const formLabelWidth = ref("89px");
    const submitLoading = ref(false);

    /* reactive */
    const data = reactive({
      cityPickerData: {},
      roleItem: [],
      btnPerm: [],
      form: {
        username: "",
        password: "",
        truename: "",
        phone: "",
        region: "",
        status: "2",
        role: [],
        btnPerm: []
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    })

    /* method */
    const getRole = () => {
      if(data.roleItem.length === 0) {
        GetRole().then(response => {
          data.roleItem = response.data.data
        })
      }
      if(data.btnPerm.length === 0) {
        GetPermButton().then(response => {
          data.btnPerm = response.data.data
        })
      }
    }
    const userAdd = (requestData) => {
      UserAdd(requestData).then(response => {
        let data = response.data;
        root.$message({
          type: "success",
          message: data.message
        });
        close();
        emit('refresh');
      })

    };
    const userEdit = (requestData) => {
      UserEdit(requestData).then(response => {
        let data = response.data;
        root.$message({
          type: "success",
          message: data.message
        })
        close();
        emit('refresh');
      })
    }
    const openDialog = () => {
      getRole()
      let editData = props.editData;
      if(editData.id) {
        editData.role = editData.role ? editData.role.split(',') : [];
        editData.btnPerm = editData.btnPerm ? editData.btnPerm.split(',') : [];
        for(let key in editData) {
          data.form[key] = editData[key]
        }
      }else {
        data.form.id && delete data.form.id
      }
    };
    const close = () => {
      dialog_info_flag.value = false;
      resetForm();
      emit("update:flag", false);
    };
    const resetForm = () => {
      data.cityPickerData = {};
      refs.addUserForm.resetFields();
    };
    const submit = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          let requestData = Object.assign({}, data.form);
          requestData.role = requestData.role.join();
          requestData.btnPerm = requestData.btnPerm.join();
          requestData.region = JSON.stringify(data.cityPickerData);
          if(requestData.id){
            if(requestData.password){
              requestData.password = sha1(requestData.password)
            }else {
              delete requestData.password
            }
            userEdit(requestData);
          }else {
            requestData.password = sha1(requestData.password);
            userAdd(requestData);
          }

        } else {
          return false;
        }
      })
    };

    /* watch */
    watch(() => {
      dialog_info_flag.value = props.flag;
    });

    return {
      /* ref */
      dialog_info_flag, formLabelWidth,submitLoading,
      /* reactive */
      data,
      /* methods */
      close, openDialog, submit, resetForm
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
