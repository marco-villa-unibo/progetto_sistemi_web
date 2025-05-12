<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from "axios"
import EditProductForm from './editProductForm.vue'
import { getToken } from "../generated-sources/shop/apis/AuthApi"
import { reactive, watch, toRefs } from 'vue'

// Reattivi
const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const Products = ref<any[]>([])  // Ora vuoto, verrà popolato via API

const token = ref<string | null>(null)

const showId = ref<number | null>(null)
const show = ref(false)
const quantity = ref<number>(0)
const edit = ref<boolean>(false)

// Filtraggio e ordinamento
const filteredProducts = computed(() => {
  return [...Products.value]
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price)
})

// Recupero token
const checkToken = () => {
  token.value = getToken()
}

// Decodifica del ruolo da JWT
const role = computed(() => {
  if (token.value) {
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      return payload.role
    } catch (e) {
      return null
    }
  }
  return null
})

// Gestione popup e selezione prodotto
function selectItems(id: number) {
  showId.value = id
  show.value = true
}

function closeDetails() {
    if (edit.value == true){
        editProduct()
    }
  show.value = false
  showId.value = null
}

function editProduct() {
    edit.value = !edit.value

}

function remove() {
  quantity.value -= 1
}

function add() {
  quantity.value += 1
}

const access_token = getToken()
axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

async function fetchProducts() {
  try {
    const response = await axios.get('/api/v1/product')
    Products.value = response.data.map((p: any) => ({
      id: p.id,
      name: p.title,
      description: p.pDescription,
      price: p.price,
      quantity: p.quantity,
      category: p.category,
      image: p.imageUrl.replace("public\\", "http://localhost:8080/"), // Assumendo che serva da lì
    }));
  } catch (error) {
    console.error("Errore nel caricamento prodotti:", error);
  }
}

async function saveProduct(id: number) {
    console.log("Salva prodotto");
    if (Products.value.find(p => p.id === id)?.name != form.title) {
        Products.value.find(p => p.id === id).name = form.title
    }
    if (Products.value.find(p => p.id === id)?.description != form.pDescription) {
        Products.value.find(p => p.id === id).description = form.pDescription
    }
    if (Products.value.find(p => p.id === id)?.price != form.price) {
        console.log(form.price)
        Products.value.find(p => p.id === id).price = form.price
    }
    if (Products.value.find(p => p.id === id)?.quantity != form.quantity) {
        console.log(form.quantity)
        Products.value.find(p => p.id === id).quantity = form.quantity
    }
    const response = await axios.put(`/api/v1/product/${id}`, {
        title: Products.value.find(p => p.id === id)?.name,
        pDescription: Products.value.find(p => p.id === id)?.description,
        price: Products.value.find(p => p.id === id)?.price,
        category: Products.value.find(p => p.id === id)?.category,
        quantity: Products.value.find(p => p.id === id)?.quantity
    }, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
    console.log("Prodotto salvato:", response.data);
    // Aggiorna la lista dei prodotti
    const index = Products.value.findIndex(p => p.id === id);
    if (index !== -1) {
        Products.value[index] = {
        ...Products.value[index],
        ...response.data,
        };
    }
    fetchProducts(); // Ricarica i prodotti
    closeDetails(); // Chiudi il popup
    edit.value = false; // Torna alla visualizzazione normale
    show.value = false; // Chiudi il popup
    showId.value = null; // Resetta l'ID del prodotto selezionato
    quantity.value = 0; // Resetta la quantità
    console.log("Prodotto salvato");
    console.log(Products.value.find(p => p.id === id));

}

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

function deleteProduct(id: number) {
    const response = axios.delete(`/api/v1/product/${id}`);
    fetchProducts(); // Ricarica i prodotti
    closeDetails();
    fetchProducts()
};


// Inizializzazione al montaggio
onMounted(() => {
  checkToken()
  fetchProducts()
  window.addEventListener('token-changed', checkToken)
})
</script>

<template>
    <div style="width: 100%; text-align: center; margin: 20px 0;">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cerca un prodotto..."
          style="padding: 10px; width: 50%; border: 1px solid #ccc; border-radius: 4px;"
        />
        <select v-model="sortOrder" style="margin-left: 10px; padding: 10px;">
          <option value="asc">Prezzo crescente</option>
          <option value="desc">Prezzo decrescente</option>
        </select>
      </div>  
  <div style="width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    overflow: auto;" class="font">
    

    <div v-for="product in filteredProducts" :key="product.id" style="width:25%; overflow: auto">
      <button class="card" style="margin:10px; padding: 10px;" @click="selectItems(product.id)">
        <div class="nameSpace">{{ product.name }}</div>
        <div class="imageSpace">
          <img :src="product.image" height="150px" width="150px" />
        </div>
        <div>Price: {{ product.price }}€</div>
        <div>
          <i class="fa fa-cart-plus" style="font-size:25px;"></i>
        </div>
      </button>
    </div>

    
    <div v-if="show" class="details-popup font"> 
        <button class="close-btn" @click="closeDetails()"><i class="fa fa-window-close" aria-hidden="true"></i></button>
        <div v-if="showId !== null && edit == false">
            <h2 style="padding-bottom:10px">{{ Products.find(p => p.id === showId)?.name }}</h2>
            <div style="padding-bottom:20px; ">
                <img :src="Products.find(p => p.id === showId)?.image" style="box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;" height="42%" width="42%" />
            </div>
            <div style="width: 100%;display: flex; flex-direction: column; align-items: center;">
                <div style="width: 70%; display: flex;">
                    <b>Descrizione:</b>
                </div>
                <div style="width: 70%; display: flex;">
                    <p>{{ Products.find(p => p.id === showId)?.description }}</p>
                </div>
            </div>
            <div>
                <p><b>Prezzo:</b> {{ Products.find(p => p.id === showId)?.price }}€</p>
            </div>
            <div style="display: flex; flex-direction:row;  justify-content: center;">
                <div style="padding-right:10px">
                    <button @click="remove()">
                        <i class="fa fa-minus">‌</i>
                    </button>
                </div>
                <div>
                    {{quantity}}
                </div>
                <div style="padding-left:10px">
                    <button @click="add()">
                        <i class="fa fa-plus">‌</i>
                    </button>
                </div>
            </div>
            <div v-if="token && role !== 'CUSTOMER'">
                <button @click="editProduct()">Edit Product</button>
            </div>
        </div>
        <div v-if="showId !== null && edit == true && token && role !== 'CUSTOMER'">
            <div style="width: 100%;display: flex; flex-direction: column; align-items: center;">
                <table>
                    <tbody>
                    <tr>
                        <td>Titolo:</td>
                        <td>
                            <textarea id="title" v-model="form.title"> {{ Products.find(p => p.id === showId)?.name }}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>Descrizione:</td>
                        <td>
                            <textarea id="description" v-model="form.pDescription">{{ Products.find(p => p.id === showId)?.description }}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>Nuovo Prezzo:</td>
                        <td>
                            <input type="number" v-model.number="form.price"></input>€
                        </td>
                    </tr>
                    <tr>
                        <td>Vecchio Prezzo:</td>
                        <td>
                            <p @value="Products.find(p => p.id === showId)?.price" type="number">{{ Products.find(p => p.id === showId)?.price }}€</p>
                        </td>
                    </tr>
                    <tr>
                        <td>Nuova Quantità:</td>
                        <td>
                            <input type="number" v-model.number="form.quantity"></input>€
                        </td>
                    </tr>
                    <tr>
                        <td>Vecchia Quantità:</td>
                        <td>
                            <p @value="Products.find(p => p.id === showId)?.quantity" type="number">{{ Products.find(p => p.id === showId)?.quantity }}</p>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div style="padding-bottom:20px; ">
                <img :src="Products.find(p => p.id === showId)?.image" style="box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;" height="42%" width="42%" />
            </div>
            <div>
                <button @click="saveProduct(showId)"> salva </button>
                <button @click="editProduct()"> annulla </button>
                <button @click="deleteProduct(showId)"> elimina prodotto </button>
            </div>
        </div>
    </div>

  </div>
</template>

<style>
.card {
  background-color: #fff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background-color: white;
  width: -webkit-fill-available;
}

.imageSpace {
  display: flex;
  justify-content: center;
  padding-bottom: 7px;
}

.nameSpace {
  padding-bottom: 7px;
}

/* Stile per il popup */
.details-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 80%;
  background-color: white;
  box-shadow: 0px 2px 100px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 20px;
  text-align: center;
}

.font{
    color: black;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    border: none;
    padding: 5px 10px;
    font-size: 20px;
    cursor: pointer;
  }
</style>