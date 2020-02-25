/**
 * @Description: 授权模块
 * @Author: chenchen
 * @Date: 2020-02-25 13:17:33
 * @LastEditors: chenchen
 * @LastEditTime: 2020-02-25 17:47:33
 */
const { baseAjax } = require("cc-vue-util")
const { api_host } = require("./config")

const $ajax = baseAjax(api_host)

module.exports = {
	/**
	 * 获取服务端token
	 */
	getServerAccessToken: async () => {
		const { access_token } = await $ajax.doPost("/authorize/secret", {
			app_type: "lq",
			short_secret: "UJ5ywVr"
		})
		return access_token
	},

	/**
	 * 获取客户端端token
	 */
	getClientAccessToken: async (user_id, server_token) => {
		const { code } = await $ajax.doPost(
			"/authorize/code",
			{
				user_id: user_id,
				app_type: "lq"
			},
			{
				headers: {
					authorization: server_token,
					"Content-Type": "application/json"
				}
			}
		)
		const { access_token } = await $ajax.doPost("/authorize/token", {
			app_type: "lq",
			user_id: user_id,
			code: code
		})
		return access_token
	}
}
