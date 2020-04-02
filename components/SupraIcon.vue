<template>
    <svg
        enable-background="new 0 0 16 16"
        xml:space="preserve"
        style="width: 16px; height: 16px;"
    >
        <path
            v-if="icon === 'comment'"
            :fill="fill"
            d="M3,15c-0.2,0-0.3,0-0.5-0.1C2.2,14.7,2,14.4,2,14v-3.7C0.7,9.4,0,8.3,0,7c0-2.8,3.5-5,8-5c4.5,0,8,2.2,8,5
	s-3.5,5-8,5c-0.1,0-0.1,0-0.2,0l-4.3,2.8C3.4,14.9,3.2,15,3,15z M8,4C4.5,4,2,5.6,2,7c0,0.7,0.5,1.4,1.5,1.9C3.8,9.1,4,9.4,4,9.8
	v2.3l3-2C7.1,10,7.3,10,7.6,10c0.2,0,0.3,0,0.4,0c3.5,0,6-1.6,6-3S11.5,4,8,4z"
        />
        <polygon
            v-if="icon === 'choice'"
            :fill="fill"
            points="6.5,12.7 2.4,8.6 3.6,7.4 6.5,10.3 13.4,3.4 14.6,4.6 "
        />
    </svg>
</template>

<script>
export default {
    name: 'SupraIcon',
    props: {
        icon: {
            type: String,
            default: 'comment'
        },
        fill: {
            type: String,
            default: '#fff'
        }
    }
}
</script>

<style scoped></style>
