/**
 * @Description: socketio客户端脚本
 * @Author: chenchen
 * @Date: 2020-02-25 11:12:27
 * @LastEditors: chenchen
 * @LastEditTime: 2020-02-25 17:48:02
 */

const io = require("socket.io-client")
const { ws_host } = require("./config")
const { logger, deepCopy } = require("./util")
const { replyList } = require("./static")

/**
 * 初始化监听
 *
 * @param { SocketInstance } socketObj socket实例
 */
const initListen = socketObj => {
	socketObj.on("enter", data => {
		logger(process.pid, `enter: ${data}`)
		// 加入房间自动回复
		autoReply()
	})
	socketObj.on("conversation", data => {
		logger(process.pid, `conversation: ${data}`)
	})
	socketObj.on("hangup", data => {
		logger(process.pid, `hangup: ${data}`)
	})
}

/**
 * 自动回复
 *
 * @param { SocketInstance } socketObj socket实例
 * @param { Object } packData 数据包
 */
const autoReply = (socketObj, packData) => {
	let index = 0
	const len = replyList.length
	const interval = setInterval(() => {
		if (index === len) {
			clearInterval(interval)
			// 自动回复完自动挂断
			eventEmitter(socketObj, "hangup", packData)
		} else {
			eventEmitter(socketObj, "conversation", packData, replyList[index])
			index++
		}
	}, 2000)
}

const eventEmitter = (socketObj, eventName, packData, msg = "") => {
	const pack = deepCopy(packData)
	pack.event = eventName
	pack.message = msg
	socketObj.emit(eventName, pack)
}

process.on("message", data => {
	logger(process.pid, data)
	const _data = JSON.parse(data)
	logger(process.pid, `${_data.user_id} be called`)
	let packData = {
		user_id: _data.user_id,
		app_type: "lq",
		uuid: _data.uuid, // 该次通话的 uuid
		msg_type: "signal", // 两种消息类型： signal 通话信令，message 通话内容, error 错误信息
		message: "",
		event: "",
		from: "user" // 信令来源： other 非用户， user 用户 ，server 服务器
	}
	const socketObj = io(ws_host, {
		query: {
			token: _data.client_token
		}
	})
	initListen(socketObj)
	eventEmitter(socketObj, "enter", packData)
})
