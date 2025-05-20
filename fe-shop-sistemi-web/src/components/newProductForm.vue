<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from "axios"
import { getToken, removeToken } from "../utils/auth"

const statusMessage = ref('')
const statusType = ref<'success' | 'error' | ''>('')

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
    statusMessage.value = "Devi selezionare un'immagine."
    statusType.value = 'error'
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
    statusMessage.value = 'Prodotto salvato con successo!'
    statusType.value = 'success'

    form.title = ''
    form.pDescription = ''
    form.category = ''
    form.price = 0
    form.quantity = 0
    imageFile.value = null
  })
  .catch(err => {
    statusMessage.value = 'Errore nel salvataggio del prodotto.'
    statusType.value = 'error'
  })
}
</script>

<template>
  <div class="profile-editor" style="display: flex; justify-content: center; align-items: center; flex-direction: row; padding-bottom: 50px;">
    <div class="card">
      <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%; height: 100%;">
        <h2 style="color: black;">Crea Prodotto</h2>
      </div>
      <div style="    display: flex;    flex-direction: row;    justify-content: center;    align-items: center;    width: 90%;">
        <div style="color: black;    display: flex;    width: 50%;    align-items: center;    justify-content: center;">
          <img height="300" width="300" src="../assets/DALL·E-2025-03-22-16.32 (3).png" style="margin: 30px; padding: 20px;"/>
        </div>
        <div  style="color:black; width:50%">
          <form @submit.prevent="uploadProduct" style="font:black; padding: none; margin: none;">
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
            <div v-if="statusMessage" :class="['status-message', statusType]">
                {{ statusMessage }}
            </div>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; margin-top: 20px;">
              <button type="submit" style="color:black">💾 Salva</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
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
.card{
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15);
    padding: 16px;
    margin: 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
        width: 50%;
    justify-content: center;
    transform: none;
  }

.profile-editor {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px;
    width: 100%;
    height: 100%;
    flex-direction: row;
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

.status-message {
  margin: 1rem 0;
  padding: 0.8rem;
  border-radius: 0.6rem;
  font-weight: bold;
  text-align: center;
  width: 100%;
}

.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

</style>