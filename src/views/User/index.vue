<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap category">
          <label>关键词: </label>
          <div class="wrap-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <SelectVue :config="data.configOption" :selectData.sync="data.selectData" />
              </el-col>
              <el-col :span="5">
                <el-input v-model="data.keyWord" placeholder="请输入搜索的关键字"></el-input>
              </el-col>
              <el-col :span="15">
                <el-button type="danger" @click="search" style="width: 18%">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right" @click="handerAdd">添加用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow">
      <template v-slot:status="slotData">
        <el-switch @change="handleSwitch(slotData.data)" v-model="slotData.data.status" active-value="2" inactive-value="1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button size="mini" type="danger" @click="handleDel(slotData.data)">删除</el-button>
        <el-button size="mini" type="success" @click="handleEdit(slotData.data)">编辑</el-button>
      </template>
      <template v-slot:tableFooterLeft>
        <el-button size="small" type="danger" @click="handleBatchDel()">批量删除</el-button>
      </template>
    </TableVue>
    <DialogAdd @refresh="refreshUserData" :editData.sync="data.editData" :flag.sync="data.dialog_add" />
  </div>
</template>
<script>
import { reactive } from "@vue/composition-api";
import { UserDel, UserActive } from "@/api/user";
import { global } from "@/utils/global";
import SelectVue from "@c/Select";
import TableVue from "@c/Table";
import DialogAdd from "./dialog/add";

export default {
  name: "userIndex",
  components: { SelectVue, TableVue, DialogAdd },
  setup(props, { root, refs }) {
    const { confirm } = global();

    /* reactive */

    const data = reactive({
      configOption: {
        init: ["name", "phone", "email"]
      },
      dialog_add: false,
      configTable: {
        tHead: [
          {
            label: "邮箱/用户名",
            field: "username",
            width: 180
          },
          {
            label: "真实姓名",
            field: "truename",
            width: 120
          },
          {
            label: "手机号",
            field: "phone",
            width: 150
          },
          {
            label: "地区",
            field: "region",

          },
          {
            label: "角色",
            field: "role",
            width: 120
          },
          {
            label: "禁启用状态",
            field: "status",
            columnType: "slot",
            slotName: "status",
            width: 120
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation"
          },
        ],
        requestData: {
          url: "getUserList",
          method: "post",
          data: {
            pageNumber: 1,
            pageSize: 5
          }
        },
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper"
      },
      tableRow: {},
      updateUserStatusFlag: false,
      editData: {},
      selectData: {},
      keyWord: ""
    });

    /* method */

    const handerAdd = () => {
      data.dialog_add = true;
      data.editData = Object.assign({});
    }

    const handleEdit = (params) => {
      data.dialog_add = true;
      data.editData = Object.assign({}, params);
    }

    const handleDel = (params) => {
      data.tableRow.idItem = [params.id]
      confirm({
        content: "确认删除选择的数据，确认后将无法恢复！",
        type: 'success',
        thenFn: userDelete
      });
    }

    const handleBatchDel = () => {
      let userId = data.tableRow.idItem;
      if(!userId || userId.length === 0){
        root.$message({
          type: "error",
          message: "请选择要删除的用户！"
        })
        return false;
      }
      confirm({
        content: "确认删除选择的数据，确认后将无法恢复！",
        type: 'success',
        thenFn: userDelete
      });
    };

    const userDelete = () => {
      UserDel({ id: data.tableRow.idItem }).then(response => {
        refreshUserData()
      });
    };
    const refreshUserData = () => {
      refs.userTable.refreshData()
    };

    const handleSwitch = (params) => {
      let requestData = {
        id: params.id,
        status: params.status
      }
      if(data.updateUserStatusFlag) { return false}
      data.updateUserStatusFlag = true
      UserActive(requestData).then(response => {
        root.$message({
          type: "success",
          message: response.data.message
        })
        data.updateUserStatusFlag = !data.updateUserStatusFlag;
      }).catch(error => {
        data.updateUserStatusFlag = !data.updateUserStatusFlag;
      })
    };

    const search = () => {
      let requestData = {
        [data.selectData.value] : data.keyWord
      }
      refs.userTable.paramsLoadData(requestData)
    }


    return {
      /* reactive */
      data,
      /* method */
      handleBatchDel, userDelete, handleDel, refreshUserData,
      handleSwitch, handleEdit, handerAdd, search
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40, 60)
  }
}
</style>