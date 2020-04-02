<template>
    <section class="login">
        <form
            class="login__form"
            @submit.prevent="submitForm"
            @keypress.enter="submitForm"
        >
            <form-field
                v-model="username"
                label="Пользователь"
                placeholder="Введите имя пользователя"
                type="text"
            ></form-field>
            <form-field
                v-model="password"
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
            ></form-field>
            <button type="submit">Вход</button>
        </form>
    </section>
</template>

<script>
import FormField from '../components/FormField'
export default {
    name: 'Login',
    components: { FormField },
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        async submitForm() {
            if (this.username.length > 0 && this.password.length > 0) {
                const res = await this.$axios.$post('/api/login/', {
                    username: this.username,
                    password: this.password
                })
                if (res && res.token) {
                    const key = res.token
                    this.$store.dispatch('login', key)
                    this.$router.push('/')
                }
            }
        }
    }
}
</script>

<style lang="sass" scoped>
.login
    width: 300px
    margin-top: 50px
    &__form
        display: grid
        grid-template-columns: 1fr
        grid-gap: 15px
</style>
