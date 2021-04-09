/* 
    存储请求接口的 CancelToken (用于终止接口的请求)
    @pending
    { 
        u: (config.url + '&' + config.method),  以 url 拼接为标识
        f: () => {}, CancelToken 函数
    }
*/
export default class CancelTokenPending {
    constructor() {
        // 用于存储每个ajax请求的取消函数和ajax标识
        this.pendings = [];
    }

    // 存储每个ajax请求的取消函数和ajax标识
    ADD_PENGDING(pending) {
        this.pendings.push(pending)
    }
    // 删除重复对应的ajax请求的取消函数和ajax标识
    REMOVE_PENGDING(pending) {
        for (let p = this.pendings.length - 1; p >= 0; p--) {
            if (this.pendings[p].u === pending.u) {
                // 当前请求在数组中存在时执行函数体
                this.pendings[p].f({
                    code: 200,
                    url: this.pendings[p].u
                }); //执行取消操作
                this.pendings.splice(p, 1); //把这条记录从数组中移除
            }
        }
    }
    // 终止所有请求
    REMOVE_PENGDINGS() {
        for (let p = this.pendings.length - 1; p >= 0; p--) {
            this.pendings[p].f({
                code: 200,
                url: this.pendings[p].u
            }); //执行取消操作
            this.pendings.splice(p, 1); //把这条记录从数组中移除
        }
    }
}