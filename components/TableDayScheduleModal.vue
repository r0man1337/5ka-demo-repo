<template>
    <modal
        v-show="visible"
        :title="`Стол ${table.number}`"
        @close="visible = false"
    >
        <template slot="body">
            <div class="schedule__tables">
                <div class="schedule__timebar schedule__timebar_left">
                    <template v-for="time in times">
                        <div :key="time" class="time">
                            {{ time + ':00' }}
                        </div>
                        <div :key="time + ':30'" class="time">
                            {{ time + ':30' }}
                        </div>
                    </template>
                </div>
                <div class="schedule__table">
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
                                            >{{
                                                getFormattedTime(book.datetime)
                                            }}
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
                                                ? conformToMask(
                                                      book.guest.phone
                                                  )
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
                                'grid-row': `${ALL_TIMES[time]}/${ALL_TIMES[
                                    time
                                ] + 1}`
                            }"
                            @click="handleFreeTimeClick(time, table.id)"
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
            </div>
        </template>
        <div slot="footer">
            <button class="flex-last-item" @click="visible = false">
                Закрыть
            </button>
        </div>
    </modal>
</template>

<script>
import { timelineMixin } from '../assets/scripts/mixins'
import Modal from './Modal'
import SupraIcon from './SupraIcon'

export default {
    name: 'TableDayScheduleModal',
    components: { SupraIcon, Modal },
    mixins: [timelineMixin],
    data() {
        return {
            table: {},
            times: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            visible: false,
            tableId: null,
            date: null
        }
    },
    mounted() {
        this.$bus.$on('refreshData', this.refresh)
    },
    methods: {
        async refresh() {
            // eslint-disable-next-line no-console
            console.log('trigered', this.visible, this.date, this.tableId)
            if (this.visible && this.date && this.tableId) {
                const res = await this.$axios.$get(
                    `/api/table/${this.tableId}/?date=${this.date}`
                )
                this.table = res
            }
        },
        open(tableId, date) {
            this.tableId = tableId
            this.date = date
            this.visible = true
            this.refresh()
        }
    }
}
</script>

<style lang="sass" scoped>
.modal-body
    .schedule__tables
        max-height: 100%
        min-height: unset
    .schedule__table
        width: 100%
        .table-bookings
            grid-template-columns: 1fr
</style>
