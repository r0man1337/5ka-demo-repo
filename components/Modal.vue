<template>
    <transition name="modal">
        <div class="modal-mask" @click="$emit('close')">
            <div class="modal-wrapper">
                <div class="modal-container" @click.stop>
                    <img
                        class="modal-close"
                        src="icons/close.svg"
                        @click="$emit('close')"
                    />
                    <div class="modal-header">
                        {{ title }}
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            {{ message }}
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <div class="default-footer">
                                <button
                                    class="modal-default-button"
                                    @click="$emit('confirm')"
                                >
                                    Подтвердить
                                </button>
                                <button
                                    class="modal-default-button"
                                    @click="$emit('close')"
                                >
                                    Отмена
                                </button>
                            </div>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        title: {
            type: String,
            default: 'Заголовок окна'
        },
        message: {
            type: String,
            default: 'Текст окна'
        }
    }
}
</script>

<style lang="sass" scoped>
.modal-close
    position: absolute
    right: 17.5px
    top: 17.5px
    width: 17.5px
    height: 17.5px
    z-index: 9999

.modal-wrapper
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    min-height: 100vh

.modal-mask
    position: absolute
    top: 0
    left: 0
    z-index: 2000
    width: 100vw
    height: 100%
    min-height: 100vh
    bottom: 0
    background-color: rgba(0, 0, 0, 0.5)
    display: table
    transition: opacity 0.3s ease-in-out

.modal-container
    width: 700px
    margin: 5px auto
    padding: 20px 16px 32px 48px
    background-color: #F4F5F7
    border-radius: 8px
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33)
    transition: all 0.3s ease
    position: relative
    max-height: calc(100vh - 10px)
    display: flex
    flex-direction: column
.modal-header
    font-size: 20px
    font-weight: bold
    color: #000754
    position: relative
    &::before
        content: ''
        width: 18px
        height: 18px
        position: absolute
        left: -32px
        top: 4px
        background: url("~static/icons/tables_map.svg")

.modal-body
    margin: 24px 0 32px
    max-height: calc(100vh - 10px - 32px - 20px - 25px - 24px - 32px - 20px)
    flex: 1
    position: relative
    overflow-y: auto

.default-footer
    display: flex
    justify-content: flex-end
    > *
        margin-left: 10px

.modal-enter-active, .modal-leave-to
    opacity: 0

.modal-enter-active .modal-container, .modal-leave-active .modal-container
    -webkit-transform: scale(1.1)
    transform: scale(1.1)
</style>
