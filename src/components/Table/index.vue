<template>
  <div>
    <el-table :data="data.tableData" border style="width: 100%" @selection-change="thatSelectionBox">
      <el-table-column v-if="data.tableConfig.selection" type="selection" width="55"></el-table-column>
      <template v-for="item in data.tableConfig.tHead">
        <el-table-column
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          v-if="item.columnType === 'slot'"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          v-else
          >
        </el-table-column>
      </template>
    </el-table>
    <div class="table-footer">
      <el-row>
        <el-col :span="4">
          &nbsp;
          <slot name="tableFooterLeft"></slot>
        </el-col>
        <el-col :span="20">
          <el-pagination
            class="pull-right"
            v-if="data.tableConfig.paginationShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.currentPage"
            :page-sizes="pageData.pageSizes"
            :page-size="pageData.pageSize"
            :layout="data.tableConfig.paginationLayout"
            :total="pageData.total"
            background
          >
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { reactive, onBeforeMount, watch } from "@vue/composition-api";
import { loadData } from "./tableLoadData";
import { paginationHook } from "./paginationHook";
export default {
  name: "TableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    tableRow: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root,  emit }){
    const { tableData, tableLoadData } = loadData({ root });
    const { pageData, handleSizeChange, handleCurrentChange, totalCount } = paginationHook({ root });

    /* reactive */

    const data = reactive({
      tableConfig: {
        selection: true,
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        requestData: {},
        tHead: []
      },
      tableData: []
    });


    /* methods */

    const initTableConfig = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for(let key in configData) {
        if(keys.includes(key)){
          data.tableConfig[key] = configData[key]
        }
      }
    }
    const thatSelectionBox = (val) => {
      let rowData = { idItem: val.map(item => item.id) };
      emit("update:tableRow", rowData)
    };

    const refreshData = () => {
      tableLoadData(data.tableConfig.requestData);
    }

    const paramsLoadData = (params) => {
      let requestData = Object.assign({}, params, {
        pageNumber: 1,
        pageSize: 10
      })
      data.tableConfig.requestData.data = requestData;
      tableLoadData(data.tableConfig.requestData);
    }

    onBeforeMount(() => {
      initTableConfig();
      tableLoadData(data.tableConfig.requestData);
    })

    watch([
      () => tableData.item,
      () => tableData.total
    ], ([tableData, total]) => {
      data.tableData = tableData;
      totalCount(total);
    })
    watch([
      () => pageData.currentPage,
      () => pageData.pageSize
    ], ([currentPage, pageSize]) => {
      let requestData = data.tableConfig.requestData;
      if(requestData.data){
        requestData.data.pageNumber = currentPage,
        requestData.data.pageSize = pageSize;
        tableLoadData(data.tableConfig.requestData);
      }
    })
    return {
      // reactive
      data, pageData,
      // method
      handleSizeChange, handleCurrentChange, thatSelectionBox, refreshData,
      paramsLoadData
    }
  }
}
</script>
<style lang="scss" scoped>
.table-footer { padding: 15px 0; }
</style>
