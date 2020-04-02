<template>
    <modal v-show="visible" title="Информация о госте" @close="visible = false">
        <div slot="body" class="booking-form">
            <section class="booking-form__person-fields">
                <FormField
                    v-model="guest.name"
                    label="ФИО"
                    type="text"
                    placeholder="Введите имя гостя"
                />
                <div></div>
                <FormField
                    v-model="guest.phone"
                    label="Телефон"
                    type="tel"
                    placeholder="+7"
                />
                <FormField
                    v-model="guest.email"
                    :required="true"
                    label="Email"
                    type="email"
                    placeholder="example@mail.ru"
                />
            </section>
            <section class="booking-form__comment">
                <FormField
                    v-model="guest.comment"
                    :class="{
                        'red-text': guest.color === 'red',
                        'green-text': guest.color === 'green'
                    }"
                    label="Комментарий"
                    type="textarea"
                    placeholder="Добавить комментарий"
                    :required="false"
                />
                <ColorSelect v-model="guest.color" />
            </section>
        </div>
        <div slot="footer" class="booking-footer">
            <button :disabled="loading" class="success" @click="save">
                Сохранить
            </button>
            <button class="flex-last-item" @click="visible = false">
                Закрыть
            </button>
        </div>
    </modal>
</template>

<script>
import Modal from './Modal'
import FormField from './FormField'
import ColorSelect from './ColorSelect'

export default {
    name: 'GuestModal',
    components: { ColorSelect, FormField, Modal },
    data() {
        return {
            visible: false,
            loading: false,
            guest: {
                id: null,
                name: '',
                phone: '',
                email: '',
                comment: '',
                color: 'grey',
                reserves_count: 0
            }
        }
    },
    methods: {
        async save() {
            this.loading = true
            await this.$axios.$put(`/api/guest/${this.guest.id}/`, this.guest)
            this.$message({
                message: 'Информация о госте успешно отредактирована',
                type: 'success'
            })
            this.loading = false
        },
        open(guest) {
            this.guest = { ...guest }
            this.visible = true
        }
    }
}
</script>

<style lang="sass">
.booking-form
    section
        margin-top: 30px
        &:first-child
            margin-top: 0
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
        .red-text
            textarea
                color: #D84A31
        .green-text
            textarea
                color: #40AC75
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
