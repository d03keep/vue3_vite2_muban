import {getWebsocketAuth} from "@/http/apis/common";

/**允许重连次数*/
const TIMES = 20

/**心跳间隔时间*/
const HEART_TIME = 10000

export type Auth = {
    gateway: string, // WebSocket 服务器的 URL，可能是 ws:// 或者 wss://
    secret: string   // "连接 WebSocket 时需要传递的 Protocol 参数"
}

export type authRequestParams = {
    room_id: number,
    request_url: string,
    user_id?: string,
    token?: string
}

class Socket {
    socket: WebSocket | null;
    private params: authRequestParams;
    private timer: any;
    private all: Map<string, any>;
    times: number;
    heartTimes: number;
    private heartTimer: any;
    private readonly duration: number;
    connected: boolean;
    isOwnClose: boolean;
    private static instance: Socket;

    constructor() {
        //单例模式
        if (!Socket.instance) {
            Socket.instance = this
        }

        this.params = {request_url: '', room_id: 0}

        this.all = new Map()

        this.socket = null

        // 定时器
        this.timer = null

        // 重连次数
        this.times = 0

        // 心跳次数
        this.heartTimes = 0

        // 心跳定时器
        this.heartTimer = null

        // 重连间隔
        this.duration = 2000

        // 链接状态
        this.connected = false

        // 是否主动 关闭链接
        this.isOwnClose = false

        return Socket.instance
    }

    async connectSocket(params:authRequestParams, callBack?:Function) {
        // 初始化状态
        this.isOwnClose = false
        this.connected = false
        this.params = params

        const auth:Auth = await getWebsocketAuth(params)

        // 自动调用
        this.socket = auth.secret ? new WebSocket(auth.gateway, auth.secret) : new WebSocket(auth.gateway)

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)

                /**处理返回消息*/
                this.heartbeatResult()

                this.emit('message', data)
            } catch (err) {
                console.log('解析报错：', err)
            }
        }

        /**监听错误消息 重新链接*/
        this.socket.onerror = this._handleOnError

        /**监听关闭事件 如果不是主动关闭则重新链接*/
        this.socket.onclose = this._handleOnClose

        // 打开链接
        this.socket.onopen = async () => {
            // 0: 表示正在链接
            // 1: 表示链接成功,可以通信了
            // 2: 表示链接正在关闭
            // 3: 表示链接已经关闭, 或者打开链接失败
            if (this.socket?.readyState === 1) {
                this.connected = true
                callBack && callBack(this)
            }
        }
    }

    // error 事件
    private _handleOnError = (err:any) => {
        console.log('服务端 socket onerror 事件', err)

        this.connected = false

        /**如果不是自己关闭并且没有在链接中则重连*/
        this.resetConnect()

        this.emit('error', err)
    }

    // close 事件
    private _handleOnClose = (err:any) => {
        console.log('服务端 socket onclose 事件', err)

        this.connected = false

        if (!this.isOwnClose) {
            this.resetConnect()
        }

        this.emit('close')
    }

    // 等待上一次链接返回结果之后 再重连
    private resetConnect = () => {
        /**主动关闭当前链接*/
        this.close()

        const _duration = this.duration + this.times * 1000

        this.timer = setTimeout(() => {
            this.times++

            console.log('重连次数', this.times, '间隔', _duration)

            if (this.connected || this.socket) return false;

            /**重连次数超过最大次数 警告*/
            if (this.times >= TIMES) {
                // 服务器异常
                this.emit('error', {msg: '链接出错。断开链接'})
                console.log('重连次数超过最大次数', TIMES, '客户端主动断开链接')
                this.connected = false
                this.clearTimer(this.timer)
                return;
            }

            // 如果没有链接 初始化socket
            this.connectSocket(this.params).then()

        }, _duration)
    }

    // 发送消息 {msg: 'asdsd', code: 2}
    send = async (data:{[propName: string]: any} = {}) => {
        let timer:any = null

        if (this.connected) {
            this.times = 0
            !!this.socket && this.socket.send(JSON.stringify(data))
        } else {
            // 这个定时器 防止重复点击造成定时器叠加
            timer = setTimeout(() => {
                this.clearTimer(timer)

                // 如果堆栈中没有该任务 就将 事件放入到堆栈当中等待重连后执行 [{type: 186, params: {}}]
                // let assignment = task.find(item => item.type === parseInt(type))
                // if (!assignment) {
                //     task.push({type: parseInt(type), params: data})
                // }

                this.resetConnect()
            }, 50)
        }
    }

    private clearTimer(timer = this.timer) {
        if (timer) {
            clearTimeout(timer)
            clearInterval(timer)
            this.timer = null
        }
    }

    on(type:string, handler:Function) {
        const handlers = this.all.get(type)
        if (handlers) {
            handlers.push(handler)
        } else {
            this.all.set(type, [handler])
        }
    }

    private emit(type:string, evt?:any) {
        let handlers:Function[] = this.all.get(type)
        if (handlers) {
            handlers
                .slice()
                .map((handler) => {
                    handler(evt)
                })
        }

        handlers = this.all.get('*')
        if (handlers) {
            handlers
                .slice()
                .map((handler) => handler(type, evt))
        }
    }

    // 关闭链接
    public close() {
        this.clearTimer()
        // 停止心跳
        this.clearTimer(this.heartTimer)
        this.isOwnClose = true              // 前端关闭socket
        this.connected = false              // 更新链接状态
        this.all = new Map()
        this.socket && this.socket.close()
        this.socket = null
    }

    heartbeat() {
        this.clearTimer(this.heartTimer)

        this.heartTimer = setInterval(() => {
            console.log('在吗?')
            this.heartTimes++

            if (this.heartTimes >= 10) {
                this.emit('error', {msg: '已和服务器断开链接'})
                console.log('已和服务器断开链接')

                this.clearTimer(this.heartTimer)
                this.heartTimes = 0
                this.close()

                return;
            }

            this.send({type: 'pong'}).then(r => console.log(r))
        }, HEART_TIME)
    }


    heartbeatResult() {
        console.log('在')
        this.heartTimes = 0
    }
}

export default Socket
