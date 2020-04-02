<template>
    <el-select
        :value="transformedQuery"
        class="guest-select"
        loading-text="Загрузка..."
        no-data-text="Нет данных"
        no-match-text="Не найдено"
        filterable
        remote
        :placeholder="placeholder"
        :automatic-dropdown="true"
        :remote-method="searchGuests"
        :loading="loading"
        :maxlength="maxlength"
        @input="handleInput"
        @change="handleGuestSelect"
        @focus="() => searchGuests()"
        @blur="guestQuery = ''"
    >
        <template v-for="guest in guests">
            <el-option
                v-for="reserve in guest.reserves"
                :key="reserve.id"
                :label="guest.name"
                :value="makeValue(guest, reserve)"
            >
                <div class="guest">
                    <div class="guest-info">
                        <span class="guest-info__name">{{ guest.name }}</span>
                        <span class="guest-info__telephone">{{
                            conformToMask(guest.phone)
                        }}</span>
                    </div>
                    <div class="guest-comment">
                        <span class="guest-info__name"
                            >Стол: {{ reserve.table_numbers.join(', ') }}</span
                        >
                        <span class="guest-info__telephone">
                            {{ formatDate(reserve.datetime) }},
                            {{ reserve.persons }}
                            чел.
                        </span>
                    </div>
                </div>
            </el-option>
        </template>
    </el-select>
</template>

<script>
import moment from 'moment'
import locale from 'element-ui/lib/locale'
import lang from 'element-ui/lib/locale/lang/ru-RU'
import { conformTelToMask } from '../pages/timetable'
import Option from './select/src/option'
import Select from './select/src/select'

locale.use(lang)
Select.computed.readonly = function() {
    // trade-off for IE input readonly problem: https://github.com/ElemeFE/element/issues/10403
    const isIE = !this.$isServer && !Number.isNaN(Number(document.documentMode))

    return !(this.filterable || this.multiple || !isIE) && !this.visible
}

export default {
    name: 'GuestSelect',
    components: {
        'el-select': Select,
        'el-option': Option
    },
    props: {
        maxlength: {
            type: Number,
            default: 100
        },
        isPhone: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: 'Найти гостя'
        }
    },
    data() {
        return {
            guestQuery: '',
            guests: [],
            loading: false,
            list: []
        }
    },
    computed: {
        transformedQuery() {
            return this.isPhone
                ? this.$toMaskedPhone(this.guestQuery, false)
                : this.guestQuery
        }
    },
    methods: {
        makeValue(guest, reserve) {
            const _guest = { ...guest }
            delete _guest.reserves
            return { ...reserve, guest: _guest }
        },
        formatDate(date) {
            return moment(date).format('DD.MM HH:mm')
        },
        handleInput(event) {
            this.guestQuery = event
        },
        handleGuestSelect(guest) {
            this.guestQuery = ''
            this.$emit('selectedGuest', guest)
        },
        async searchGuests(query = '') {
            this.loading = true
            const guests = await this.$axios.$get(
                `/api/place/1/guest/search/?query=${encodeURIComponent(query)}`
            )
            // eslint-disable-next-line no-console
            console.log(guests)
            this.guests = guests
            this.loading = false
        },
        conformToMask: conformTelToMask
    }
}
</script>

<style lang="sass">
@import 'element-ui/lib/theme-chalk/select.css'
@import 'element-ui/lib/theme-chalk/select-dropdown.css'
@import '~assets/styles/variables'

.guest
    display: flex
    justify-content: space-between
    align-items: center
    line-height: 14px
    &-comment
        max-width: 335px
        white-space: normal
        color: #000754
        display: flex
        flex-direction: column
        &.danger
            color: $danger-color
        &.success
            color: $success-color
    &-info
        display: flex
        flex-direction: column
        &__name
            color: #000754
        &__telephone
            margin-top: 3px
            color: #6B768A
.popper__arrow
    display: none !important
.el-select-dropdown
    top: 42px !important
    border-radius: 8px !important
    background: #F4F5F7 !important
    min-width: 600px !important
    &__wrap
        max-height: 550px !important
        -webkit-overflow-scrolling: touch
    &__item
        height: unset
        padding: 4px 20px
        &:hover
            background: darken(#F4F5F7, 5)
.guest-select
    .el-input
        position: relative
        &::after
            content: ''
            width: 18px
            height: 18px
            position: absolute
            right: 9px
            top: 7px
            background: url("~static/icons/search.svg")
    .el-input__inner
        height: 32px !important
        line-height: 32px !important
        padding: 7px 32px 9px 12px !important
        border-radius: 8px !important
        border: 2px solid #DFE2E7 !important
        width: 185px !important
        font-size: 14px
        &::placeholder
            color: #6B768A !important
            font-weight: 500
            font-size: 14px
        &:focus
            border-color: #298FCA !important
</style>
