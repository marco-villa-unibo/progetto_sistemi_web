<script setup>
import CartComponent from '../components/CartComponent.vue'
</script>

<template>
  <div class="cartView" style="overflow: auto;">
    <CartComponent />
  </div>
</template>

<style scoped>
.cartView{
        height: 100%;
    display: flex
;
    width: 100%;
    overflow: auto;
    align-content: center;
    justify-content: center;
    align-items: center;
}
</style>