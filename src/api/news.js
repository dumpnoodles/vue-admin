import service from "@/utils/request";

export function GetList(data){
  return service.request({
    method: "post",
    url: "/news/getList/",
    data
  })
}

export function AddInfo(data){
  return service.request({
    method: "post",
    url: "/news/add/",
    data
  })
}

export function EditInfo(data){
  return service.request({
    method: "post",
    url: "/news/editInfo/",
    data
  })

}

export function DeleteInfo(data) {
  return service.request({
    method: "post",
    url: "/news/deleteInfo/",
    data
  })
}

export function AddFirstCategory(data){
  return service.request({
    method: "post",
    url: "/news/addFirstCategory/",
    data
  })
}

export function AddChildrenCategory(data){
  return service.request({
    method: "post",
    url: "/news/addChildrenCategory/",
    data
  })
}

export function GetCategory(data){
  return service.request({
    method: "post",
    url: "/news/getCategory/ ",
    data
  })
}

export function GetCategoryAll(data){
  return service.request({
    method: "post",
    url: "/news/getCategoryAll/ ",
    data
  })
}

export function DeleteCategory(data) {
  return service.request({
    method: "post",
    url: "/news/deleteCategory/",
    data
  })
}

export function EditCategory(data) {
  return service.request({
    method: "post",
    url: "/news/editCategory/",
    data
  })
}

