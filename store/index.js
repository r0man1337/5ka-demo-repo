/* eslint-disable prettier/prettier */
import moment from 'moment'

const SET_MAP_TABLES = 'SET_MAP_TABLES'
const SET_MAP_HEIGHT = 'SET_MAP_HEIGHT'
const SET_MAP_WIDTH = 'SET_MAP_WIDTH'
const SET_SCHEDULE = 'SET_SCHEDULE'
const SET_SERVER_TIME = 'SET_SERVER_TIME'
const SET_CURRENT_DATE = 'SET_CURRENT_DATE'
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
export const MUTATIONS = {

}

export const state = () => ({
    mapTables: [],
    mapHeight: 0,
    mapWidth: 0,
    schedule: [],
    serverTime: null,
    isAuthenticated: false,
    currentDate: moment().format('YYYY-MM-DD')
})

export const mutations = {
    [SET_MAP_TABLES] (state, mapTables) {
        state.mapTables = mapTables
    },
    [SET_MAP_HEIGHT] (state, mapHeight) {
        state.mapHeight = mapHeight
    },
    [SET_MAP_WIDTH] (state, mapWidth) {
        state.mapWidth = mapWidth
    },
    [SET_SCHEDULE] (state, schedule) {
        state.schedule = schedule
    },
    [SET_SERVER_TIME] (state, time) {
        state.serverTime = time
    },
    [LOGOUT] (state) {
        state.isAuthenticated = false
    },
    [LOGIN] (state) {
        state.isAuthenticated = true
    },
    [SET_CURRENT_DATE] (state, date) {
        state.currentDate = date
    },
}

export const actions = {
    login({state, commit}, key) {
        localStorage.setItem('token', key)
        this.$axios.defaults.headers.common.Authorization = `Bearer ${key}`
        commit('LOGIN')
    },
    logout({state, commit}) {
        localStorage.removeItem('token')
        this.$axios.defaults.headers.common.Authorization = null;
        commit('LOGOUT')
        this.$router.push('/login')
    },
    async getTableMapByDatetime ({ state, commit }, datetime) {
        const res = await this.$axios.$get('/api/scheme/1/map/?datetime='+datetime)
        await commit(SET_MAP_TABLES, res.objects)
        await commit(SET_MAP_WIDTH, res.width)
        await commit(SET_MAP_HEIGHT, res.height)
    },
    async getScheduleByDate ({ state, commit }, date) {
        const res = await this.$axios.$get('/api/scheme/1/table/?date='+date)
        // eslint-disable-next-line no-console
        console.log('res', res)
        await commit(SET_SERVER_TIME, res.datetime_now)
        await commit(SET_SCHEDULE, res.tables)
    }
}

export const getters = {
    doubleCount (state) {
        return 0
    }
}
