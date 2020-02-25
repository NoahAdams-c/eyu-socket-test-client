/**
 * @Description: 工具
 * @Author: chenchen
 * @Date: 2020-02-25 16:04:49
 * @LastEditors: chenchen
 * @LastEditTime: 2020-02-25 17:06:59
 */

module.exports = {
	/**
	 * 打印方法
	 *
	 * @param {String} pre 前缀
	 * @param {String} log 日志内容
	 */
	logger: (pre = "", log = "") => {
		const timeStr = new Date().toLocaleString()
		console.log(`\x1B[32m[${pre} ${timeStr}]: \x1B[0m%s\n`, log)
	},

	/**
	 * 深拷贝
	 *
	 * @param {Object} obj 原始对象
	 */
	deepCopy: obj => {
		return JSON.parse(JSON.stringify(obj))
	}
}
