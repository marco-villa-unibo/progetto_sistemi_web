<template>
  <div class="user-manager-wrapper">
    <div v-if="showForm" class="form-card">
      <h3 style="color: black;">{{ selectedUser?.id ? 'Modifica Utente' : 'Nuovo Utente' }}</h3>
      <form @submit.prevent="saveUser">
        <input v-model="form.username" placeholder="Username" required />
        <input v-model="form.firstName" placeholder="Nome" required />
        <input v-model="form.lastName" placeholder="Cognome" required />
        <input v-model="form.email" placeholder="Email" required />
        <input v-model="form.phone" placeholder="Telefono" required />
        <input v-model="form.address" placeholder="Indirizzo" required />
        <input v-model="form.password" placeholder="Password" type="password" />
        <select v-model="form.userRole">
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <div class="form-buttons">
          <button type="submit" class="primary">💾 Salva</button>
          <button type="button" class="secondary" @click="closeForm">❌ Annulla</button>
        </div>
      </form>
    </div>

    <div class="card" style="height: 90%;">
      <h2 style="margin-bottom: 1rem; color:black">Gestione Utenti</h2>
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
        <button @click="openForm()" class="primary addUser">➕ <p class="show">Aggiungi Utente</p></button>
        <input v-model="searchTerm"  placeholder="🔍 Cerca utenti..."  class="search-input" />
      </div>
      <ul class="user-list">
        <li v-for="user in filteredUsers" :key="user.id" class="user-item">
          <div class="user-info">
            <strong>ID:</strong> {{ user.id }}<br />
            <strong>Username:</strong> {{ user.username }}<br />
            <strong>Email:</strong> {{ user.email }}
          </div>
          <div class="user-actions">
            <button @click="openForm(user)">✏️</button>
            <button @click="deleteUser(user.id)">🗑️</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getToken } from "../utils/auth";
  import axios from 'axios'

  import { computed } from 'vue'

const searchTerm = ref('')
const originalPasswordHash = ref('')

const filteredUsers = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return users.value.filter(user =>
    user.username.toLowerCase().includes(term) ||
    user.firstName.toLowerCase().includes(term) ||
    user.lastName.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.phone.toLowerCase().includes(term)
  )
})
  
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
      if (!form.value.password) {
        form.value.password = originalPasswordHash.value
      }
      await axios.put(`api/v1/user/${selectedUser.value.id}`, form.value)
    } else {
      await axios.post('api/v1/auth/register', form.value).then(response => {
        axios.put(`api/v1/user/${response.data.id}`, form.value)
      }).catch(err => {
        alert(err)
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

  .search-input {
  margin-left: 20px;
  margin-bottom: 1rem;
  padding: 0.6rem;
  width: 100%;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
.user-manager-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  width: 100%;
  height: 100%;
}

.card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15);
  padding: 2rem;
  width: 50%;
  font-family: 'Segoe UI', sans-serif;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  font-size: 0.95rem;
  color: #333;
}

.user-actions button {
  margin-left: 0.5rem;
}

.form-container {
  margin-top: 2rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}

input, select {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

button {
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

button.primary {
  background-color: #4caf50;
  color: white;
}

button.primary:hover {
  background-color: #388e3c;
}

button.secondary {
  background-color: #e0e0e0;
  color: #333;
}

button.secondary:hover {
  background-color: #bdbdbd;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.form-card {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  z-index: 10;
  font-family: 'Segoe UI', sans-serif;
}

.user-manager-wrapper {
  position: relative; /* serve per posizionare il form assoluto sopra */
  
}

.card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15);
  padding: 2rem;
  width: 50%;
  font-family: 'Segoe UI', sans-serif;
  max-height: 90vh; /* Limite massimo alla card intera */

  display: flex;
  flex-direction: column;
}

.user-list {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 80%; /* Altezza massima visibile */
  margin-top: 1rem;
  padding-right: 0.5rem; /* spazio per scrollbar */
}

.user-list::-webkit-scrollbar {
  width: 6px;
}

.user-list::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 3px;
}

@media (max-width: 768px) {
  .user-item{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .user-actions{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .user-list{
    max-width: 100%; /* Altezza massima visibile su mobile */
  }

  .form-card{
    width: 90%;
    top: 5%;
    left: 5%;
    transform: translateX(0);
  }
  .user-actions{
        display: flex
;
    flex-direction: row;
    
    justify-content: center;
  }
  .search-input {
    margin: 0px;
    margin-left: 6px;
  }
    .card{
      width: 100%;
      height: 100% !important;
      margin: 0px;
      padding: 10px;
    }

    .show{
      display: none;
    }
}
  </style>