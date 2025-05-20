<script setup lang="ts">
import LoginComponent from '../components/LoginComponent.vue'
</script>


<template>
    <div style="overflow: auto;" class="login">
        <LoginComponent />
    </div>
</template>

<style scoped>
.login{
    width: 100%;
    height: 100%;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
}
</style>