import Vue from "vue";
import store from "../store/index.js";

Vue.directive("btnPerm",{
    bind:function(el, bingind, vnode){
        if(bingind.def.hasBtnPerm(bingind.value)) {
            el.className = el.className + " show-button";
        }
    },
    inserted:function(el){},
    update:function(){},
    componentUpdated:function(){},
    unbind:function(){},
    hasBtnPerm:function(permission){
        const button = store.getters["app/buttonPermission"];
        const roles = store.getters["app/roles"];
        if(roles.includes("admin")) { return true }
        return button.indexOf(permission) != -1; //
    }
})