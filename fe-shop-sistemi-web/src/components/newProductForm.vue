<template>
    <form> <!--@submit.prevent="handleSubmit" class="product-form"-->
      <div class="form-group">
        <label for="title">Titolo</label>
        <input id="title" v-model="form.title" required />
      </div>
  
      <div class="form-group">
        <label for="pDescription">Descrizione</label>
        <textarea id="pDescription" v-model="form.pDescription" required></textarea>
      </div>
  
      <div class="form-group">
        <label for="category">Categoria</label>
        <input id="category" v-model="form.category" required />
      </div>
  
      <div class="form-group">
        <label for="price">Prezzo</label>
        <input id="price" type="number" step="0.01" v-model.number="form.price" required />
      </div>
  
      <div class="form-group">
        <label for="quantity">Quantità</label>
        <input id="quantity" type="number" v-model.number="form.quantity" required />
      </div>
  
      <div class="form-group">
        <label for="imageUrl">URL Immagine</label>
        <input id="imageUrl" type="url" v-model="form.imageUrl" />
      </div>
  
      <button @click="uploadProduct">Salva</button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { reactive, watch, toRefs } from 'vue'
  import axios from "axios";
  //import { emit } from 'vue'
  
  interface Product {
    title: string
    pDescription: string
    category: string
    price: number
    quantity: number
    imageUrl: string
  }
  
  // Props
  const props = defineProps<{
    modelValue?: Product
  }>()
  
  // Stato interno
  const form = reactive<Product>({
    title: '',
    pDescription: '',
    category: '',
    price: 0,
    quantity: 0,
    imageUrl: ''
  })
  
  // Sincronizza dati in ingresso (edit)
  watch(
    () => props.modelValue,
    (value) => {
      if (value) Object.assign(form, value)
    },
    { immediate: true }
  )
  function uploadProduct(){
        console.log(this.Product.title)
        //alert(this.username + " " + this.password + " " + this.rememberMe);
    //    axios.post("/api/v1/auth/product", { //Per problemi di cors impostato indirizzo backend nel file vite.config.ts
    //  username: this.Product.title,
    //  password: this.Product.title
    //})
    //.then(response => {
    //  const token = response.data.token;
    //  const userInfo = response.data.user;
    //  this.$router.push('/Products') 
    //})
  }
  </script>
  
  <style scoped>
  .product-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  input,
  textarea {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>