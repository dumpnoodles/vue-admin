<template>
  <div id="login">
    <div class="login-wrap">
      <div class="menu-tab">
        <ul>
          <li v-for="item in menuTab" :key="item.id" :class="{'current': item.current}" @click="toggleMenu(item)">{{ item.txt }}</li>
        </ul>
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm"     class="login-form" size="medium">
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="passwords" class="item-form" v-if="model === 'register'">
          <label for="passwords">重复密码</label>
          <el-input id="passwords" type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-input id="code" v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="grid-content bg-purple">
                <el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{ codeButtonStatus.text }}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block" :disabled="loginButtonStatus">{{ model === 'login' ? "登录" : "注册"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import sha1 from 'js-sha1';
import { GetSms, Register, Login } from "@/api/login"
import { Message } from 'element-ui';
import { reactive, ref, isRef, toRefs } from "@vue/composition-api"
import { stripscript, validateEmail, validatePass, validateVCode } from "@/utils/validate";
export default {
  name: 'login',
  setup(props, { refs, root }){
    let validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("请输入用户名"));
      } else if(!validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback(); //true
      }
    };
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === '') {
        callback(new Error("请输入密码"));
      } else if (!validatePass(value)) {
        callback(new Error("密码为6至20位的数字+字母"));
      }
      else {
        callback();
      }
    };
    const validatePasswords = (rule, value, callback) => {
      if (model.model == "login") { callback(); };
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === '') {
        callback(new Error("请再次输入密码"));
      }else if (value != ruleForm.password ) {
        callback(new Error("重复密码不正确"));
      }
      else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value);
      value = ruleForm.code;
      if (!value) {
        return callback(new Error("请输入验证码"));
      } else if(!validateVCode(value)) {
        callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    /**
     * 声明数据
     */

    // ref
    const model = ref('login');
    const loginButtonStatus = ref(true);
    const timer = ref(null);

    // reactive
    const menuTab = reactive([
      { txt: '登录', current: true, type: 'login'},
      { txt: '注册', current: false, type: 'register' }
    ]);
    const codeButtonStatus = reactive({
      status: false,
      text: '获取验证码'
    });
    const ruleForm = reactive({
      username: '',
      password: '',
      passwords: '',
      code: ''
    });
    const rules = reactive({
      username: [
        { validator: validateUsername, trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur'  },
        { validator: validatePassword, trigger: 'blur' }
      ],
      passwords: [
        { validator: validatePasswords, trigger: 'blur' }
      ],
      code: [
        { validator: validateCode, trigger: 'blur' }
      ]
    });

    // methods
    const toggleMenu = (data => {
      menuTab.forEach(elem => { elem.current = false; });
      data.current = true;
      model.value = data.type;
      resetFormData();
      clearcountDown();
    });
    const resetFormData = (() => {
      refs.loginForm.resetFields();    // vue3.0 写法
    });
    const updateButtonStatus = ((params) => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    });
    const getSms = (() => {
      if(ruleForm.username === '') {
        root.$message.error('邮箱不能为空');
        return false;
      };
      if(!validateEmail(ruleForm.username)) {
        root.$message.error('邮箱格式有误，请重新输入!');
        return false;
      };
      const requestData = {
        username: ruleForm.username,
        module: model.value
      }
      updateButtonStatus({ status: true, text: '发送中' });
      countDown(60);
      setTimeout(() => {
        GetSms(requestData).then(response => {
        let data = response.data;
        root.$message({
          message: data.message,
          type: 'success'
          })
        loginButtonStatus.value = false;
        }).catch(error => {
          console.log(error);
        })
      },500)
    })
    const submitForm = (formName => {
      refs[formName].validate((valid) => {
        if (valid) {
          model.value === 'login' ? login() : register();
        } else {
          return false;
        }
      })
    })
    const login = (() => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      root.$store.dispatch('app/login', requestData).then(response => {
        let data = response.data;
        root.$message({
          message: data.message,
          type: 'success'
        });
        root.$router.push({
          name: 'Console'
        });
      }).catch(error => {
      console.log(error);
      })
    })
    const register = (() => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      Register(requestData).then(response => {
        let data = response.data
        root.$message({
          message: data.message,
          type: 'success'
        });
        toggleMenu(menuTab[0])
        clearcountDown()
      }).catch(error => {
          console.log(error)
      })
    })
    const countDown = ((number) => {
      if(timer.value) { clearcountDown(timer.value) }
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          updateButtonStatus({
            status: false,
            text: '再次获取'
          });
        }else{
          updateButtonStatus({
            status: true,
            text: `倒计时${time}秒`
          });
        };
      }, 1000)
    })
    const clearcountDown = (() => {
      clearInterval(timer.value);
      updateButtonStatus({
        status: false,
        text: '获取验证码'
      });
    })

    return {
      // ref
      model, loginButtonStatus, timer,
      // reactive
      menuTab, codeButtonStatus, ruleForm, rules,
      // method
      validateUsername, validatePassword, validatePasswords, validateCode,
      toggleMenu, resetFormData, updateButtonStatus, getSms, submitForm,
      login, register, clearcountDown
    }
  }
}
</script>
<style lang="scss" scoped>
#login {
  background-color: #344a5f;
  height: 100vh;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current { background-color: rgba(0,0,0, .1); }
}
.login-form {
  margin-top: 28px;
  label {
    margin-bottom: 3px;
    display: block;
    font-size: 14px;
    color: #fff;
  }
  .item-form { margin-bottom: 13px; }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn { margin-top: 19px; }
}
</style>
