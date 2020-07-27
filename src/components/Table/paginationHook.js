import { reactive } from "@vue/composition-api";
export function paginationHook() {
  const pageData = reactive({
    currentPage: 1,
    pageSize: 5,
    total: 0,
    pageSizes: [5, 20, 50, 100]
  });

  const totalCount = (val) => { pageData.total = val };
  const handleSizeChange = (val) => { pageData.pageSize = val };
  const handleCurrentChange = (val) => { pageData.currentPage = val };
  return {
    pageData, handleSizeChange, handleCurrentChange, totalCount
  }
}