<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');
// Lista dei prodotti
const Products = ref( [
  {
    id: 1,
    name: "Laptop Gaming",
    price: 1499.99,
    image: "https://picsum.photos/200?random=1",
    description: "Potente laptop da gaming con scheda grafica dedicata e display 144Hz."
  },
  {
    id: 2,
    name: "Smartphone Pro",
    price: 899.99,
    image: "https://picsum.photos/200?random=2",
    description: "Smartphone di ultima generazione con fotocamera da 108MP e display AMOLED."
  },
  {
    id: 3,
    name: "Smartwatch Fitness",
    price: 199.99,
    image: "https://picsum.photos/200?random=3",
    description: "Smartwatch con monitoraggio del battito cardiaco e GPS integrato."
  },
  {
    id: 4,
    name: "Cuffie Wireless",
    price: 129.99,
    image: "https://picsum.photos/200?random=4",
    description: "Cuffie con cancellazione del rumore attiva e autonomia di 30 ore."
  },
  {
    id: 5,
    name: "Monitor 4K Ultra HD",
    price: 499.99,
    image: "https://picsum.photos/200?random=5",
    description: "Monitor IPS 4K con HDR e frequenza di aggiornamento di 144Hz."
  },
  {
    id: 6,
    name: "Mouse da Gaming RGB",
    price: 59.99,
    image: "https://picsum.photos/200?random=6",
    description: "Mouse ergonomico con 12 tasti programmabili e illuminazione RGB."
  },
  {
    id: 7,
    name: "Tastiera Meccanica",
    price: 89.99,
    image: "https://picsum.photos/200?random=7",
    description: "Tastiera meccanica con switch rossi e retroilluminazione RGB personalizzabile."
  },
  {
    id: 8,
    name: "Sedia da Gaming",
    price: 249.99,
    image: "https://picsum.photos/200?random=8",
    description: "Sedia ergonomica con cuscino lombare e inclinazione fino a 180°."
  },
  {
    id: 9,
    name: "Stampante Laser",
    price: 299.99,
    image: "https://picsum.photos/200?random=9",
    description: "Stampante laser monocromatica con connettività Wi-Fi e alta velocità di stampa."
  },
  {
    id: 10,
    name: "Webcam Full HD",
    price: 69.99,
    image: "https://picsum.photos/200?random=10",
    description: "Webcam 1080p con microfono integrato per videoconferenze di alta qualità."
  },
  {
    id: 11,
    name: "Hard Disk Esterno 1TB",
    price: 89.99,
    image: "https://picsum.photos/200?random=11",
    description: "Disco rigido esterno da 1TB, perfetto per archiviazione sicura."
  },
  {
    id: 12,
    name: "Router Wi-Fi 6",
    price: 179.99,
    image: "https://picsum.photos/200?random=12",
    description: "Router dual-band con tecnologia Wi-Fi 6 per connessioni ultra veloci."
  },
  {
    id: 13,
    name: "Scheda Grafica RTX 4080",
    price: 1299.99,
    image: "https://picsum.photos/200?random=13",
    description: "Scheda grafica di ultima generazione con 16GB di memoria GDDR6X."
  },
  {
    id: 14,
    name: "Microfono USB Professionale",
    price: 99.99,
    image: "https://picsum.photos/200?random=14",
    description: "Microfono USB a condensatore per streaming e registrazione audio di alta qualità."
  },
  {
    id: 15,
    name: "Power Bank 20000mAh",
    price: 39.99,
    image: "https://picsum.photos/200?random=15",
    description: "Power bank ad alta capacità con ricarica rapida per dispositivi mobili."
  },
  {
    id: 16,
    name: "Console Next-Gen",
    price: 599.99,
    image: "https://picsum.photos/200?random=16",
    description: "Console di nuova generazione con SSD ultra veloce e grafica 4K."
  },
  {
    id: 17,
    name: "Tablet 10 Pollici",
    price: 349.99,
    image: "https://picsum.photos/200?random=17",
    description: "Tablet con schermo 10' Full HD e penna digitale inclusa."
  },
  {
    id: 18,
    name: "Auricolari Bluetooth",
    price: 79.99,
    image: "https://picsum.photos/200?random=18",
    description: "Auricolari true wireless con riduzione del rumore attiva e lunga autonomia."
  },
  {
    id: 19,
    name: "Altoparlante Bluetooth",
    price: 59.99,
    image: "https://picsum.photos/200?random=19",
    description: "Speaker portatile con audio stereo potente e resistenza all'acqua IPX7."
  },
  {
    id: 20,
    name: "Zaino Tech Impermeabile",
    price: 49.99,
    image: "https://picsum.photos/200?random=20",
    description: "Zaino con scomparti imbottiti per laptop e accessori tecnologici."
  }
]);

import { computed } from 'vue';

const filteredProducts = computed(() => {
  return [...Products.value]
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder.value === 'asc'
        ? a.price - b.price
        : b.price - a.price;
    });
});

// Variabili reattive
const showId = ref<number | null>(null);
const show = ref(false);
const quantity = ref<number>(0);

// Funzione per aprire il dettaglio del prodotto
function selectItems(id: number) {
  console.log("ID selezionato:", id);
  showId.value = id;
  show.value = true;
}

// Funzione per chiudere il div
function closeDetails() {
  show.value = false;
  showId.value = null;
}

function remove() {
    this.quantity -= 1;
}

function add() {
    this.quantity += 1;
}
</script>

<template>
  <div style="width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    overflow: auto;" class="font">
    
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

    <div v-for="product in filteredProducts" :key="product.id" style="width:25%">
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

    <!-- Div per il dettaglio del prodotto -->
    <div v-if="show" class="details-popup font"> 
      <button class="close-btn" @click="closeDetails"><i class="fa fa-window-close" aria-hidden="true"></i></button>
      <div v-if="showId !== null">
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