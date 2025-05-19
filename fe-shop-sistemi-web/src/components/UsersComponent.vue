<template>
    <div class="user-manager">
      <h2>Gestione Utenti</h2>
  
      <button @click="openForm()">➕ Aggiungi Utente</button>
  
      <ul>
        <li v-for="user in users" :key="user.id">
          <strong>{{ user.id }}</strong> - {{ user.email }}
          <strong>{{ user.username }}</strong> - {{ user.email }}
          <button @click="openForm(user)">✏️ Modifica</button>
          <button @click="deleteUser(user.id)">🗑️ Elimina</button>
        </li>
      </ul>
  
      <div v-if="showForm" class="form-container">
        <h3>{{ selectedUser?.id ? 'Modifica Utente' : 'Nuovo Utente' }}</h3>
        <form @submit.prevent="saveUser">
          <input v-model="form.username" placeholder="Username" required />
          <input v-model="form.firstName" placeholder="Nome" required />
          <input v-model="form.lastName" placeholder="Cognome" required />
          <input v-model="form.email" placeholder="Email" required />
          <input v-model="form.phone" placeholder="Telefono" required />
          <input v-model="form.address" placeholder="Indirizzo" required />
          <input v-model="form.password" placeholder="Password" type="password"/>
          <select v-model="form.userRole">
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit">💾 Salva</button>
          <button type="button" @click="closeForm">❌ Annulla</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getToken } from "../utils/auth";
  import axios from 'axios'
  
  interface User {
    id: number
    username: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    password: string
    userRole?: string
  }
  
  const users = ref<User[]>([])
  const selectedUser = ref<User | null>(null)
  const showForm = ref(false)
  const form = ref<User>({
    id: 0,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  })
  
  const fetchUsers = async () => {
    const res = await axios.get('api/v1/user')
    users.value = res.data
    console.log(res.data)
  }
  
  const openForm = (user?: User) => {
    if (user) {
      selectedUser.value = user
      form.value = { ...user }
    } else {
      selectedUser.value = null
      form.value = {
        id: 0,
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        userRole: 'CUSTOMER'
      }
    }
    showForm.value = true
  }
  var access_token = getToken()
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}` 
  const closeForm = () => {
    showForm.value = false
    selectedUser.value = null
  }
  const saveUser = async () => {
    try {
      if (selectedUser.value?.id) {
        await axios.put(`api/v1/user/${selectedUser.value.id}`, form.value)
      } else {
        await axios.post('api/v1/auth/register', form.value).then(response => {
            console.log(form.value)
            axios.put(`api/v1/user/${response.data.id}`, form.value)
        }).catch(err => {
          alert(err);
        });
      }
      await fetchUsers()
      closeForm()
    } catch (err) {
      alert('Errore durante il salvataggio utente.')
      console.error(err)
    }
  }
  
  const deleteUser = async (userId: number) => {
    console.log(userId)

    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      await axios.delete(`/api/v1/user/${userId}`)
      await fetchUsers()
    }
  }
  
  onMounted(() => {
    fetchUsers()
  })
  </script>
  
  <style scoped>
  .user-manager {
    padding: 1rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin: 0.5rem 0;
  }
  
  button {
    margin-left: 0.5rem;
  }
  
  .form-container {
    margin-top: 1rem;
    border: 1px solid #ccc;
    padding: 1rem;
    max-width: 400px;
  }
  </style>