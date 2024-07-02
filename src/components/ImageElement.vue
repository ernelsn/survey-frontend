<template>
    <img :src="imageSource" :alt="alt">
</template>

<script setup>
import { ref, onMounted } from "vue";

const supportsWebP = ref(null);
const imageSource = ref('');

const props = defineProps({
    webpSrc: String,
    fallbackSrc: String,
    alt: String,
});

function checkWebPSupport() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            supportsWebP.value = webP.height === 2;
            resolve();
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

onMounted(() => {
    checkWebPSupport().then(() => {
        imageSource.value = supportsWebP.value && props.webpSrc ? props.webpSrc : props.fallbackSrc;
    });
});
</script>