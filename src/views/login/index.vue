<template>
  <div id="login">
    <div class="login-wrap">
      <div class="menu-tab">
        <!-- 登录注册按钮 -->
        <ul>
          <li v-for="item in menuTab" :key="item.id" :class="{ 'current': item.current}" @click="toggleMenu(item)">{{ item.txt }} </li>
        </ul>
      <!-- 表单 -->
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"     class="login-form" size="medium">

        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input type="text" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-form" v-show="model === 'register'">
          <label>重复密码</label>
          <el-input type="text" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-input v-model.number="ruleForm.code" minlength="6" maxlength="6"></el-input>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="grid-content bg-purple">
                <el-button type="success" class="block">获取验证码</el-button>
              </div>
            </el-col>
          </el-row>          
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { stripscript, validateEmail, validatePass, validateVCode } from "@/utils/validate";
export default {
  name: 'login',
  data() {
    // 验证用户名为邮箱
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'));
      } else if (validateEmail(value)) {      
        callback(new Error('邮箱格式有误'));
      } 
      else {
        callback(); //true
      }
    };
    // 验证密码
    var validatePassword = (rule, value, callback) => {
      // 过滤后的数据
      this.ruleForm.password = stripscript(value)
      value = this.ruleForm.password
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (validatePass(value)) {
        callback(new Error('密码为6至20位的数字+字母'));
      } 
      else {
        callback();
      }
    };
    // 验证重复密码
    var validatePasswords = (rule, value, callback) => {
      // 过滤后的数据
      if (this.model == "login") { callback(); }
      this.ruleForm.passwords = stripscript(value)
      value = this.ruleForm.passwords
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value != this.ruleForm.password ) {
        callback(new Error('重复密码不正确'));
      } 
      else {
        callback();
      }
    };
    // 验证验证码
    var validateCode = (rule, value, callback) => {
      // 过滤后的数据
      this.ruleForm.code = stripscript(value)
      console.log(this.ruleForm.code)
      value = this.ruleForm.code
      if (!value) {
        return callback(new Error('请输入验证码'));
      } else if(validateVCode(value)) {
        callback(new Error('验证码格式错误'))
      } else {
        callback();
      }
    };
    return {
      menuTab: [
        { txt: '登录', current: true, type: 'login'},
        { txt: '注册', current: false, type: 'register' }
      ],
      // 模块值
      model: 'login',
      ruleForm: {
        username: '',
        password: '',
        passwords: '',
        code: ''
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        passwords: [
          { validator: validatePasswords, trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ]
      }
    }
  },
  created(){},
  // 挂在完成后自动执行的
  mounted(){

  },
  // 写函数的地方
  methods: {
    // 数据驱动视频渲染
    // js驱动DOM元素
    toggleMenu(data){
      this.menuTab.forEach( elem => {
        elem.current = false
      });
      // 高光
      data.current = true;
      // 修改模块值
      this.model = data.type;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
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
  .current {
    background-color: rgba(0,0,0, .1);
  }
}
.login-form {
  margin-top: 28px;
  label {
    margin-bottom: 3px;
    display: block;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>