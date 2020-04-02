<template>
    <div class="page">
        <header class="header-bar">
            <nuxt-link v-show="isAuth" to="/timetable" class="timetable-link">
                <svg width="18" height="18">
                    <path
                        :fill="linkColor('timetable')"
                        d="M2,2v14h14V2H2z M4,4h4v4H4V4z M4,14v-4h4v4H4z M14,14h-4v-4h4V14z M14,8h-4V4h4V8z"
                    />
                </svg>
                Таблица
            </nuxt-link>
            <nuxt-link v-show="isAuth" to="/" class="map-link">
                <svg width="18" height="18">
                    <path
                        :fill="linkColor('index')"
                        d="M13,16H5c-1.7,0-3-1.3-3-3V5c0-1.7,1.3-3,3-3h8c1.7,0,3,1.3,3,3v8C16,14.7,14.7,16,13,16z M5,4C4.4,4,4,4.4,4,5v8c0,0.6,0.4,1,1,1h8c0.6,0,1-0.4,1-1V5c0-0.6-0.4-1-1-1H5z"
                    />
                </svg>
                Карта столов
            </nuxt-link>
            <GuestSelect
                v-show="isAuth"
                placeholder="Поиск по телефону"
                :is-phone="true"
                :maxlength="15"
                @selectedGuest="handleBookingPreview"
            />
            <GuestSelect
                v-show="isAuth"
                placeholder="Поиск по имени"
                @selectedGuest="handleBookingPreview"
            />
            <nuxt-link to="/" class="header-logotype">
                <img class="header-bar__logo" src="icons/supra_logo.svg" />
            </nuxt-link>
            <button
                v-show="isAuth"
                class="button__fast-booking"
                @click="$refs.bookingModal.open()"
            >
                <img class="icon icon__fast-booking" src="/icons/booking.svg" />
                Быстрое бронирование
            </button>
            <div v-show="isAuth" class="logout" @click="logout">
                <img src="icons/logout.png" /> Выход
            </div>
        </header>
        <main>
            <nuxt
                @newBooking="handleNewBooking($event)"
                @bookingPreview="handleBookingPreview($event)"
            />
            <BookingModal
                ref="bookingModal"
                @successBooking="handleSuccessBooking"
            />
            <SuccessBooking ref="successBooking" />
            <GuestModal ref="guestModal" />
        </main>
    </div>
</template>
<script>
import BookingModal from '../components/BookingModal'
import GuestSelect from '../components/GuestSelect'
import SuccessBooking from '../components/SuccessBooking'
import GuestModal from '../components/GuestModal'

export default {
    name: 'DefaultLayout',
    components: {
        GuestModal,
        SuccessBooking,
        GuestSelect,
        BookingModal
    },
    data() {
        return {}
    },
    mounted() {
        this.$bus.$on('newBooking', this.handleNewBooking)
        this.$bus.$on('previewBooking', this.handleBookingPreview)
        this.$bus.$on('successBooking', this.handleSuccessBooking)
        this.$bus.$on('refresh', this.refresh)
        this.$options.sockets.onmessage = data => {
            console.log('Message received', data)
            const event = JSON.parse(data.data)
            if (event.message === 'reserve_created') {
                this.$message({
                    message: 'Поступило новое бронирование.',
                    type: 'success'
                })
            }
            this.$bus.$emit('refreshData')
        }
    },
    computed: {
        isAuth() {
            return this.$store.state.isAuthenticated
        }
    },
    methods: {
        async logout() {
            await this.$confirm(
                'Выход из системы',
                'Вы уверены что хотите выйти из системы?'
            )
            await this.$store.dispatch('logout')
        },
        handleSuccessBooking(event) {
            this.$refs.successBooking.open(event)
            // this.$bus.$emit('refreshData')
        },
        handleBookingPreview(booking) {
            // eslint-disable-next-line no-console
            console.log(booking)
            this.$refs.bookingModal.preview(booking)
            window.scrollTo(0, 0)
        },
        handleNewBooking(params) {
            this.$refs.bookingModal.open(params.time, params.id, params.date)
            window.scrollTo(0, 0)
        },
        linkColor(route) {
            return this.$nuxt.$route.name !== route ? '#6B768A' : '#000754'
        }
    }
}
</script>
<style lang="sass">
@import 'element-ui/lib/theme-chalk/loading.css'
@import 'element-ui/lib/theme-chalk/notification.css'
@import 'element-ui/lib/theme-chalk/message.css'

.header-logotype
    position: absolute
    text-align: center
    width: 80px
    height: 56px
    left: calc(50% - 40px)
    display: block
    @media (max-width: 1366px)
        display: none


.header-bar
    min-height: 64px
    height: 64px
    width: 100vw
    display: flex
    justify-content: flex-start
    padding: 0 4px
    align-items: center
    background: #fff
    z-index: 10
    .logout
        cursor: pointer
        display: flex
        align-items: center
        height: 22px
        margin-left: 15px
        color: #6B768A
        img
            height: 100%
            margin-right: 5px
    a
        color: #6B768A
        font-weight: bold
    > *
        margin-right: 4px
    > *:last-child
        margin-right: 0
    &__logo
        height: 56px
    .timetable-link, .map-link
        padding: 7px 10px
        display: flex
        align-items: center
        justify-content: center
        text-decoration: none
        border-radius: 8px
        transition: all 0.2s ease
        &:hover
            color: #000754
            background: rgba(0, 7, 84, 0.30)
            svg path
                fill: #000754 !important
        &.nuxt-link-exact-active
            color: #000754
            background: rgba(0, 7, 84, 0.30)
        > svg
            margin-right: 8px

.button__fast-booking
    padding: 0px 8px
    justify-self: flex-end
    margin: 0 0 0 auto
main
    padding: 8px 4px 4px
    margin: 0 auto 0
    display: flex
    flex-direction: column
    align-items: center
    width: 100vw
.page
    min-width: 1024px
    min-height: 768px
    width: 100vw
    margin: 0 auto
    display: flex
    flex-direction: column
    position: relative
    -webkit-overflow-scrolling: touch

html, body
    height: 100%
    -webkit-user-select: none
    -webkit-tap-highlight-color: transparent
    -webkit-touch-callout: none
    background: #F4F5F7

@media screen and (orientation: portrait)
    html
        -webkit-transform: translateY(-100%) rotate(90deg)
        transform: translateY(-100%) rotate(90deg)
        -webkit-transform-origin: left bottom
        transform-origin: left bottom

html, textarea
    font-family: 'Helvetica Neue', Arial, sans-serif
    font-size: 14px
    word-spacing: 1px
    -ms-text-size-adjust: 100%
    -webkit-text-size-adjust: 100%
    -moz-osx-font-smoothing: grayscale
    -webkit-font-smoothing: antialiased
    box-sizing: border-box

*,
*:before,
*:after
    box-sizing: border-box
    margin: 0
</style>
