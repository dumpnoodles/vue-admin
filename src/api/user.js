import service from '@/utils/request'

export function GetRole(data = {}){
  return service.request({
    method: "post",
    url: "/role/",
    data
  });
}

export function GetSystem(data = {}){
  return service.request({
    method: "post",
    url: "/system/",
    data
  });
}

export function UserAdd(data){
  return service.request({
    method: "post",
    url: "/user/add/",
    data
  });
};

export function UserDel(data = {}){
  return service.request({
    method: "post",
    url: "/user/delete/",
    data
  });
};

export function UserActive(data) {
  return service.request({
    method: "post",
    url: "/user/actives/",
    data
  })
}

export function UserEdit(data) {
  return service.request({
    method: "post",
    url: "/user/edit/",
    data
  })
}

export function GetPermButton(data = {}){
  return service.request({
      method: "post",
      url: "/permButton/",
      data
  })
}

