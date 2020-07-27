import service from '@/utils/request'

export function GetSms(data){
  return service.request({
    method: "post",
    url: "/getSms/",
    data: data
  });
}

export function Login(data){
  return service.request({
    method: "post",
    url: "/login/",
    data: data
  });
}

export function Logout(data = {}){
  return service.request({
      method: "post",
      url: "/logout/",
      data
  })
}

export function Register(data){
  return service.request({
    method: "post",
    url: "/register/",
    data: data
  });
}

export function getUserRole(data = {}){
  return service.request({
    method: "post",
    url: "/userRole/",
    data
  })
}

