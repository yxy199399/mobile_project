/**
 * 过滤器
 */
import dayjs from 'dayjs'

export default {
	Date: (ts, split = '-') => {
		if (!ts) return '';
		return dayjs(ts * 1).format('YYYY' + split +'MM' + split + 'DD');
	},

	DateTime: (ts, split = '-') => {
		if (!ts) return '';
		return dayjs(ts * 1).format('YYYY' + split +'MM' + split + 'DD HH:mm');
  },
  
  NumberFormat: (ts) => {
    if (!ts && ts != 0) return '';
		return ts.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  },

  PhoneDesensitization: (phone) => {
    if (!phone) return '';
    let pat=/(\d{3})\d*(\d{4})/;
    let b = phone.replace(pat,'$1****$2');
    return b;
  }
}
