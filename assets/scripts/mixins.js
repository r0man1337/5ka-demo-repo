/* eslint-disable */
import moment from 'moment'
import { mapState } from 'vuex'

export const timelineMixin = {
    data() {
        return {
            times: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            ALL_TIMES: {
                '12:00': 1,
                '12:30': 2,
                '13:00': 3,
                '13:30': 4,
                '14:00': 5,
                '14:30': 6,
                '15:00': 7,
                '15:30': 8,
                '16:00': 9,
                '16:30': 10,
                '17:00': 11,
                '17:30': 12,
                '18:00': 13,
                '18:30': 14,
                '19:00': 15,
                '19:30': 16,
                '20:00': 17,
                '20:30': 18,
                '21:00': 19,
                '21:30': 20,
                '22:00': 21,
                '22:30': 22,
                '23:00': 23,
                '23:30': 24,
                '00:00': 25,
                '00:30': 26,
                '01:00': 27,
                '01:30': 28,
                '02:00': 29
            }
        }
    },
    computed: {
        ...mapState(['serverTime'])
    },
    methods: {
        calculateGridRows(book) {
            const start = moment(book.datetime).format('HH:mm')
            const end = moment(book.end_datetime).format('HH:mm')
            return `${this.ALL_TIMES[start]}/${this.ALL_TIMES[end]}`
        },
        getFormattedTime(datetime) {
            return moment(datetime).format('HH:mm')
        },
        isPastBooking(startDatetime) {
            return moment(startDatetime).isBefore(this.serverTime)
        },
        conformToMask(phone) {
            return this.$toMaskedPhone(phone)
        },
        handleFreeTimeClick(time, id, date = null) {
            this.$bus.$emit('newBooking', {
                date: date,
                time: time,
                id
            })
        },
        handleBookingClick(booking) {
            if (booking.guest === null) {
                return
            }
            this.$bus.$emit('previewBooking', booking)
        },
        handleSuccessBooking(e) {
            this.$bus.$emit('successBooking', e)
            this.refresh()
        }
    }
}
