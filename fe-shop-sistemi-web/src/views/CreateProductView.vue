<template>
    <div class="create-product-view">
      <h1>Crea nuovo prodotto</h1>
      <newProductForm />
    </div>
  </template>
  
  <script setup lang="ts">
  import newProductForm from '../components/newProductForm.vue'
  
  </script>
  
  <style scoped>
  .create-product-view {
    max-width: 600px;
    margin: auto;
    padding: 20px;
  }
  </style>