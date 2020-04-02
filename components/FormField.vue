<template>
    <div class="form-field">
        <label
            v-if="label"
            class="form-field__label"
            :class="{ 'form-field__label_bold': boldLabel }"
        >
            {{ label }}
            <span v-if="!required" class="form-field__label_not-required">
                (необязательно)
            </span>
        </label>
        <input
            v-if="['text', 'email', 'password'].includes(type)"
            :value="value"
            class="form-field__input"
            :type="type"
            :placeholder="placeholder"
            @input="$emit('input', $event.target.value)"
        />
        <div v-if="type === 'date'" class="field-wrapper">
            <input
                v-if="false"
                :value="value"
                class="form-field__input"
                :style="{ width: width ? width + 'px' : 'auto' }"
                :type="type"
                :placeholder="placeholder"
                @input="$emit('input', $event.target.value)"
                @change="$emit('change')"
            />
            <DatePicker
                v-else
                class="form-field__input date-wrapper"
                :style="{ width: width ? width + 'px' : 'auto' }"
                :value="value"
                :placeholder="placeholder"
                :picker-options="optionsPicker"
                :value-format="'yyyy-MM-dd'"
                @input="$emit('input', $event)"
                @change="$emit('change')"
            />
        </div>
        <textarea
            v-else-if="type === 'textarea'"
            :value="value"
            class="form-field__input"
            :type="type"
            :placeholder="placeholder"
            @input="$emit('input', $event.target.value)"
        ></textarea>
        <masked-input
            v-else-if="type === 'tel'"
            :value="value"
            type="tel"
            :mask="PHONE_MASK"
            :guide="true"
            :placeholder="placeholder"
            @input="$emit('input', $event)"
        />
        <div v-else-if="type === 'select'" class="field-wrapper select-wrapper">
            <select
                :value="value"
                class="form-field__input"
                @input="$emit('input', $event.target.value)"
                @change="$emit('change')"
            >
                <option v-if="withNullOption" :value="null">Любой</option>
                <option
                    v-for="option in options"
                    :key="option.text"
                    :value="option.value"
                >
                    {{ option.text }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
import MaskedInput from 'vue-text-mask'
import { DatePicker } from 'element-ui'
import moment from 'moment'

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
    name: 'FormField',
    components: { MaskedInput, DatePicker },
    props: {
        withNullOption: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: 'text'
        },
        label: {
            type: String,
            default: null
        },
        boldLabel: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: null
        },
        width: {
            type: Number,
            default: null
        },
        options: {
            type: Array,
            default: () => []
        },
        required: {
            type: Boolean,
            default: true
        },
        value: {
            type: [String, Object, Array, Number],
            default: null
        }
    },
    data() {
        return {
            PHONE_MASK: PHONE_MASK,
            optionsPicker: {
                firstDayOfWeek: 1,
                disabledDate: date => moment(date).isBefore(moment(), 'day')
            }
        }
    }
}
</script>

<style lang="sass" scoped>
.form-field
    display: flex
    flex-direction: column
    input[type="date"]
        white-space: nowrap
    &__label
        text-transform: uppercase
        color: #6B768A
        font-size: 12px
        font-weight: 500
        margin-bottom: 7px
        &_not-required
            color: #6B768A
        &_bold
            text-transform: none
            color: #000754
            font-size: 16px
            font-weight: bold
</style>
