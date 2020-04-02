<template>
    <slider
        :value="transformedValue"
        style="width: 100%;"
        :max="24"
        :show-tooltip="false"
        :marks="marks"
        :range="isRange"
        @input="handleSliderInput"
        @change="handleSliderChange"
    />
</template>
<script>
/* eslint-disable no-console */

import { Slider } from 'element-ui'
import moment from 'moment'

const TIME_MARKS = {
    0: '12:00',
    2: '13:00',
    4: '14:00',
    6: '15:00',
    8: '16:00',
    10: '17:00',
    12: '18:00',
    14: '19:00',
    16: '20:00',
    18: '21:00',
    20: '22:00',
    22: '23:00',
    24: '00:00'
}

export const ALL_TIMES = {
    0: '12:00',
    1: '12:30',
    2: '13:00',
    3: '13:30',
    4: '14:00',
    5: '14:30',
    6: '15:00',
    7: '15:30',
    8: '16:00',
    9: '16:30',
    10: '17:00',
    11: '17:30',
    12: '18:00',
    13: '18:30',
    14: '19:00',
    15: '19:30',
    16: '20:00',
    17: '20:30',
    18: '21:00',
    19: '21:30',
    20: '22:00',
    21: '22:30',
    22: '23:00',
    23: '23:30',
    24: '00:00'
}

// eslint-disable-next-line prettier/prettier
const ALL_TIMES_INVERSE = Object.assign(
    {},
    ...Object.entries(ALL_TIMES).map(([a, b]) => ({ [b]: a }))
)

export default {
    name: 'TimeSlider',
    components: { Slider },
    props: {
        value: {
            type: [String, Array],
            default: () => null
        }
    },
    data() {
        return {
            marks: TIME_MARKS
        }
    },
    computed: {
        isRange() {
            return typeof this.value !== 'string'
        },
        transformedValue() {
            if (typeof this.value === 'string') {
                return parseInt(ALL_TIMES_INVERSE[this.value]) || 0
            }
            return [
                parseInt(ALL_TIMES_INVERSE[this.value[0]]) || 0,
                parseInt(ALL_TIMES_INVERSE[this.value[1]])
            ]
        }
    },
    watch: {
        transformedValue(val) {
            this.makeMarks(val)
        }
    },
    methods: {
        makeMarks(val) {
            const marks = { ...TIME_MARKS }
            if (typeof val === 'number') {
                const time = val
                let label = marks[time] || null
                if (time % 2 > 0) {
                    const tmp = marks[time - 1].split('')
                    tmp[3] = '3'
                    label = tmp.join('')
                }
                marks[time] = {
                    style: {
                        color: '#000754',
                        fontSize: '12px',
                        marginTop: '-22px'
                    },
                    label: this.$createElement('strong', label)
                }
            } else {
                const from = val[0]
                const to = val[1]
                let fromLabel = marks[from] || null
                let toLabel = marks[to] || null
                if (from % 2 > 0) {
                    const tmp = marks[from - 1].split('')
                    tmp[3] = '3'
                    fromLabel = tmp.join('')
                }
                if (to % 2 > 0) {
                    const tmp = marks[to - 1].split('')
                    tmp[3] = '3'
                    toLabel = tmp.join('')
                }
                marks[from] = {
                    style: {
                        color: '#000754',
                        fontSize: '12px',
                        marginTop: '-22px'
                    },
                    label: this.$createElement('strong', fromLabel)
                }
                marks[to] = {
                    style: {
                        color: '#000754',
                        fontSize: '12px',
                        marginTop: '-22px'
                    },
                    label: this.$createElement('strong', toLabel)
                }
            }
            this.marks = marks
        },
        isTimeSameOrAfter(time) {
            return moment(this.$store.state.currentDate)
                .hours(time.substring(0, 2))
                .minutes(time.substring(3, 6))
                .isSameOrAfter(moment())
        },
        handleSliderInput($event) {
            if (typeof $event === 'number') {
                if (this.isTimeSameOrAfter(ALL_TIMES[$event])) {
                    this.$emit('input', ALL_TIMES[$event])
                }
            } else if (this.isTimeSameOrAfter(ALL_TIMES[$event[0]])) {
                const from = moment()
                    .hours(ALL_TIMES[$event[0]].substring(0, 2))
                    .minutes(ALL_TIMES[$event[0]].substring(3, 6))
                const to = moment()
                    .hours(ALL_TIMES[$event[1]].substring(0, 2))
                    .minutes(ALL_TIMES[$event[1]].substring(3, 6))
                if (to.diff(from, 'minutes') >= 90) {
                    this.$emit('input', [
                        ALL_TIMES[$event[0]],
                        ALL_TIMES[$event[1]]
                    ])
                }
            } /* else {
                const currentTime = moment()
                this.$emit('input', [
                    moment()
                        .minutes(
                            parseInt(currentTime.format('mm')) > 30 ? 30 : 0
                        )
                        .format('HH:mm'),
                    ALL_TIMES[$event[1]]
                ])
            } */
        },
        handleSliderChange() {
            this.$emit('change')
        }
    }
}
</script>
<style lang="sass">
@import 'element-ui/lib/theme-chalk/slider.css'

.el-slider
    &__button-wrapper
        top: -16.5px
    &__button
        width: 15px
        height: 15px
        border: 2px solid #000754
        background-color: #000754
    &__bar, &__runway
        height: 3px
        border-radius: 0
    &__marks-text
        font-size: 10px
        color: #6B768A
    &__stop
        height: 9px
        width: 1px
        background-color: #cfd3db
        border-radius: 0
    &__runway
        background-color: #cfd3db
    &__bar
        background-color: #000754
        z-index: 1
</style>
