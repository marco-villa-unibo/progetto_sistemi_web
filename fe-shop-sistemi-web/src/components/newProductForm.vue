<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from "axios"
import { getToken, removeToken } from "../generated-sources/shop/apis/AuthApi"

interface ProductForm {
  title: string
  pDescription: string
  category: string
  price: number
  quantity: number
}

const form = reactive<ProductForm>({
  title: '',
  pDescription: '',
  category: '',
  price: 0,
  quantity: 0
})

const imageFile = ref<File | null>(null)

function uploadImage(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imageFile.value = file
    console.log('Selected file:', file.name)
  }
}

function uploadProduct() {
  if (!imageFile.value) {
    alert("Devi selezionare un'immagine.")
    return
  }

  const formData = new FormData()
  formData.append('image', imageFile.value)
  formData.append('title', form.title)
  formData.append('pDescription', form.pDescription)
  formData.append('category', form.category)
  formData.append('price', form.price.toString())
  formData.append('quantity', form.quantity.toString())

  const access_token = getToken()
  axios.post('http://localhost:8080/api/v1/product', formData, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    console.log('Product added successfully:', response.data)
  })
  .catch(err => {
    alert('Errore nel salvataggio del prodotto: ' + err)
  })
}
</script>

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
      <select id="category" v-model="form.category" required>
        <option value="">Seleziona categoria</option>
        <option value="ORTOFRUTTA">Ortofrutta</option>
        <option value="SURGELATI">Surgelati</option>
        <option value="CASA">Casa</option>
        <option value="ELETTRONICA">Elettronica</option>
        <option value="LIQUORI">Liquori</option>
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
      <label for="image">Immagine</label>
      <input id="image" type="file" accept="image/*" @change="uploadImage" required />
    </div>

    <button type="submit">Salva</button>
  </form>
</template>
  
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