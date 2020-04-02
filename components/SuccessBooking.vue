<template>
    <modal
        v-show="visible"
        title="Бронирование добавлено"
        @close="visible = false"
    >
        <div slot="body">
            <p class="book-info">
                <span class="label">Дата: </span>
                <span>{{ bookingDuration }}</span>
            </p>
            <p class="book-info">
                <span class="label">Номер стола: </span>
                <span>{{ tableNumber }}</span>
            </p>
            <p class="book-info">
                <span class="label">Кол-во гостей: </span>
                <span>{{ booking.persons }}</span>
            </p>
            <p class="book-info">
                <span class="label">Гость: </span>
                <span
                    >{{ booking.guest.name }},
                    {{ maskedPhone }}
                    {{
                        booking.guest.email ? ', ' + booking.guest.email : ''
                    }}</span
                >
            </p>
            <p class="book-info">
                <span class="label">Комментарий: </span>
                <span>{{ booking.comment }}</span>
            </p>
        </div>
        <div slot="footer">
            <button class="flex-last-item" @click="visible = false">
                OK
            </button>
        </div>
    </modal>
</template>

<script>
import moment from 'moment'
import Modal from './Modal'

export default {
    name: 'SuccessBooking',
    components: { Modal },
    data() {
        return {
            visible: false,
            booking: {
                table_numbers: [],
                datetime: '',
                end_datetime: '',
                persons: 0,
                comment: '',
                guest: {
                    name: '',
                    phone: '',
                    email: ''
                }
            }
        }
    },
    computed: {
        tableNumber() {
            return this.booking.table_numbers.join(' + ')
        },
        bookingDuration() {
            return `${moment(this.booking.datetime).format(
                'DD.MM.YYYY с HH:mm'
            )} до ${moment(this.booking.end_datetime).format('HH:mm')}`
        },
        maskedPhone() {
            return this.$toMaskedPhone(this.booking.guest.phone)
        }
    },
    methods: {
        open(booking) {
            this.booking = booking
            this.visible = true
        }
    }
}
</script>

<style lang="sass" scoped>
.book-info
    display: flex
    margin-bottom: 5px
    align-items: center
    color: #000754
    .label
        text-transform: none
        color: #000754
        font-size: 16px
        font-weight: bold
        margin-right: 5px
</style>
