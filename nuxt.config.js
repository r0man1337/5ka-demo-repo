/* eslint-disable */
import pkg from './package'

export default {
    mode: 'spa',

    /*
     ** Headers of the page
     */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=1024, maximum-scale=1.0, user-scalable=no' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },

    /*
     ** Global CSS
     */
    css: [
        '@/assets/styles/main.sass',
    ],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '@/plugins/plugins'
    ],

    manifest: {
        name: 'Supra',
        lang: 'ru',
        display: 'standalone', /* Could be "fullscreen", "standalone", "minimal-ui", or "browser" */
        orientation: 'landscape' /* Could be "landscape" or "portrait" */
    },

    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa'
    ],
    /*
     ** Axios module configuration
     */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
        proxy: true
    },
    proxy: {
        '/api': process.env.NODE_ENV !== 'development' ? 'https://supra.devstation.ru' : 'https://supra.devstation.ru',
    },
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    }
}
