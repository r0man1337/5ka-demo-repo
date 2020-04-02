<template>
    <section v-loading="loading" class="container schedule">
        <div class="schedule__topbar">
            <FormField
                v-model="currentDate"
                :width="168"
                type="date"
                @change="refresh"
            />
        </div>
        <div class="schedule__tables">
            <div class="schedule__timebar schedule__timebar_left">
                <template v-for="time in times">
                    <div
                        :key="time"
                        :class="{
                            'current-hour': time + ':00' === currentHour
                        }"
                        class="time"
                    >
                        {{ time + ':00' }}
                    </div>
                    <div
                        :key="time + ':30'"
                        :class="{
                            'current-hour': time + ':30' === currentHour
                        }"
                        class="time"
                    >
                        {{ time + ':30' }}
                    </div>
                </template>
            </div>
            <div
                v-for="(table, index) in schedule"
                :key="table.id"
                class="schedule__table"
                :class="{ 'last-table': index === schedule.length - 1 }"
            >
                <div class="table-caption">
                    <span class="table-caption__name">
                        {{ table.number }}
                    </span>
                    &nbsp;
                    <span class="table-caption__size">
                        {{ table.max_persons }} чел.
                    </span>
                </div>
                <div class="table-bookings">
                    <div
                        v-for="book in table.reserves"
                        :key="book.id"
                        class="table-book-wrapper booked"
                        :class="{
                            'booked-past': isPastBooking(book.datetime)
                        }"
                        :style="{ 'grid-row': calculateGridRows(book) }"
                        @click="handleBookingClick(book)"
                    >
                        <div class="table-book">
                            <div class="table-book__caption">
                                <div class="table-book__heading">
                                    <span class="time"
                                        >{{ getFormattedTime(book.datetime) }}
                                    </span>
                                    <span
                                        v-show="book.guest"
                                        class="guest-name"
                                    >
                                        {{ book.guest.name }}
                                    </span>
                                </div>
                                <div
                                    v-show="book.guest"
                                    class="table-book__tel"
                                >
                                    {{
                                        book.guest.phone
                                            ? conformToMask(book.guest.phone)
                                            : 'Без брони'
                                    }}
                                </div>
                                <div class="table-book__person-count">
                                    {{ book.persons }} чел.
                                </div>
                            </div>
                            <div class="table-book__endtime">
                                {{ getFormattedTime(book.end_datetime) }}
                            </div>
                            <div class="table-book__icons">
                                <SupraIcon
                                    v-if="book.comment.length > 0"
                                    icon="comment"
                                />
                                <SupraIcon
                                    v-if="book.status === 3"
                                    icon="choice"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        v-for="time in table.free_times"
                        :key="time"
                        class="table-book-wrapper available"
                        :style="{
                            'grid-row': `${ALL_TIMES[time]}/${ALL_TIMES[time] +
                                1}`
                        }"
                        @click="
                            handleFreeTimeClick(time, table.id, currentDate)
                        "
                    >
                        <svg width="18" height="18">
                            <path
                                fill="#838EA0"
                                d="M9,1C4.6,1,1,4.6,1,9s3.6,8,8,8s8-3.6,8-8S13.4,1,9,1z M9,15c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6
	S12.3,15,9,15z M10,5H8v3H5v2h3v3h2v-3h3V8h-3V5z"
                            />
                        </svg>
                    </div>
                    <div
                        v-for="time in table.unavailable_times"
                        :key="time"
                        class="table-book-wrapper"
                    ></div>
                </div>
                <div class="table-caption table-caption_bottom">
                    <span class="table-caption__name">
                        {{ table.number }}
                    </span>
                    &nbsp;
                    <span class="table-caption__size">
                        {{ table.max_persons }} чел.
                    </span>
                </div>
            </div>
            <div class="schedule__timebar schedule__timebar_right">
                <template v-for="time in times">
                    <div :key="time" class="time">
                        {{ time + ':00' }}
                    </div>
                    <div :key="time + ':30'" class="time">
                        {{ time + ':30' }}
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { conformToMask } from 'vue-text-mask'
import FormField, { PHONE_MASK } from '../components/FormField'
import { timelineMixin } from '../assets/scripts/mixins'
import SupraIcon from '../components/SupraIcon'

export function conformTelToMask(tel) {
    return conformToMask(tel, PHONE_MASK).conformedValue
}

export default {
    name: 'Timetable',
    components: { SupraIcon, FormField },
    middleware: 'auth',
    mixins: [timelineMixin],
    data() {
        return {
            loading: false,
            currentHour: '10:00'
        }
    },
    computed: {
        ...mapState(['schedule']),
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
        this.refresh()
        this.$bus.$on('refreshData', this.refresh)
    },
    methods: {
        async refresh() {
            if (!this.currentDate) {
                return
            }
            this.loading = true
            await this.$store.dispatch(
                'getScheduleByDate',
                moment(`${this.currentDate}`)
                    .utcOffset(0, true)
                    .format()
            )
            this.loading = false
        },
        setTime() {
            if (parseInt(moment().format('mm')) >= 30) {
                this.currentHour = moment().format('HH:30')
            } else {
                this.currentHour = moment().format('HH:00')
            }
        },
        updateTime() {
            this.setTime()
            this.timeInterval = setInterval(() => {
                this.setTime()
            }, 60000)
        }
    },
    created() {
        this.updateTime()
    },
    beforeDestroy() {
        clearInterval(this.timeInterval)
    }
}
</script>

<style lang="sass">
@import '~assets/styles/variables'

.schedule
    width: 100%
    height: 100%
    display: flex
    flex-direction: column
    &__table
        width: 160px
        &.last-table
            width: 206px
            padding-right: 46px
            .table-bookings
                border-right: 0
            .table-caption
                &::after
                    border: 0
        .table-bookings
            display: grid
            grid-template-columns: 160px
            grid-template-rows: repeat(24, 64px)
            border-right: 1px solid #DEE0E5
            .table-book-wrapper
                border-bottom: 1px solid #DEE0E5
                display: flex
                padding: 0 2px
                &.booked
                    cursor: pointer
                    .table-book
                        position: relative
                        background: $danger-color
                        border-radius: 8px
                        padding: 8px
                        flex: 1
                        display: flex
                        flex-direction: column
                        color: #fff
                        overflow: hidden
                        &__tel, &__person-count
                            font-size: 12px
                        &__icons
                            height: 16px
                            position: absolute
                            bottom: 8px
                            left: 8px
                            svg
                                margin-right: 5px
                                path, polygon
                                    fill: #fff
                        &__endtime
                            position: absolute
                            bottom: 8px
                            right: 8px
                            font-weight: bold
                        &__heading
                            white-space: nowrap
                            font-size: 14px
                            font-weight: bold
                            overflow: hidden
                            text-overflow: ellipsis
                    &-past
                        .table-book
                            background: #EAEBEF
                            color: #A4ABB8
                            &__icons
                                svg
                                    path, polygon
                                        fill: #A4ABB8
                &.available
                    justify-content: center
                    align-items: center
                    cursor: pointer
                    &:hover
                        svg path
                            fill: #FE6808
        .table-caption
            display: flex
            justify-content: center
            align-items: flex-end
            height: 29px
            position: sticky
            background: #F4F5F7
            top: -4px
            z-index: 100
            border-bottom: 1px solid #DEE0E5
            &_bottom
                top: unset
                bottom: -4px
                border-bottom: 0
                &::after
                    top: 0
                    bottom: unset
            &::after
                content: ''
                height: 7px
                width: 1px
                border-right: 1px solid #DEE0E5
                position: absolute
                right: 0
                bottom: 0
            &__name
                font-weight: bold
                font-size: 24px
                color: #000754
            &__size
                font-size: 12px
                margin-bottom: 2px
                color: #6B768A
    &__timebar
        min-width: 46px
        padding-top: 28px
        position: sticky
        z-index: 101
        &_right
            right: -4px
            .time
                border-left: 1px solid #DEE0E5
                padding-left: 10px
                &::after
                    content: ''
                    height: 1px
                    width: 7px
                    border-top: 1px solid #DEE0E5
                    position: absolute
                    left: 0
                    top: 7px
        &_left
            left: -5px
            .time
                border-right: 1px solid #DEE0E5
                &.current-hour
                    &::before
                        content: ''
                        height: 2px
                        background: #40ac75
                        width: calc(100vw - 98px)
                        position: absolute
                        top: 7px
                        left: 45px
                &::after
                    content: ''
                    height: 1px
                    width: 7px
                    border-top: 1px solid #DEE0E5
                    position: absolute
                    right: 0
                    top: 7px

        .time
            height: 71px
            margin-top: -7px
            color: rgba(107, 118, 138, 0.26)
            font-size: 12px
            position: relative
            background: #F4F5F7

    &__tables
        display: flex
        overflow: auto
        padding: 4px
        min-height: 664px
        flex: 1
    &__topbar
        display: flex
        height: 32px
        margin-bottom: 6px
        width: 100%
        padding: 0 4px
</style>
