import { GetCategory, GetCategoryAll } from "./news";
import { reactive } from "@vue/composition-api";

export function common(){
  const categoryItem = reactive({
    item: []
  })
  /**
   * 获取分类
   */
  const getInfoCategory = () => {
    GetCategory({}).then(response => {
      categoryItem.item = response.data.data.data
    }).catch(error => {
      console.log(error)
    })
  }

    /**
   * 获取全部分类
   */
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
