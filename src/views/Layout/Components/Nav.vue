<template>
  <div id="nav-wrap">
    <h1 class="logo"><img src="../../../assets/logoo.png" alt=""></h1>
    <el-menu 
      default-active="1-4-1" 
      class="el-menu-vertical-demo" 
      :collapse="isCollapse" 
      background-color="transparent" 
      text-color="#fff" 
      active-text-color="#fff"
      router>
      <template v-for="(item, index) in routers">
        <el-submenu :key="item.id" v-if="!item.hidden" :index="index + ''">
        <!-- 一级菜单 -->
        <template slot="title">
          <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
          <span slot="title">{{ item.meta.name }}</span>
        </template>
        <!-- 子级菜单 -->
        <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path">{{ subItem.meta.name }}</el-menu-item>
        </el-submenu> 
      </template>
    </el-menu>
  </div>
</template>
<script>
import { reactive, ref, isRef, toRefs, onMounted, computed } from "@vue/composition-api"
export default {
  name: 'navMenu',
  setup(props, { root }) {
    // 声明 data 数据
    // const isCollapse = ref(false);
    const routers = reactive(root.$router.options.routes);
    // console.log(routers)

    /**
     * computed 监听
     */
    const isCollapse = computed(() => { // 只有一行代码可不需加return和花括号
      // console.log(root.$store.state.isCollapse ) //直接为
      return root.$store.state.app.isCollapse  // root.$store.state.isCollapse
    });

    /**
     * 声明函数
     */


    // 打印store
    // console.log(root.$store.state.count)
    // console.log(root.$store.getters.count)

    // root.$store.commit('SET_COUNT', 100)
    return {
      isCollapse,
      routers

    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: $navMenu;
  background-color: #344a5f;
  @include webkit(transition, all .3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
.logo {
  text-align: center;
  img {
    margin: auto;
    width: 92px;
    padding-bottom: 10px;
    @include webkit(transition, all .3s ease 0s)
  }
}
.open {
  #nav-wrap { width: $navMenu; }
}
.close {
  #nav-wrap { width: $navMenuMin;; }
  .logo img { width: 75%; }
    // margin: auto;
}
</style>