import Vue from 'vue'
import { VueHammer } from 'vue2-hammer'
import {Loading, Notification, Message, MessageBox} from 'element-ui'
import { conformToMask } from 'vue-text-mask'
import Modal from "../components/Modal"
import VueNativeSock from 'vue-native-websocket'

export const PHONE_MASK = [
    '+',
    '7',
    ' ',
    /[9]/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
]

VueHammer.config.swipe = {
    direction: 6,
    pointers: 2
}

const eventBus = {}

eventBus.install = function (Vue) {
    Vue.prototype.$bus = new Vue()
}

Vue.use(eventBus)
Vue.use(VueHammer)
Vue.use(Loading)
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$confirm = function (title, message) {
    return new Promise((resolve, reject) => {
        const dialog = new Vue({
            methods: {
                closeHandler(fn, arg) {
                    return function() {
                        fn(arg);
                        dialog.$destroy();
                        dialog.$el.remove();
                    };
                }
            },
            render(h) {
                return h(Modal, {
                    props: {
                        title,
                        message,
                    },
                    on: {
                        confirm: this.closeHandler(resolve),
                        close: this.closeHandler(reject)
                    }
                });
            }
        }).$mount();
        document.body.appendChild(dialog.$el);
    });
}

Vue.prototype.$toMaskedPhone = function (tel, guide = true) {
    return conformToMask(tel, PHONE_MASK, {guide: guide}).conformedValue
}

export default function ({ $axios, app }) {
    $axios.onResponseError((error) => {
        console.log('axios error', error)
        Vue.prototype.$notify({
            group: 'main',
            type: 'error',
            title: 'Ошибка',
            message: error.response.data.message,
            duration: 15000
        })
        return error
    })
}

Vue.use(VueNativeSock, process.env.NODE_ENV === 'development' ? 'wss://supra.devstation.ru/ws/' : 'wss://reserve.supravl.ru/ws/', {
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    format: 'json'
})
