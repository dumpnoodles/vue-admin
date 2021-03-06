import { MessageBox } from 'element-ui';
import { ref } from '@vue/composition-api';

export function global() {
  const str = ref('');
  const confirm = (params) => {
    MessageBox.confirm(params.content, params.tip ||'提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: params.type || 'warning',
      center: true
    }).then(() => {
      str.value = params.id || '';
      params.thenFn && params.thenFn(params.id || '')
    }).catch(() => {
      params.catchFn && params.catchFn()
    });
  };
  return {
    str,
    confirm
  }
}
/* 全局方法：确认消息提示方法 */