<template>
    <modal v-show="visible" title="Бронирование" @close="visible = false">
        <div slot="body" class="booking-form">
            <form @keypress.enter="book">
                <section class="booking-form__info-fields">
                    <FormField
                        v-model="date"
                        label="Дата"
                        type="date"
                        :bold-label="false"
                        @change="updateAvailableTables"
                    />
                    <div class="time-slider">
                        <FormField
                            v-model="singleTime"
                            label="Время начала"
                            type="select"
                            :options="timeListWithHiddenPastTimes"
                            :bold-label="false"
                            :with-null-option="false"
                            @change="updateAvailableTables"
                        />
                        <FormField
                            v-if="booking.persons >= 6"
                            v-model="rangeTime"
                            label="Время окончания"
                            type="select"
                            :options="rangeTimeList"
                            :bold-label="false"
                            :with-null-option="false"
                            @change="updateAvailableTables"
                        />
                    </div>
                    <FormField
                        v-model="booking.persons"
                        label="Количество человек"
                        type="select"
                        :options="peopleOptions"
                        :bold-label="false"
                        @change="handleChangePersons"
                    />
                    <FormField
                        v-model="tableNumber"
                        v-loading="optionsLoading"
                        label="Номер стола"
                        type="select"
                        :options="tableOptions"
                        :bold-label="false"
                    />
                </section>
                <section class="booking-form__person-fields">
                    <FormField
                        v-model="booking.guest.name"
                        label="ФИО"
                        type="text"
                        placeholder="Введите имя гостя"
                    />
                    <div></div>
                    <FormField
                        v-model="booking.guest.phone"
                        label="Телефон"
                        type="tel"
                        placeholder="+7"
                    />
                    <FormField
                        v-model="booking.guest.email"
                        :required="true"
                        label="Email"
                        type="email"
                        placeholder="example@mail.ru"
                    />
                </section>
                <section class="booking-form__comment">
                    <FormField
                        v-model="booking.comment"
                        label="Комментарий"
                        type="textarea"
                        placeholder="Добавить комментарий"
                        :required="false"
                    />
                </section>
            </form>
        </div>
        <div slot="footer" class="booking-footer">
            <button
                :disabled="bookingLoading"
                :class="{ success: Boolean(booking.id) }"
                @click="book"
            >
                {{ booking.id ? 'Сохранить' : 'Бронировать' }}
            </button>
            <button v-if="isNotStarted" @click="startBooking">
                Гость пришёл
            </button>
            <button @click="visible = false">
                Закрыть
            </button>
            <button
                v-if="booking.id"
                class="flex-last-item danger"
                @click="removeBooking"
            >
                Удалить
            </button>
        </div>
    </modal>
</template>

<script>
/* eslint-disable */

import moment from 'moment'
import { conformToMask } from 'vue-text-mask'
import Modal from './Modal'
import FormField from './FormField'
import SupraSlider, { ALL_TIMES } from './TimeSlider'

export function conformTelToMask(tel) {
    return conformToMask(tel, PHONE_MASK).conformedValue
}

const STATUSES = {
    ACTIVE: 0,
    CLOSE: 1,
    CANCELLED: 2,
    STARTED: 3
}

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

export default {
    name: 'BookingModal',
    components: { SupraSlider, FormField, Modal },
    data() {
        return {
            bookingLoading: false,
            optionsLoading: false,
            visible: false,
            date: '2019-06-20',
            rangeTime: '13:30',
            singleTime: '12:00',
            hall: 1,
            tableNumber: null,
            combineWithTables: [],
            booking: {
                id: null,
                persons: 2,
                comment: '',
                table_ids: [],
                table_numbers: [],
                guest: {
                    name: '',
                    phone: '',
                    email: ''
                }
            },
            ALL_TIMES: ALL_TIMES,
            peopleOptions: [
                { text: 1, value: 1 },
                { text: 2, value: 2 },
                { text: 3, value: 3 },
                { text: 4, value: 4 },
                { text: 5, value: 5 },
                { text: 6, value: 6 },
                { text: 7, value: 7 },
                { text: 8, value: 8 },
                { text: 9, value: 9 },
                { text: 10, value: 10 },
                { text: 11, value: 11 },
                { text: 12, value: 12 },
                { text: 13, value: 13 },
                { text: 14, value: 14 },
                { text: 15, value: 15 }
            ],
            hallOptions: [
                { text: 1, value: 1 },
                { text: 2, value: 2 }
            ],
            tableOptions: [],
            combineOptions: [
                { text: 'Не выбрано', value: [] },
                { text: 2, value: 2 },
                { text: 3, value: 3 }
            ]
        }
    },
    computed: {
        rangeTimeList() {
            const index = this.timeList.findIndex(
                i => i.text === this.singleTime
            )
            const times = Object.values(this.ALL_TIMES).map(val => ({
                text: val,
                value: val
            }))
            return times.slice(index + 3) // 3 is equal to 1:30 hours (minimal booking time)
        },
        timeList() {
            const times = Object.values(this.ALL_TIMES).map(val => ({
                text: val,
                value: val
            }))
            return times.slice(0, times.length - 3)
        },
        timeListWithHiddenPastTimes() {
            return this.timeList.filter(i => {
                return moment(this.date)
                    .hours(i.text.substring(0, 2))
                    .minutes(i.text.substring(3, 6))
                    .isSameOrAfter(moment())
            })
        },
        isNotStarted() {
            return this.booking.id && this.booking.status !== STATUSES.STARTED
        }
    },
    watch: {
        singleTime(newTime) {
            if (
                moment()
                    .hours(newTime.substring(0, 2))
                    .minutes(newTime.substring(3, 6))
                    .isSameOrAfter(
                        moment()
                            .hours(this.rangeTime.substring(0, 2))
                            .minutes(this.rangeTime.substring(3, 6))
                    ) ||
                this.booking.persons < 6
            )
                this.rangeTime = moment()
                    .hours(newTime.substring(0, 2))
                    .minutes(newTime.substring(3, 6))
                    .add(1, 'hour')
                    .add(30, 'minute')
                    .format('HH:mm')
        }
    },
    methods: {
        handleChangePersons() {
            this.updateAvailableTables()
        },
        async refreshBookingData() {
            const res = await this.$axios.$get(
                `/api/reserve/${this.booking.id}/`
            )
            this.booking = res
        },
        clear() {
            this.tableNumber = null
            this.date = this.$store.state.currentDate
            this.booking = {
                id: null,
                persons: 2,
                comment: '',
                table_ids: [],
                guest: {
                    name: '',
                    phone: '',
                    email: ''
                }
            }
        },
        async updateAvailableTables() {
            if (!this.date) return
            this.optionsLoading = true
            const time =
                parseInt(this.booking.persons) < 6
                    ? this.singleTime
                    : this.rangeTime
            const tables = await this.$axios.$get(
                `/api/place/1/table/free/?datetime=${moment(this.date)
                    .hour(time.substring(0, 2))
                    .minutes(time.substring(3, 6))
                    .utcOffset(0, true)
                    .format('YYYY-MM-DDTHH:mm')}&persons=${
                    this.booking.persons
                }`
            )
            const tableOptions = tables.map(table => ({
                text: table.numbers.join('+'),
                value: table.ids
            }))
            if (this.booking.table_ids.length > 0) {
                tableOptions.unshift({
                    text: this.booking.table_numbers.join('+'),
                    value: this.booking.table_ids
                })
            }
            this.tableOptions = tableOptions.sort(function(a, b) {
                if (a.text > b.text) {
                    return 1
                }
                if (a.text < b.text) {
                    return -1
                }
                return 0
            })
            if (
                tableOptions.findIndex(
                    item => item.value.join(',') === this.tableNumber + ''
                ) === -1
            ) {
                this.tableNumber = null
            }
            this.optionsLoading = false
        },
        async book() {
            this.bookingLoading = true
            const body = this.serializeBooking()
            const res = await this.$axios.$post(`/api/place/1/reserve/`, body)
            if (res) {
                this.$emit('successBooking', res)
                this.visible = false
            }
            this.bookingLoading = false
        },
        serializeBooking() {
            let datetime, endDatetime
            if (parseInt(this.booking.persons) < 6) {
                const time = this.singleTime
                endDatetime = null
                datetime = moment(this.date)
                    .hour(time.substring(0, 2))
                    .minutes(time.substring(3, 6))
                    .utcOffset(0, true)
                    .format('YYYY-MM-DDTHH:mm')
            } else {
                const startTime = this.singleTime
                const endTime = this.rangeTime
                datetime = moment(this.date)
                    .hour(startTime.substring(0, 2))
                    .minutes(startTime.substring(3, 6))
                    .utcOffset(0, true)
                    .format('YYYY-MM-DDTHH:mm')
                endDatetime = moment(this.date)
                    .hour(endTime.substring(0, 2))
                    .minutes(endTime.substring(3, 6))
                    .utcOffset(0, true)
                    .format('YYYY-MM-DDTHH:mm')
            }
            const body = {
                id: this.booking.id,
                datetime: datetime,
                end_datetime: endDatetime,
                table_ids:
                    this.tableNumber === null
                        ? null
                        : ('' + this.tableNumber).split(','),
                persons: this.booking.persons,
                comment: this.booking.comment,
                guest: {
                    name: this.booking.guest.name,
                    phone: this.booking.guest.phone,
                    email: this.booking.guest.email
                }
            }
            return body
        },
        async preview(booking) {
            this.clear()
            this.booking = {
                id: booking.id,
                persons: booking.persons,
                comment: booking.comment,
                table_ids: booking.table_ids,
                table_numbers: booking.table_numbers,
                guest: {
                    ...booking.guest,
                    phone: conformTelToMask(booking.guest.phone)
                },
                status: booking.status
            }
            const startTime = moment(booking.datetime).format('HH:mm')
            const endTime = moment(booking.end_datetime).format('HH:mm')
            this.singleTime = startTime
            this.rangeTime = endTime
            this.visible = true
            await this.updateAvailableTables()
            this.tableNumber = booking.table_ids
        },
        async open(time = null, tableId = null, date = null) {
            this.clear()
            if (date) this.date = date
            if (time) {
                this.singleTime = time
                this.rangeTime = moment()
                    .hours(time.substring(0, 2))
                    .minutes(30)
                    .add(1, 'hour')
                    .format('HH:mm')
            } else {
                const startTime = moment().isBefore(moment().hour(12))
                    ? moment().hour(12)
                    : moment()
                this.singleTime = startTime
                    .minutes(0)
                    .add(1, 'hour')
                    .format('HH:00')
                this.rangeTime = startTime
                    .minutes(30)
                    .add(1, 'hour')
                    .format('HH:mm')
            }
            this.visible = true
            await this.updateAvailableTables()
            this.tableNumber = tableId
        },
        async removeBooking() {
            await this.$confirm(
                'Внимание',
                'Пожалуйста подтвердите удаление бронирования'
            )
            await this.$axios.$post(`/api/reserve/${this.booking.id}/cancel/`)
            this.$message({
                message: 'Бронь успешно отменена',
                type: 'success'
            })
            this.visible = false
            // this.$bus.$emit('refreshData')
        },
        async startBooking() {
            const res = await this.$axios.$post(
                `/api/reserve/${this.booking.id}/start/`
            )
            if (res) {
                this.booking = res
                this.$message({
                    message: 'Бронирование успешно помечено как начатое.',
                    type: 'success'
                })
                // this.$bus.$emit('refreshData')
            }
        }
    }
}
</script>

<style lang="sass" scoped>
.booking-form
    section
        margin-top: 30px
        &:first-child
            margin-top: 0
    .time-slider
        max-width: 435px
    &__info-fields
        display: grid
        grid-template-columns: 168px 168px 1fr
        grid-column-gap: 16px
        grid-row-gap: 19px
        .time-slider
            grid-column: 2/4
            display: grid
            grid-template-columns: 1fr 1fr
            grid-gap: 15px
            width: 100%
            height: 100%
        .combine-tables
            grid-column: 1/4
    &__person-fields
        display: grid
        grid-template-columns: repeat(2, 1fr)
        grid-column-gap: 16px
        grid-row-gap: 9px
        position: relative
        &::before
            content: ''
            width: 15px
            height: 15px
            position: absolute
            left: -32px
            top: 2px
            background: url("~static/icons/person.svg")

    &__comment
        position: relative
        &::before
            content: ''
            width: 15px
            height: 15px
            position: absolute
            left: -32px
            top: 2px
            background: url("~static/icons/comment.svg")

.booking-footer
    display: flex
    button
        margin-right: 16px
    button:last-child
        margin-right: 0
</style>
