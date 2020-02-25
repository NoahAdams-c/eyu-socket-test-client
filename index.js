/**
 * @Description: 程序入口
 * @Author: chenchen
 * @Date: 2020-02-25 10:58:24
 * @LastEditors: chenchen
 * @LastEditTime: 2020-02-25 18:08:47
 */

const app = require("express")()
const child_process = require("child_process")
const body_parser = require("body-parser")
const { getServerAccessToken, getClientAccessToken } = require("./auth")
const { port } = require("./config")

// josn parser
app.use(body_parser.json())

// create server listen
const server = app.listen(port, function() {
	console.log("Listening on port %d\n", server.address().port)
})

let server_token = null

// call_ring router
app.post("/test/ring", async (req, resp) => {
	if (!server_token) {
		// get server access token
		server_token = await getServerAccessToken()
	}
	const body = req.body
	const client_token = await getClientAccessToken(body.user_id, server_token)
	child_process
		.fork("./callInTest.js")
		.send(JSON.stringify(Object.assign(body, { client_token })))
	resp.send({
		status: "ok"
	})
})
