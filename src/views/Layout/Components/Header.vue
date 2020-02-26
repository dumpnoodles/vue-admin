<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuState">
      <svg-icon iconClass="header-menu" className="header-menu" />
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <img src="../../../assets/images/face.jpg" alt="">
        {{ username }}
      </div>
      <div class="header-icon pull-left" @click="exit">
        <svg-icon iconClass="exit" className="exit" />  
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from'@vue/composition-api';
export default {
  name: 'layoutHeader',
  setup(props,{ root }){
    /**
     * 声明函数
     */
    const username = computed(() => root.$store.state.app.username )
    const navMenuState = () => {
      // root.$store.dispatch('setMenuStatus', {"name": "aaaa"})
      root.$store.commit('app/SET_COLLAPSE')
    }
    // 退出
    const exit = () => {
      root.$store.dispatch('app/exit').then(() => {
        root.$router.push({
          name: 'Login'
        })
      })
    }
    return {
      navMenuState,
      username,
      exit
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  position: fixed;
  top: 0;
  left: $navMenu;
  right: 0;
  height: 75px;
  background-color: #fff;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, .1));
  @include webkit(transition, all .3s ease 0s);
  line-height: 75px;

}
.header-icon {
  padding: 0 30px;
  svg {
    margin-bottom: -3px;
    font-size: 20px;
    cursor: pointer;
  }
}

.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon { padding: 0 28px;}
  img {
    display: inline-block;
    margin-bottom: -12px;
    margin-right: 18px;
    border-radius: 50px;
    width: 36px;
    height: 36px;
  }
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
</style>