<template>
    <div class="profile-editor">
      <h2>Modifica Profilo</h2>
  
      <form @submit.prevent="updateProfile">
        <input v-model="form.username" placeholder="Username" required />
        <input v-model="form.firstName" placeholder="Nome" required />
        <input v-model="form.lastName" placeholder="Cognome" required />
        <input v-model="form.email" type="email" placeholder="Email" required />
        <input v-model="form.phone" placeholder="Telefono" required />
        <input v-model="form.address" placeholder="Indirizzo" required />
        <input v-model="form.password" type="password" placeholder="Nuova Password" required />
  
        <button type="submit">💾 Salva Modifiche</button>
      </form>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { getToken } from "../generated-sources/shop/apis/AuthApi";
  import {jwtDecode} from 'jwt-decode'

interface DecodedToken {
  userId: number
  username: string
  email: string
  role: string
  iat: number
  exp: number
}
  
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
  .profile-editor {
    max-width: 400px;
    margin: auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
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