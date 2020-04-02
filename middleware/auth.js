import store from 'vuex'

export default async function (ctx) {
    const key = localStorage.getItem('token')
    if (key) {
        await ctx.store.dispatch('login', key)
    }
    if(!ctx.store.state.isAuthenticated) {
        return ctx.redirect('/login')
    }
}
