import router from "./index";
import store from "../store/index";

import { getToKen, removeToKen, removeUserName } from "@/utils/app";

const whiteRouter = ['/login'];

router.beforeEach((to, from, next) => {
	if(getToKen()){
		if(to.path === '/login'){
			removeToKen();
			removeUserName();
			store.commit("app/SET_TOKEN", '');
			store.commit("app/SET_USERNAME", '');
			next();
		}else{
			if(store.getters['app/roles'].length === 0) {
				store.dispatch('permission/getRoles').then(response => {
					let role = response.role;
					let button = response.button;
					let btnPerm = response.btnPerm;
					store.commit("app/SET_ROLES", role);
					store.commit("app/SET_BUTTON", btnPerm);
					store.dispatch('permission/createRouter', role).then(response => {
						let addRouters = store.getters['permission/addRouters'];
						let allRouters = store.getters['permission/allRouters'];
						router.options.routes = allRouters;
						router.addRoutes(addRouters)
						next({ ...to, replace: true});
					})
				});
			}else{
					next();
			}
		}
	}else{
		if(whiteRouter.indexOf(to.path) !== -1) {
			next();
		}else{
			next('/login')
		}
	}
})