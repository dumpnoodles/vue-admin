import { GetCategory, GetCategoryAll } from "./news";
import { reactive } from "@vue/composition-api";
import service from '@/utils/request';

export function common(){
  const categoryItem = reactive({
    item: []
  });

  const getInfoCategory = () => {
    GetCategory({}).then(response => {
      categoryItem.item = response.data.data.data
    }).catch(error => {
      console.log(error)
    })
  }

  const getInfoCategoryAll = () => {
    GetCategoryAll({}).then(response => {
      categoryItem.item = response.data.data
    }).catch(error => {
      console.log(error)
    })
  }
  return {
    categoryItem,
    getInfoCategory,
    getInfoCategoryAll
  }
}

export function QiniuToken(data){
  return service.request({
    method: "post",
    url: "/uploadImgToken/",
    data
  })
}

export function loadTableData(params){
  return service.request({
    method: params.method || "post",
    url: params.url,
    data: params.data || {}
  })
}

export function GetCityPicker(data){
  return service.request({
    method: "post",
    url: "/cityPicker/",
    data
  })
}
