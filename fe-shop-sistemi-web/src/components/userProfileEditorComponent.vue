<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { getToken } from "../utils/auth";
  import {jwtDecode} from 'jwt-decode'
import { json } from 'stream/consumers';

const errorMessage = ref('')

interface DecodedToken {
  userId: number
  username: string
  email: string
  role: string
  iat: number
  exp: number
}

const originalPasswordHash = ref('')
  const token = ref(getToken())
  const checkPassword = ref('')  

  interface UserForm {
    id: number
    username: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    password: string
  }
  
  const form = ref<UserForm>({
    id:0,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  })
  const access_token = getToken()
  const decoded = jwtDecode<DecodedToken>(access_token!)
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
  const fetchUserData = async () => {
    
    console.log(decoded.userId)
    try {
      const res = await axios.get(`api/v1/user/${decoded.userId}`)
      form.value = {
        ...res.data,
        password: ''
      }
      originalPasswordHash.value = res.data.password
    } catch (err) {
      alert('Errore nel caricamento dei dati utente.')
      console.error(err)
    }
  }
  const updateProfile = async () => {
  try {
    if (form.value.password !== checkPassword.value) {
      errorMessage.value = '❌ La nuova password e la conferma non coincidono.'
      setTimeout(() => {
        errorMessage.value = ''
      }, 3000)
      return
    }

    if (form.value.password === '') {
      form.value.password = originalPasswordHash.value
    }

    await axios.put(`api/v1/user/${decoded.userId}`, form.value)
    alert('Profilo aggiornato con successo!')
  } catch (err) {
    errorMessage.value = '❌ Errore durante l\'aggiornamento del profilo.'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
    console.error(err)
  }
}

  
  
  onMounted(() => {
    fetchUserData()
  })
  </script>
  
<template>
  <div class="profile-editor">
    <div class="card">
      <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%; height: 100%;">
        <h2 style="color: black;">Profilo</h2>
      </div>
      <div style="    display: flex;    flex-direction: row;    justify-content: center;    align-items: center;    width: 90%;">
        <div style="color: black;    display: flex;    width: 50%;    align-items: center;    justify-content: center;" class="hide">
          <img height="300" width="300" src="../assets/DALL·E-2025-03-22-16.32 (3).png" style="margin: 30px; padding: 20px;"/>
        </div>
        <div class="formDiv">
          <div v-if="errorMessage" class="status-message error">
            {{ errorMessage }}
          </div>
          <form @submit.prevent="updateProfile" class="formStyle">
            <div class="form-group">
              <label for="title">Username</label>
              <input type="text" class="fontInput" id="title" placeholder="Username" v-model="form.username" required />
            </div>
            <div class="form-group">
              <label for="firstname">Nome</label>
              <input type="text" class="fontInput" id="firstname" placeholder="Nome" v-model="form.firstName" required>
            </div>
            <div class="form-group">
              <label for="lastname">Cognome</label>
              <input type="text" class="fontInput" id="lastname" placeholder="Cognome" v-model="form.lastName" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" class="fontInput" id="email" placeholder="Email" v-model="form.email" required>
            </div>
            <div class="form-group">
              <label for="phone">Telefono</label>
              <input class="fontInput" id="phone" type="text" v-model.number="form.phone" required />
            </div>
            <div class="form-group">
              <label for="adddress">Indirizzo</label>
              <input class="fontInput" id="address" type="text" v-model.number="form.address" required />
            </div>
            <div class="form-group">
              <input class="fontInput" type="password" id="newPassword" placeholder="Password" v-model="form.password" required>
              <label for="newPassword">Nuova Password</label>
            </div>
            <div class="form-group">
              <input class="fontInput" type="password" id="checkPassword" placeholder="Controllo Password" v-model="checkPassword" required>
              <label for="checkPassword">Controllo password</label>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; margin-top: 20px;">
              <button type="submit" style="color:black">💾 Salva Modifiche</button>
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

.formStyle {
    font:black; 
    padding: none; 
    margin: none;
}

.profile-editor {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px;
    width: 100%;
    height: 100%;
    padding-bottom: 50px;
    flex-direction: row;
  }

.formDiv{
  color:black; 
  width:50%
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
.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 0.6rem;
  padding: 0.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
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

@media (max-width: 768px) {
  .fontInput {
    font-size: small;
  }

  .formStyle {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .formDiv{
    width: 100%;
  }

  .product-form {
    padding: 1rem;
  }

  .form-group {
    margin-top: 0px !important;
    width: 90% !important;
  }

  .hide{
    display: none !important;
  }
  .card{
    width: 90%;
  }

  .profile-editor {
    padding:0px
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