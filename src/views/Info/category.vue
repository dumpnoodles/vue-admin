<template>
  <div id="category">
    <!-- 添加一级分类按钮 -->
    <el-button type="danger" @click="addFirst({ type: 'catagory_first_add' })">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <el-row :gutter="30">
      <el-col :span="9">
        <div class="category-wrap">
          <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
            <!-- 一级分类 -->
            <h4>
              <svg-icon icon-class="minus"></svg-icon>
              {{ firstItem.category_name }}
              <!-- 一级分类编辑、添加子级、删除按钮 -->
              <div class="button-group">
                <el-button size="mini" type="danger" @click="editCategory({ data: firstItem , type: 'catagory_first_edit'})" round>编辑</el-button>
                <el-button size="mini" type="success" @click="handlerAddChildren({ data: firstItem , type: 'catagory_children_add'})" round>添加子级</el-button>
                <el-button size="mini" round @click="deleteCategoryConfirm(firstItem.id)">删除</el-button>
              </div>
            </h4>
            <!-- 子级分类 -->
            <ul v-if="firstItem.children">
              <li v-for="childItem in firstItem.children" :key="childItem.id">
                {{ childItem.category_name}}
                <!-- 子级分类编辑、删除按钮 -->
                <div class="button-group">
                  <el-button size="mini" type="danger" round>编辑</el-button>
                  <el-button size="mini" round>删除</el-button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="15">
        <!-- 分类编辑 -->
        <h4 class="menu-title">一级分类编辑</h4>
        <el-form label-width="142px" class="form-wrap" ref="categoryForm">
          <el-form-item label="一级分类名称：" v-if="category_first_input">
            <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
          </el-form-item>
          <el-form-item label="二级分类名称：" v-if="category_children_input">
            <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              @click="submit"
              :loading="submit_button_loading"
              :disabled="submit_button_disabled"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { AddFirstCategory, DeleteCategory, EditCategory, AddChildrenCategory } from "@/api/news";
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
import { global } from "@/utils/global";
import { common } from "@/api/common";
export default {
  name: "category",
  setup(props, { root, refs }) {
    const { confirm } = global();
    const { categoryItem, getInfoCategory, getInfoCategoryAll} = common();
    /**
     * 声明数据
     */

    // ref
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    const submit_button_loading = ref(false);
    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const submit_button_disabled = ref(true);
    const deleteId = ref('');
    const submit_button_type = ref('');

    // reactive
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    const category = reactive({
      item: [],
      current: []
    });

    // method
    const submit = () => {
      if(submit_button_type.value == "catagory_first_add"){
        addFirstCategory()
      }
      if(submit_button_type.value == "catagory_first_edit"){
        editFirstCategory()
      }
      if(submit_button_type.value == "catagory_children_add"){
        addChildrenCategory()
      }
    };
    const addFirstCategory = () => {
      if (!form.categoryName) {
        root.$message({
          message: "分类名称不能为空",
          type: "error"
        });
        return false;
      }
      submit_button_loading.value = true;
      AddFirstCategory({ categoryName: form.categoryName }).then(response => {
        let data = response.data;
        if (data.resCode === 0) {
          root.$message({
            message: data.message,
            type: "success"
          });
          category.item.push(data.data);
        }
        submit_button_loading.value = false;
        form.categoryName = "";
        form.secCategoryName = "";
      }).catch(error => {
        submit_button_loading.value = false;
        form.categoryName = "";
        form.secCategoryName = "";
      });
    };
    const addFirst = (params) => {
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      submit_button_type.value = params.type
    };
    const handlerAddChildren = (params) => {
      submit_button_type.value = params.type
      category.current = params.data
      category_first_input.value = true;
      category_children_input.value = true;
      category_first_disabled.value = true;
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
      form.categoryName = params.data.category_name;
    };
    const addChildrenCategory = () => {
      if(!form.secCategoryName){
        root.$message ({
          message: "子级分类名称不能为空！",
          type: "error"
        })
        return false;
      }
      let requestData = {
        categoryName: form.secCategoryName,
        parentId: category.current.id
      };
      AddChildrenCategory(requestData).then(response => {
        let responseData = response.data
        root.$message({
          message: responseData.message,
          type: "success"
        })
        getInfoCategoryAll()
        form.secCategoryName = ''
      });
    };
    const deleteCategoryConfirm = (categoryID) => {
      deleteId.value = categoryID;
      confirm({
        content: "确认删除选择的数据，确认后将无法恢复！",
        type: "success",
        fn: deleteCategory,
        catchFn: () => {
          deleteId.value = '';
        },
      });
    };
    const editCategory = (params) => {
      submit_button_type.value = params.type
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      form.categoryName = params.data.category_name
      category.current = params.data
    };
    const editFirstCategory = () => {
      if(category.current.length == 0){
        root.$message({
          message: "未选择分类!!",
          type: "error"
        })
        return
      }
      let requestData = {
        id: category.current.id,
        categoryName: form.categoryName
      };
      EditCategory(requestData).then(response => {
        let responseData = response.data;
        root.$message({
          message: responseData.message,
          type: "success"
        });
        category.current.category_name = responseData.data.data.categoryName;
        form.categoryName = ''
        category.current = []
      }).catch(error => {
        console.log(error)
      })
    };
    const deleteCategory = () => {
      DeleteCategory({ categoryId: deleteId.value } ).then(response => {
        let newData = category.item.filter(item => item.id != deleteId.value);
        category.item = newData;
      }).catch(error => {
        console.log(error);
      })
    };

    onMounted(() => {
      getInfoCategoryAll();
    });

    /**
     * watch
     */
    watch(() => categoryItem.item, (value) => {
      category.item = value;
    });

    return {
      // ref
      category_first_input,category_children_input,submit_button_loading,category_first_disabled, category_children_disabled, submit_button_disabled,
      deleteId,
      // reactive
      form,category,
      // method
      submit,addFirst,deleteCategoryConfirm,deleteCategory,editCategory,
      addFirstCategory,editFirstCategory,handlerAddChildren,addChildrenCategory
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap {
  div:first-child {
    &:before {
      top: 28px;
    }
  }
  div:last-child {
    &:before {
      bottom: 23px;
    }
  }
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    border-left: 1px dotted #000;
  }
  h4 {
    padding-left: 40px;
  }
  svg {
    position: absolute;
    left: 15px;
    top: 14px;
  }
  .button-group {
    display: none;
    position: absolute;
    z-index: 2;
    top: -1px;
    right: 11px;
    button {
      font-size: 12px;
    }
  }
  li {
    position: relative;
    margin-left: 22px;
    padding-left: 38px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 20px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li, h4 {
    @include webkit(transition, all 0.3s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  &:hover {
    background-color: #f3f3f3;
  }
}
.form-wrap {
  width: 410px;
  padding-top: 26px;
}
.hr-e9e9e9 {
  width: calc(100% + 60px);
  margin-left: -30px;
  border: none;
  border-bottom: 1px solid #e9e9e9;
  margin: 30px 0;
}
</style>
