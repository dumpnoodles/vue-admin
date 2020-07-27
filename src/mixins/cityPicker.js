import { GetCityPicker } from "@/api/common";
import { reactive } from '@vue/composition-api';
export function cityPicker(){
  /* reactive */
  const data = reactive({
    provinceValue: '',
    provinceData: [],
    cityValue: '',
    cityData: [],
    areaValue: '',
    areaData: [],
    streetValue: '',
    streetData: []
  });

  const resultData = reactive({
    provinceValue: '',
    cityValue: '',
    areaValue: '',
    streetValue: '',
  });

  /* method */
  const getProvince = () => {
    getData({ type: "province" });
  };

  const handleProvince = (val) => {
    resetValue({type: 'city'});
    getData({ type: "city", province_code: val});
  };

  const handleCity = (val) => {
    resetValue({type: 'area'});
    getData({ type: "area", city_code: val});
  };

  const handleArea = (val) => {
    resetValue({type: 'street'});
    getData({ type: "street", area_code: val});
  }

  const handleStreet = (val) => {
    resetValue({type: ''});
  };

  const getData = (requestData) => {
    GetCityPicker(requestData).then(response => {
      data[`${requestData.type}Data`] = response.data.data.data;
    }).catch(error => {
      console.log(error);
    })
  };

  const resetValue = (params) => {
    const valueJson = {
      city: ['cityValue', 'areaValue', 'streetValue'],
      area: ['areaValue', 'streetValue'],
      street: ['streetValue']
    };
    const arrObj = valueJson[params.type];
    if(arrObj) { arrObj.forEach( item => data[item] = '' ) }
    result();
  };

  const result = () => {
    for(let key in resultData){
      resultData[key] = data[key]
    }
  };

  return {
    // reactive
    data, resultData,
    // method
    getProvince, handleProvince, handleCity, handleArea, handleStreet,
  }
}