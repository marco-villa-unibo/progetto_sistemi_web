<template>
  <div class="profile-editor" style="display: flex; justify-content: center; align-items: center; flex-direction: row; padding-bottom: 50px;">
    <div class="card">
      <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%; height: 100%;">
        <h2 style="color: black;">Modifica Profilo</h2>
      </div>
      <div style="    display: flex;    flex-direction: row;    justify-content: center;    align-items: center;    width: 90%;">
        <div style="color: black;    display: flex;    width: 50%;    align-items: center;    justify-content: center;">
          <img height="300" width="300" src="../assets/DALL·E-2025-03-22-16.32 (3).png" style="margin: 30px; padding: 20px;"/>
        </div>
        <div  style="color:black; width:50%">
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <input type="text" id="username" placeholder="Username" v-model="form.username" required>
              <label for="username">Username</label>
            </div>
            <div class="form-group">
              <input type="text" id="firstname" placeholder="Nome" v-model="form.firstName" required>
              <label for="firstname">Nome</label>
            </div>
            <div class="form-group">
              <input type="text" id="lastname" placeholder="Cognome" v-model="form.lastName" required>
              <label for="lastname">Cognome</label>
            </div>
            <div class="form-group">
              <input type="email" id="Email" placeholder="Email" v-model="form.email" required>
              <label for="Email">Email</label>
            </div>
            <div class="form-group">
              <input type="text" id="phone" placeholder="Telefono" v-model="form.phone" required>
              <label for="phone">Telefono</label>
            </div>
            <div class="form-group">
              <input type="text" id="address" placeholder="Telefono" v-model="form.address" required>
              <label for="address">Indirizzo</label>
            </div>
            <div class="form-group">
              <input type="password" id="newPassword" placeholder="Password" v-model="form.password" required>
              <label for="newPassword">Nuova Password</label>
            </div>
            <div class="form-group">
              <input type="password" id="checkPassword" placeholder="Controllo Password" v-model="checkPassword" required>
              <label for="checkPassword">Controllo password</label>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; margin-top: 20px;">
              <button type="submit">💾 Salva Modifiche</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
  
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { getToken } from "../utils/auth";
  import {jwtDecode} from 'jwt-decode'
import { json } from 'stream/consumers';

interface DecodedToken {
  userId: number
  username: string
  email: string
  role: string
  iat: number
  exp: number
}
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
    } catch (err) {
      alert('Errore nel caricamento dei dati utente.')
      console.error(err)
    }
  }
  const updateProfile = async () => {
    try {
      if (form.value.password !== checkPassword.value ) {
        alert('La vecchia password non corrisponde alla nuova password.')
        return
      }
        console.log(form.value)
        console.log(form.value.username)
        console.log(form.value.firstName)
      await axios.put(`api/v1/user/${decoded.userId}`, form.value)
      alert('Profilo aggiornato con successo!')
    } catch (err) {
      alert('Errore durante l\'aggiornamento del profilo.')
      console.error(err)
    }
  }
  
  onMounted(() => {
    fetchUserData()
  })
  </script>
  
  <style scoped>
  .card{
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
        width: 50%;
    justify-content: center;
    transform: none;
  }

  .profile-editor {
    display: flex
;
    justify-content: center;
    align-items: center;
    margin: 0px;
    width: 100%;
    height: 100%;
    flex-direction: row;
  }
  
  input {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }
  
  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  </style>