import { requestUrl } from "@/api/requestUrl";
import { loadTableData } from "@/api/common";
let tableLoadData = {
  data() {
    return {
    }
  },
  mounted() {
    this.tableLoadData();
  },
  methods: {
    tableLoadData() {
      let requestJson = this.tableConfig.requestData;
      let requestData = {
        url: requestUrl[requestJson.url],
        method: requestJson.method,
        data: requestJson.data
      }
      loadTableData(requestData).then(response => {
        let responseData = response.data.data.data;
        if(responseData && responseData.length > 0){
          this.tableData = responseData;
          this.total = response.data.data.total
        }else {
          this.tableData = responseData;
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}

export default tableLoadData;