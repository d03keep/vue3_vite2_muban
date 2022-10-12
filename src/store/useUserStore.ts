import { defineStore } from 'pinia'
import { userState, USER } from "@/store/types";

export const useUserStore = defineStore(USER, {
    state: ():userState => ({
        account: "",
        avatar: "",
        id: 3489324,
        nick_name: "",
        token: ""
    }),

    // 开启数据缓存
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage
            }
        ]
    }
})

