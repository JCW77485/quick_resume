<template>
  <div class="flex min-h-full flex-col bg-slate-50">
    <Navbar />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>
        <p class="text-slate-600">
          Manage users, view sales performance, and update templates.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Users :size="24" />
            </div>
            <div>
              <div class="text-sm font-medium text-slate-500">
                Total Users
              </div>
              <div class="text-2xl font-bold text-slate-900">
                {{ stats.totalUsers }}
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <DollarSign :size="24" />
            </div>
            <div>
              <div class="text-sm font-medium text-slate-500">
                Total Revenue
              </div>
              <div class="text-2xl font-bold text-slate-900">
                ${{ stats.totalSales }}
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="rounded-lg bg-amber-50 p-2 text-amber-600">
              <TrendingUp :size="24" />
            </div>
            <div>
              <div class="text-sm font-medium text-slate-500">
                Total Resumes
              </div>
              <div class="text-2xl font-bold text-slate-900">
                {{ stats.totalResumes }}
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Layout :size="24" />
            </div>
            <div>
              <div class="text-sm font-medium text-slate-500">
                Active Templates
              </div>
              <div class="text-2xl font-bold text-slate-900">
                10
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Chart Section -->
        <div class="lg:col-span-2 space-y-8">
          <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="mb-6 text-lg font-bold text-slate-900">
              Sales History (Last 7 Days)
            </h3>
            <div class="h-[300px]">
              <LineChart
                v-if="chartData.labels.length > 0"
                :data="chartData"
                :options="chartOptions"
              />
              <div v-else class="flex h-full items-center justify-center text-slate-400">
                No sales data available.
              </div>
            </div>
          </div>

          <!-- User Management -->
          <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div class="border-b border-slate-200 bg-white px-6 py-4">
              <h3 class="text-lg font-bold text-slate-900">
                Recent Users
              </h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-slate-500">
                <thead class="bg-slate-50 text-xs font-semibold text-slate-700 uppercase">
                  <tr>
                    <th class="px-6 py-3">
                      User
                    </th>
                    <th class="px-6 py-3">
                      Status
                    </th>
                    <th class="px-6 py-3">
                      Joined
                    </th>
                    <th class="px-6 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                  <tr
                    v-for="user in stats.recentUsers"
                    :key="user.id"
                    class="hover:bg-slate-50"
                  >
                    <td class="px-6 py-4">
                      <div class="font-medium text-slate-900">
                        {{ user.email }}
                      </div>
                      <div class="text-xs">
                        ID: {{ user.id }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        :class="[
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                          user.is_pro ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        ]"
                      >
                        {{ user.is_pro ? 'Pro' : 'Free' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      {{ new Date(user.created_at).toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="text-brand-600 hover:text-brand-800 font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                  <tr v-if="stats.recentUsers.length === 0">
                    <td colspan="4" class="px-6 py-8 text-center text-slate-400 italic">
                      No users found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Template Management & Status -->
        <div class="space-y-8">
          <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="mb-4 text-lg font-bold text-slate-900">
              Add New Template
            </h3>
            <p class="text-xs text-slate-500 mb-4">
              Register a new Vue layout component for the builder.
            </p>
            <form
              class="space-y-4"
              @submit.prevent="addTemplate"
            >
              <div>
                <label class="block text-sm font-medium text-slate-700">Template Name</label>
                <input
                  v-model="newTemplate.name"
                  type="text"
                  class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. Modern Professional"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700">Template ID</label>
                <input
                  v-model="newTemplate.id"
                  type="text"
                  class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. modern_prof"
                >
              </div>
              <button
                type="submit"
                class="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 transition"
              >
                Register Layout
              </button>
            </form>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="mb-4 text-lg font-bold text-slate-900">
              System Health
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-600">PHP Backend</span>
                <span class="font-medium text-emerald-600">Operational</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-600">MySQL Database</span>
                <span class="font-medium text-emerald-600">Operational</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-600">Stripe Integration</span>
                <span class="font-medium text-emerald-600">Operational</span>
              </div>
              <div class="pt-2 text-[10px] text-slate-400">
                Running in production mode. Session security enabled.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import {
  Users,
  DollarSign,
  TrendingUp,
  Layout
} from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import AppFooter from '../components/AppFooter.vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  type ChartData,
  type ChartOptions
} from 'chart.js';
import { Line as LineChart } from 'vue-chartjs';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

interface SalesPoint {
    date: string;
    amount: number | string;
}

interface RecentUser {
    id: string;
    email: string;
    is_pro: number | boolean;
    created_at: string;
}

export default defineComponent({
  name: 'Admin',
  components: {
    Navbar,
    AppFooter,
    LineChart,
    Users,
    DollarSign,
    TrendingUp,
    Layout
  },
  data() {
    return {
      stats: {
          totalUsers: 0,
          totalSales: 0,
          totalResumes: 0,
          salesHistory: [] as SalesPoint[],
          recentUsers: [] as RecentUser[]
      },
      newTemplate: {
        name: '',
        id: ''
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      } as ChartOptions<'line'>
    };
  },
  computed: {
    chartData(): ChartData<'line'> {
      return {
        labels: this.stats.salesHistory.map(s => s.date),
        datasets: [
          {
            label: 'Daily Revenue ($)',
            data: this.stats.salesHistory.map(s => Number(s.amount)),
            borderColor: '#1e6cf5',
            backgroundColor: 'rgba(30, 108, 245, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      };
    }
  },
  async mounted() {
      await this.fetchStats();
  },
  methods: {
    async fetchStats() {
        try {
            const res = await axios.get('./api/index.php/admin/stats');
            if (res.data && !res.data.error) {
                this.stats = res.data;
            }
        } catch (e) {
            console.error("Failed to fetch admin stats", e);
        }
    },
    addTemplate() {
      if (!this.newTemplate.name || !this.newTemplate.id) return;
      alert(`Template Registry: In a production environment, this would save the template metadata to the MySQL 'templates' table and notify the build system to include the new layout.`);
      this.newTemplate = { name: '', id: '' };
    }
  }
});
</script>
