<template>
    <div style="overflow: auto;" class="createProduct">
      <newProductForm />
    </div>
  </template>
  
  <script setup lang="ts">
  import newProductForm from '../components/newProductForm.vue'
  
  </script>
  <style scoped>
  .createProduct{
    width: 100%;
    height: 100%;
    display: flex
;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
  </style>
  