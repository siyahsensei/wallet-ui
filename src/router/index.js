import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Route components
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import AccountsView from '@/views/accounts/AccountsView.vue'
import AccountDetailView from '@/views/accounts/AccountDetailView.vue'
import AssetsView from '@/views/assets/AssetsView.vue'
import AssetDetailView from '@/views/assets/AssetDetailView.vue'
import TransactionsView from '@/views/transactions/TransactionsView.vue'
import TransactionDetailView from '@/views/transactions/TransactionDetailView.vue'
import ProfileView from '@/views/ProfileView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false, guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false, guestOnly: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: AccountsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/accounts/:id',
      name: 'account-detail',
      component: AccountDetailView,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/assets',
      name: 'assets',
      component: AssetsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/assets/:id',
      name: 'asset-detail',
      component: AssetDetailView,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions/:id',
      name: 'transaction-detail',
      component: TransactionDetailView,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isAuthenticated
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !isLoggedIn) {
    // Redirect to login page if not logged in
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // Check if route is guest only (like login page)
  else if (to.meta.guestOnly && isLoggedIn) {
    // Redirect to dashboard if already logged in
    next({ name: 'dashboard' })
  } 
  else {
    // Allow navigation
    next()
  }
})

export default router 