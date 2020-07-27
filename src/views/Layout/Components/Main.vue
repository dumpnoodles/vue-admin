<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"/>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive } from '@vue/composition-api'
export default {
  name: 'layoutMain',
  setup(props, { root }) {
  }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap {
  height: 100vh;
  background-color: #f7f7f7;
}
.main-content {
  width: 100%;
  height: 100%;
  padding-right: 30px;
  padding-top: $layoutHeader + 30;
  padding-left: $navMenu + 30;
  @include webkit(box-sizing, border-box);
  @include webkit(transition, all .3s ease 0s);
}
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0 30px;
  background-color: #fff;
  @include webkit(box-sizing, border-box);
}
.open {
  .main-content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .main-content {
    padding-left: $navMenuMin + 30;
  }
}
</style>