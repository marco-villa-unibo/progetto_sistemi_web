<template>
    <div class="create-product-view">
      <h1>Crea nuovo prodotto</h1>
      <newProductForm />
    </div>
  </template>
  
  <script setup lang="ts">
  import newProductForm from '../components/newProductForm.vue'
  
  function createProduct(product: any) {
    console.log('Prodotto da creare:', product)
  
    // Esempio: chiamata API simulata
    // await api.post('/products', product)
  
    // Redirect o messaggio
    alert('Prodotto creato con successo!')
  }
  </script>
  
  <style scoped>
  .create-product-view {
    max-width: 600px;
    margin: auto;
    padding: 20px;
  }
  </style>