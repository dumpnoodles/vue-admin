let pagination = {
  data(){
    return {
      currentPage: 1,
      pageSize: 5,
      total: 0,
      pageSizes: [5, 20, 50, 100]
    }
  },
  mounted() {
    this.tableLoadData();
  },
  methods: {
    totalCount(val){
      this.tableConfig.requestData.data.total = val;
      this.tableLoadData();
    },
    handleSizeChange(val){
      this.tableConfig.requestData.data.pageSize = val;
      this.tableLoadData();
    },
    handleCurrentChange(val){
      this.tableConfig.requestData.data.currentPage = val;
      this.tableLoadData();
    }
  }
}

export default pagination;