import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import LoginView from '../views/LoginView.vue'
import RegistrationView from '../views/RegistrationView.vue'
import CreateProductView from '../views/CreateProductView.vue'
import UsersView from '../views/UsersView.vue'
import userProfileEditorComponent from '../components/userProfileEditorComponent.vue'
import CartView from '../views/CartView.vue'
import MyOrdersView from '../views/MyOrdersView.vue'
import OrdersView from '../views/OrdersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationView,
    },
    {
      path: '/CreateProduct',
      name: 'CreateProduct',
      component: CreateProductView,
    },
    {
      path: '/EditProduct',
      name: 'EditProduct',
      component: ProductsView,
    },
    {
      path: '/Users',
      name: 'Users',
      component: UsersView,
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: userProfileEditorComponent,
    },
    {
      path: '/Cart',
      name: 'Cart',
      component: CartView,
    },
    {
      path: '/MyOrders',
      name: 'myOrders',
      component: MyOrdersView,
    },
    {
      path: '/Orders',
      name: 'orders',
      component: OrdersView,
    },
  ],
})

export default router
