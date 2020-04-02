<template>
    <section class="container tablemap">
        <div class="tablemap__timeline">
            <FormField
                v-model="currentDate"
                :width="168"
                type="date"
                @change="handleChangeDate"
            />
            <SupraSlider
                v-model="time"
                class="tablemap__slider"
                @change="refreshTableMap"
            />
        </div>
        <div
            v-loading="loading"
            class="tablemap__background"
            :style="{
                '--var-map-width': mapWidth,
                '--var-map-height': mapHeight
            }"
        >
            <div
                v-for="table in mapTables"
                :key="table.id"
                class="tablemap__table"
                :class="{
                    tablemap__table_booked: table.status === 1,
                    tablemap__until: table.next_time !== null
                }"
                :style="{
                    'grid-row': `${table.y + 1}/${table.y + table.height + 1}`,
                    'grid-column': `${table.x + 1}/${table.x + table.width + 1}`
                }"
                @click="handleTableClick(table)"
            >
                <div class="tablemap__table-number">{{ table.number }}</div>
                <div class="tablemap__seats">{{ table.max_persons }}</div>
                <div v-if="table.next_time" class="tablemap__next-time">
                    {{ formatTime(table.next_time) }}
                </div>
            </div>
        </div>
        <TableDayScheduleModal ref="tableDayScheduleModal" />
    </section>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import SupraSlider from '../components/TimeSlider'
import FormField from '../components/FormField'
import TableDayScheduleModal from '../components/TableDayScheduleModal'

const STATUS_TABLE_BOOKED = 1

export default {
    name: 'Index',
    components: { TableDayScheduleModal, SupraSlider, FormField },
    middleware: 'auth',
    data() {
        return {
            time: '12:00',
            loading: false
        }
    },
    computed: {
        ...mapState(['mapTables', 'mapWidth', 'mapHeight']),
        currentDate: {
            set(date) {
                this.$store.commit('SET_CURRENT_DATE', date)
            },
            get() {
                return this.$store.state.currentDate
            }
        }
    },
    mounted() {
        // TODO: ближайшее доступное время
        // set интервал на минуту: проверка каждую минуту
        this.setTime()
        this.refreshTableMap()
        this.$bus.$on('refreshData', this.refreshTableMap)
        setInterval(() => {
            this.setTime()
        }, 60000)
    },
    methods: {
        setTime() {
            const currentTime = moment()
            const minutes = parseInt(currentTime.format('mm'))
            if (minutes < 30) {
                this.time = currentTime.minutes(30).format('HH:mm')
            } else {
                this.time = currentTime
                    .minutes(0)
                    .add(1, 'hour')
                    .format('HH:mm')
            }
        },
        formatTime(time) {
            return moment(time).format('до HH:mm')
        },
        handleTableClick(table) {
            if (table.status !== STATUS_TABLE_BOOKED) {
                this.$parent.$emit('newBooking', {
                    date: this.currentDate,
                    time: this.time,
                    id: table.id.toString()
                })
            } else {
                this.$refs.tableDayScheduleModal.open(
                    table.id,
                    this.currentDate
                )
            }
            window.scrollTo(0, 0)
        },
        handleChangeDate() {
            const today = moment()
            const selectedDay = moment(this.currentDate)
            if (today.diff(selectedDay) < 0) {
                this.time = '12:00'
            } else {
                this.time = moment()
                    .minutes(0)
                    .add(1, 'hour')
                    .add(30, 'minutes')
                    .format('HH:mm')
            }
            this.refreshTableMap()
        },
        async refreshTableMap() {
            if (!this.currentDate) {
                return
            }
            this.loading = true
            await this.$store.dispatch(
                'getTableMapByDatetime',
                moment(`${this.currentDate}`)
                    .hour(this.time.substring(0, 2))
                    .minutes(this.time.substring(3, 6))
                    .utcOffset(0, true)
                    .format()
            )
            this.loading = false
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~assets/styles/variables'

.tablemap
    min-width: 1024px
    max-width: 100vw

    &__slider
        flex: 1
        margin: 0px 20px !important
        width: auto

    &__table
        width: 100%
        height: 100%
        border-radius: 8px
        background: $success-color
        color: #fff
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        position: relative
        &_booked
            background: $danger-color
        &-number
            margin-top: -4px
            font-size: 24px
            font-weight: bold
    &__seats
        font-size: 13px
        position: relative
        margin-top: -2px
        margin-left: 14px
        font-weight: 600
        &::before
            content: ''
            width: 13px
            height: 13px
            position: absolute
            left: -16px
            top: 2px
            background: url("~static/icons/person_white.svg")
    &__until
        border-radius: 8px 8px 0 0
    &__next-time
        content: 'до 11:00'
        white-space: nowrap
        position: absolute
        bottom: 0
        transform: translateY(60%)
        color: #000754
        font-size: 10px
        background: #fff
        width: 100%
        text-align: center
        border-radius: 0 0 8px 8px
    &__background
        --var-map-width: 0
        --var-map-height: 0
        min-height: 646px
        min-width: 1016px
        width: 1016px
        background-size: contain
        background-image: url("~static/icons/fon_supra.svg")
        background-position: top center
        background-repeat: no-repeat
        padding: 4px
        display: grid
        grid-template-columns: repeat(var(--var-map-width), 56px)
        grid-template-rows: repeat(var(--var-map-height), 53px)
        grid-gap: 12px

    &__timeline
        display: flex
        height: 32px
        margin-bottom: 14px
        width: 100%
        padding: 0 4px
</style>
