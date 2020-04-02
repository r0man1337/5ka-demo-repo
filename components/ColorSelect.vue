<template>
    <div class="comment-color">
        Отметить цветом:
        <div
            class="comment-color__box comment-color__grey"
            @click="change('grey')"
        >
            <transition name="color-picked">
                <svg
                    v-show="value === 'grey'"
                    enable-background="new 0 0 16 16"
                    xml:space="preserve"
                >
                    <polygon
                        fill="#838EA0"
                        points="6.5,12.7 2.4,8.6 3.6,7.4 6.5,10.3 13.4,3.4 14.6,4.6 "
                    />
                </svg>
            </transition>
        </div>
        <div
            class="comment-color__box comment-color__green"
            @click="change('green')"
        >
            <transition name="color-picked">
                <svg
                    v-show="value === 'green'"
                    enable-background="new 0 0 16 16"
                    xml:space="preserve"
                >
                    <polygon
                        fill="#fff"
                        points="6.5,12.7 2.4,8.6 3.6,7.4 6.5,10.3 13.4,3.4 14.6,4.6 "
                    />
                </svg>
            </transition>
        </div>
        <div
            class="comment-color__box comment-color__red"
            @click="change('red')"
        >
            <transition name="color-picked">
                <svg
                    v-show="value === 'red'"
                    enable-background="new 0 0 16 16"
                    xml:space="preserve"
                >
                    <polygon
                        fill="#fff"
                        points="6.5,12.7 2.4,8.6 3.6,7.4 6.5,10.3 13.4,3.4 14.6,4.6 "
                    />
                </svg>
            </transition>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ColorSelect',
    props: {
        value: {
            type: String,
            default: 'grey'
        }
    },
    methods: {
        change(color) {
            this.$emit('input', color)
        }
    }
}
</script>
<style lang="sass">
.comment-color
    margin-top: 18px
    display: flex
    color: #6B768A
    align-items: center
    justify-content: flex-end

    &__box
        width: 28px
        height: 28px
        margin-left: 8px
        border-radius: 8px
        display: flex
        justify-content: center
        align-items: center
        cursor: pointer
        svg
            width: 16px
            height: 16px

    &__grey
        background: #E2E5E9

    &__red
        background: #D84A31

    &__green
        background: #40AC75

.color-picked-enter-active, .color-picked-leave-active
    transition: transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
.color-picked-enter
    transform: scale(0)
.color-picked-leave-to
    transform: scale(0)
</style>
