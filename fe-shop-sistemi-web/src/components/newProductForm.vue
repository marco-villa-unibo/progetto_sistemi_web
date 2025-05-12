<template>
    <form @submit.prevent="uploadProduct" class="product-form">
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

        <select name="Category" id="category" v-model="form.category" required>
          <option value=0>Banco</option>
          <option value="ORTOFRUTTA">Ortofrutta</option>
          <option value="SURGELATI">SURGELATI</option>
          <option value="CASA">CASA</option>
          <option value="ELETTRONICA">ELETTRONICA</option>
          <option value="LIQUORI">LIQUORI</option>
        </select>
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
        <input id="imageUrl" type="file" accept="image/jpeg, image/png" @change="uploadImage"/>
      </div>
  
      <button type="submit" @click="uploadProduct">Salva</button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { reactive, watch, toRefs } from 'vue'
  import axios from "axios";
  import { setToken, getToken, removeToken } from "../generated-sources/shop/apis/AuthApi";

  
  interface Product {
    title: string
    pDescription: string
    category: string
    price: number
    quantity: number
    imageUrl: string
  }
  

  const props = defineProps<{
    modelValue?: Product
  }>()
  

  const form = reactive<Product> ({
    title: '',
    pDescription: '',
    category: '',
    price: 0,
    quantity: 0,
    imageUrl: ''
  })
  

  function uploadImage(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return;

  const reader = new FileReader()
  reader.onload = (e) => {
    form.imageUrl = e.target?.result as string
    console.log('Image base64:', form.imageUrl)
  }
  reader.readAsDataURL(file)
}

  function uploadProduct(){
    console.log(form.title)
    var access_token = getToken()
    axios.defaults.headers.common['Authorization'] = `Bearer  ${access_token}`
    axios.post("/api/v1/product", { //Per problemi di cors impostato indirizzo backend nel file vite.config.ts
      
        title: form.title,
        pDescription: form.pDescription,
        category: form.category,
        price: form.price,
        quantity: form.quantity,
        imageUrl: form.imageUrl
    })
    .then(response => {
      console.log('product added successfully:', response.data); 
    }).catch(err => {
            alert(err);
    });
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