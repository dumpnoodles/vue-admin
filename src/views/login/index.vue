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
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm"     class="login-form" size="medium">

        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input id="password" type="text" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
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
/**
 * 没有使用default时，可以同时声明多个export
 * 文件import时需要花括号，否则不需要花括号，如request.js
 */
import sha1 from 'js-sha1';
import { GetSms, Register, Login } from "@/api/login"
import { Message } from 'element-ui';
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api"
import { stripscript, validateEmail, validatePass, validateVCode } from "@/utils/validate";
export default {
  name: 'login',
  setup(props, { refs, root }){
    // 这里放置数据、生命周期、自定义的函数
    // setup(props, context)
    // console.log(context)
    /**
     *  
      attrs: (...) == this.$attrs
      emit: (...) == this.$emit
      listeners: (...) == this.$listeners
      parent (...): == this.$parent
      refs(...): == this.$refs
      root(...): == this

      ES6的解构
      context {
        attrs: (...) == this.$attrs
        emit: (...) == this.$emit
        listeners: (...) == this.$listeners
        parent (...): == this.$parent
        refs(...): == this.$refs
        root(...): == this
      }

     */
    /****************************************************************
     * 声明数据
     */
    
    // 验证用户名为邮箱
    let validateUsername = (rule, value, callback) => {
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
    let validatePassword = (rule, value, callback) => {
      // 过滤后的数据
      ruleForm.password = stripscript(value)
      value = ruleForm.password
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
    let validatePasswords = (rule, value, callback) => {
      // 过滤后的数据
      if (model.model == "login") { callback(); }
      ruleForm.passwords = stripscript(value)
      value = ruleForm.passwords
      if (value === '') {
        callback(new Error('请再次输入密码'));
      }else if (value != ruleForm.password ) {
        callback(new Error('重复密码不正确'));
      } 
      else {
        callback();
      }
    };
    // 验证验证码
    let validateCode = (rule, value, callback) => {
      // 过滤后的数据
      ruleForm.code = stripscript(value)
      value = ruleForm.code
      if (!value) {
        return callback(new Error('请输入验证码'));
      } else if(validateVCode(value)) {
        callback(new Error('验证码格式错误'))
      } else {
        callback();
      }
    };

    const menuTab = reactive([
      { txt: '登录', current: true, type: 'login'},
      { txt: '注册', current: false, type: 'register' }
    ])

    // 模块值
    const model = ref('login')
    // 登录按钮禁用状态
    const loginButtonStatus = ref(true)
    // 验证码按钮状态
    const codeButtonStatus = reactive({
      status: false,
      text: '获取验证码'
    })
    // 倒计时
    const timer = ref(null);

    // 表单绑定数据
    const ruleForm = reactive({
      username: '897872164@qq.com',
      password: '',
      passwords: '',
      code: ''
    })

    // 表单验证
    const rules = reactive({
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
    })

    /***************************************************
     * 声明函数
     */
    const toggleMenu = (data => {
      menuTab.forEach(elem => {
        elem.current = false
      });
      // 高光
      data.current = true;
      // 修改模块值
      model.value = data.type;
      // 重置函数
      resetFormData()
      // 切换时清除倒计时
      clearcountDown()
    })
    // 重置表单函数
    const resetFormData = (() => {
      // this.$refs[formName].resetFields(); vue2.0写法
      refs.loginForm.resetFields();    //vue3.0写法
    })
    // 更新按钮状态
    const updateButtonStatus = ((params) => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    })

    /**
     * 获取验证码
     */
    const getSms = (() => {
      // 进行提示
      if(ruleForm.username == '') {
        root.$message.error('邮箱不能为空');
        return false
      }
      
      if(validateEmail(ruleForm.username)) {
        root.$message.error('邮箱格式有误，请重新输入!');
        return false
      }



      // 获取验证码接口
      let requestData = {
        username: ruleForm.username,    
        module: model.value
      }
      // 修改获取验证码按钮状态
      
      updateButtonStatus({
        status: true,
        text: '发送中'
      })

      // 倒计时
      countDown(60)

      // 延时多长时间
      setTimeout(() => {
        GetSms(requestData).then(response => {
        console.log(response)
        let data = response.data
        root.$message({
          message: data.message,
          type: 'success'
          })
        // 启用登录或注册按钮
        loginButtonStatus.value = false
          console.log(data)
        }).catch(error => {
          console.log(error)
        })
      },2000)

      
    })

    /**
     * 提交表单
     */
    const submitForm = (formName => {
      console.log(formName)
      refs[formName].validate((valid) => {
        // 表单验证通过
        console.log(valid)
        if (valid) {
          // 三元运算 登录成功 注册成功
          model.value === 'login' ? login() : register()
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    })
    /**
     * 登录
     */
    const login = (() => {    
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      }
      Login(requestData).then(response => {
        console.log('登录成功')
        let data = response.data
        root.$message({
          message: data.message,
          type: 'success'
        })
      }).catch(error => {
      console.log(error)
      })
    })
    /**
     * 注册
     */
    const register = (() => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      }
      Register(requestData).then(response => {
        let data = response.data
        root.$message({
          message: data.message,
          type: 'success'
        })
        toggleMenu(menuTab[0])
        clearcountDown()
      }).catch(error => {
          console.log(error)
      })   
    })
    /**
     * 倒计时
     * 两种倒计时：
     * setTimeout 只执行一次  clearTimeout(变量)
     * setInterval 不断的执行，需要条件才停止  clearInterval(变量)
     */
    const countDown = ((number) => {
      // 判断定时器是否存在，有则清除一遍
      if(timer.value) { clearcountDown(timer.value) }
      let time = number
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value)
          updateButtonStatus({
            status: false,
            text: '再次获取'
          })
        }else{
          updateButtonStatus({
            status: true,
            text: `倒计时${time}秒`
          })
        }
        
      }, 1000)
    })

    /**
     * 清除倒计时
     */
    const clearcountDown = (() => {
      // 还原初始状态
      clearInterval(timer.value)
      updateButtonStatus({
        status: false,
        text: '获取验证码'
      })
    })


    /**
     * 生命周期
     */
    // 挂载完成后
    onMounted(() => {
      
    })

    return {
      menuTab,
      model,
      toggleMenu,
      submitForm,
      ruleForm,
      rules,
      getSms,
      loginButtonStatus,
      codeButtonStatus,
      timer,
      clearcountDown,
      login,
      register,
      resetFormData,
      updateButtonStatus
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