<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from "axios"
import { getToken, removeToken } from "../utils/auth"

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
  <form @submit.prevent="uploadProduct" class="product-form" style="font:black;">
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
:root {
  --green: #5cb85c;
  --green-dark: #3d8b3d;
  --orange: #ffa726;
  --bg-light: #fefcf6;
  --text-dark: #2f2f2f;
  --border-radius: 1rem;
  --transition: all 0.3s ease;
}

.product-form {
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  padding: 2rem;
  max-width: 500px;
  margin: 2rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
  color: var(--text-dark);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--green-dark);
}

input,
textarea,
select {
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.6rem;
  transition: var(--transition);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(92, 184, 92, 0.2);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button {
  align-self: center;
  background-color: var(--green);
  color: white;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  font-weight: bold;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

button:hover {
  background-color: var(--green-dark);
  transform: scale(1.03);
}

@media (max-width: 500px) {
  .product-form {
    padding: 1rem;
  }
}
</style>