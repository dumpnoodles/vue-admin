<template>
  <div>
    <el-row :gutter="30">
      <!-- 类别部件 -->
      <el-col :span="4">
        <div class="label-wrap category">
          <label for>类别:</label>
          <div class="wrap-content">
            <el-select v-model="category_value" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <!-- 日期部件 -->
      <el-col :span="7">
        <div class="label-wrap date">
          <label for>日期:</label>
          <div class="wrap-content">
            <el-date-picker
              v-model="date_value"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
              style="width: 100%"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </div>
        </div>
      </el-col>
      <!-- 关键字选择部件 -->
      <el-col :span="4">
        <div class="label-wrap key-work">
          <label for>关键字:</label>
          <div class="wrap-content">
            <el-select v-model="search_key" style="width: 100%">
              <el-option
                v-for="item in search_options"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <!-- 输入框部件 -->
      <el-col :span="4">
        <el-input v-model="search_keyWork" placeholder="请输入内容" style="width: 100%"></el-input>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="3">
        <el-button type="danger" style="width: 75%" @click="getList">搜索</el-button>
      </el-col>
      <!-- 新增框 -->
      <el-col :span="2">
        <el-button type="danger" class="pull-right" style="width: 35%" @click="dialog_info = true" v-if="btnPerm('info:add')">新增</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <!-- 表格数据 -->
    <el-table :data="table_data.item" v-loading="loadingData" @selection-change="handleSelectionChange" border style="width: 100%">
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column prop="title" label="标题" width="430"></el-table-column>
      <el-table-column prop="categoryId" label="类别" width="130" :formatter="toCategory"></el-table-column>
      <el-table-column prop="createDate" label="日期" width="237" :formatter="toData"></el-table-column>
      <el-table-column prop="user" label="管理员" width="115"></el-table-column>
      <el-table-column prop="todo" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)" v-btnPerm="'info:del'" class="hidden-button">删除</el-button>
          <el-button type="success" size="mini" @click="editInfo(scope.row.id)" v-btnPerm="'info:edit'" class="hidden-button">编辑</el-button>
          <el-button type="success" size="mini" @click="detailed(scope.row)" v-btnPerm="'info:detailed'" class="hidden-button">编辑详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="black-space-30"></div>
    <!-- 底部分页 -->
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹窗 -->
    <DialogInfo :flag.sync="dialog_info" :category="options.category" @getListInfo="getList"  />
    <!-- 编辑弹窗 -->
    <DialogEditInfo :flag.sync="dialog_info_edit" :id="infoEdit" :category="options.category" @getListEmit="getList"  />
  </div>
</template>
<script>
import { GetCategory, GetList, DeleteInfo } from "@/api/news";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
import { ref, reactive, watch, onMounted } from "@vue/composition-api";
import { global } from "@/utils/global";
import { common } from "@/api/common";
import { timestampToTime } from "@/utils/common";
export default {
  name: "infoIndex",
  components: { DialogInfo, DialogEditInfo },
  setup(props, { root }) {
    const { str, confirm } = global();
    const { getInfoCategory, categoryItem } = common();
    watch(() => console.log(str.value) )
    /**
     * 声明数据
     */

    //ref
    const category_value = ref("");
    const date_value = ref("");
    const search_key = ref("");
    const search_keyWork = ref("");
    const dialog_info = ref(false);
    const total = ref(0);
    const loadingData = ref(false);
    const deleteInfoId = ref('');
    const dialog_info_edit = ref(false);
    const infoEdit = ref('');

    // reactive
    const options = reactive({
      category: []
    });
    // 页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });
    // 关键字选择框
    const search_options = reactive([
      { value: "id", label: "ID" },
      { value: "title", label: "标题" }
    ]);
    // 表格数据
    const table_data = reactive({
      item: []
    });

    // method

    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      if(category_value.value) { requestData.categoryId = category_value.value }
      if(date_value.value.length > 0) {
        requestData.startTiem = date_value.value[0]
        requestData.endTime = date_value.value[1]
      }
      if(search_keyWork.value) { requestData[search_key.value] = search_keyWork.value }
      return requestData;
    };
    const getList = () => {
      let requestData = formatData();
      loadingData.value = true;
      GetList(requestData).then(response => {
        let data = response.data.data;
        table_data.item = data.data;
        total.value = data.total;
        loadingData.value = false;
      }).catch(error => {
        loadingData.value = false;
      })
    };
    const deleteAll = () => {
      if(!deleteInfoId.value || deleteInfoId.value.length == 0){
        root.$message({
          message: "请选择要删除的数据！！",
          type: "error"
        });
        return false;
      }
      confirm({
        content: "确认删除选择的数据，确认后将无法恢复！",
        type: 'success',
        thenFn: confirmDelete,
      });
    };
    const deleteItem = (id) => {
      deleteInfoId.value = [id];
      confirm({
        content: "确认删除选择的数据，确认后将无法恢复！",
        type: 'success',
        thenFn: confirmDelete,
      });
    };
    const confirmDelete = (value) => {
      DeleteInfo({id: deleteInfoId.value}).then(response => {
        deleteInfoId.value = '';
        getList();
      });
    };
    const handleCurrentChange = (val) => {
      page.pageNumber = val;
      getList();
    };
    const handleSizeChange = (val) => {
      page.pageSize = val;
    };
    const toData = (row) => {
      return timestampToTime(row.createDate);
    };
    const toCategory=(row) => {
      let categoryId = row.categoryId;
      let categoryData = options.category.filter(item => item.id == categoryId)[0];
      return categoryData.category_name;
    };
    const handleSelectionChange = (val) => {
      let id = val.map(item => item.id);
      deleteInfoId.value = id;
    };
    const editInfo = (id) => {
      infoEdit.value = id
      dialog_info_edit.value = true
    };
    const detailed = (data) => {
      root.$store.commit("infoDetailed/UPDATE_STATE_VALUE", {
        id: {
          value: data.id,
          session: true,
          sessionKey: "infoId"
        },
        title: {
          value: data.title,
          session: true,
          sessionKey: "infoTitle"
        }
      });
      // 跳转页面
      root.$router.push({
        name: "InfoDetailed",
        params: {
          id: data.id,
          title: data.title
        }
      });
    };

    onMounted(() => {
      getInfoCategory(),
      getList()
    });

    watch(() => categoryItem.item, (value) => {
      options.category = value;
    });

    return {
      // ref
      category_value, date_value, search_key, search_keyWork, dialog_info, total, page, loadingData, deleteInfoId, dialog_info_edit, infoEdit,
      // reactive
      options, search_options, table_data,
      // method
      handleCurrentChange, handleSizeChange, toData, toCategory, handleSelectionChange, getList, editInfo, detailed,
      deleteItem, deleteAll, confirmDelete, formatData
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 45, 40, 46);
  }
  &.date {
    @include labelDom(left, 41, 40, 46);
  }
  &.key-work {
    @include labelDom(left, 49, 40, 60);
  }
}
</style>
<style>
  button.hidden-button { display: none; }
  button.show-button { display: inline-block; }
</style>