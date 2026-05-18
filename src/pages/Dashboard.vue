<template>
  <div class="flex min-h-full flex-col bg-slate-50">
    <Navbar />
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:py-12">
      <div
        v-if="paymentStatus"
        :class="['mb-6 p-4 rounded-xl text-sm font-semibold shadow-sm', paymentStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200']"
      >
        <div class="flex items-center gap-2">
          <component
            :is="paymentStatus === 'success' ? 'CheckCircle' : 'AlertCircle'"
            :size="18"
          />
          {{ paymentStatus === 'success' ? 'Payment successful! You are now a Pro user.' : 'Payment verification failed. Please contact support.' }}
        </div>
      </div>

      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            My Resumes
          </h1>
          <p class="mt-1 text-slate-500">
            Manage and edit your saved resumes.
          </p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98] sm:flex-none"
            @click="createNew"
          >
            <FilePlus :size="18" /> New resume
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="auth.loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="order.length === 0"
        class="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center md:px-12 md:py-24"
      >
        <div class="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 shadow-sm">
          <FileText :size="32" />
        </div>
        <h2 class="text-2xl font-bold text-slate-900">
          Ready to get hired?
        </h2>
        <p class="mx-auto mt-2 max-w-sm text-slate-500">
          Create your first resume by choosing a template or starting from a sample.
        </p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            class="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-100 transition hover:bg-brand-700 active:scale-[0.98]"
            @click="createNew"
          >
            Create from scratch
          </button>
          <router-link
            to="/templates"
            class="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Browse all templates
          </router-link>
        </div>
      </div>

      <!-- Resume Grid -->
      <div
        v-else
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <template
          v-for="id in order"
          :key="id"
        >
          <div
            v-if="resumes[id]"
            class="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-brand-400 hover:shadow-lg"
          >
            <router-link
              :to="`/builder/${id}`"
              class="relative block bg-slate-50 p-4"
            >
              <!-- Dynamic Thumbnail container -->
              <div
                ref="thumbContainers"
                class="relative mx-auto overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                style="width: 100%; aspect-ratio: 8.5 / 11;"
              >
                <div
                  :style="{
                    transformOrigin: 'top left',
                    transform: `scale(${scales[id] || 0.3})`,
                    width: '8.5in'
                  }"
                >
                  <ResumePreview
                    :resume="resumes[id]"
                    :scale="1"
                    :interactive="false"
                  />
                </div>
              </div>
              <!-- Hover overlay -->
              <div class="absolute inset-0 flex items-center justify-center bg-brand-900/10 opacity-0 transition group-hover:opacity-100">
                <div class="rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-xl">
                  Edit Resume
                </div>
              </div>
            </router-link>

            <div class="flex items-center justify-between gap-3 border-t border-slate-100 p-4">
              <div class="min-w-0 flex-1">
                <div class="truncate font-bold text-slate-900">
                  {{ resumes[id].name }}
                </div>
                <div class="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Updated {{ new Date(resumes[id].updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }}
                </div>
              </div>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  title="Duplicate"
                  class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-brand-600"
                  @click="duplicateResume(id)"
                >
                  <Copy :size="18" />
                </button>
                <button
                  type="button"
                  title="Delete"
                  class="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  @click="confirmId = id"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
    <AppFooter />

    <!-- Confirmation Modal -->
    <div
      v-if="confirmId"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click="confirmId = null"
    >
      <div
        class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        @click.stop
      >
        <div class="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-red-600">
          <Trash2 :size="24" />
        </div>
        <h3 class="text-xl font-bold text-slate-900">
          Delete this resume?
        </h3>
        <p class="mt-2 text-sm leading-relaxed text-slate-500">
          This action cannot be undone. All data for "{{ resumes[confirmId!]?.name }}" will be permanently removed.
        </p>
        <div class="mt-6 flex flex-col gap-2">
          <button
            type="button"
            class="w-full rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-700"
            @click="handleDelete"
          >
            Yes, delete it
          </button>
          <button
            type="button"
            class="w-full py-2.5 text-sm font-bold text-slate-500 transition hover:text-slate-800"
            @click="confirmId = null"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Copy, FilePlus, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import AppFooter from '../components/AppFooter.vue';
import ResumePreview from '../components/ResumePreview.vue';
import { useResumes } from '../store/resumes';
import { useAuth } from '../store/auth';

export default defineComponent({
  name: 'Dashboard',
  components: {
    Navbar,
    AppFooter,
    ResumePreview,
    Copy,
    FilePlus,
    FileText,
    Trash2,
    CheckCircle,
    AlertCircle
  },
  data() {
    return {
      confirmId: null as string | null,
      paymentStatus: null as 'success' | 'fail' | null,
      scales: {} as Record<string, number>,
      resizeObserver: null as ResizeObserver | null
    };
  },
  computed: {
    resumes() { return useResumes().resumes; },
    order() { return useResumes().order; },
    auth() { return useAuth(); }
  },
  async mounted() {
    const sessionId = this.$route.query.session_id as string;
    if (sessionId) {
        const auth = useAuth();
        const success = await auth.verifyPayment(sessionId);
        this.paymentStatus = success ? 'success' : 'fail';
        this.$router.replace({ query: {} });
    }

    await useResumes().fetchResumes();

    // Initialize scaling
    this.$nextTick(() => {
        this.calculateScales();
        this.resizeObserver = new ResizeObserver(() => this.calculateScales());
        const containers = this.$refs.thumbContainers as HTMLElement[];
        if (containers) containers.forEach(c => this.resizeObserver?.observe(c));
    });
  },
  beforeUnmount() {
    this.resizeObserver?.disconnect();
  },
  methods: {
    calculateScales() {
        const containers = this.$refs.thumbContainers as HTMLElement[];
        if (!containers) return;

        const newScales: Record<string, number> = {};
        this.order.forEach((id, idx) => {
            const container = containers[idx];
            if (container) {
                newScales[id] = container.clientWidth / 816;
            }
        });
        this.scales = newScales;
    },
    createNew() {
      const id = useResumes().createResume();
      this.$router.push(`/builder/${id}`);
    },
    duplicateResume(id: string) {
      useResumes().duplicateResume(id);
      this.$nextTick(() => this.calculateScales());
    },
    handleDelete() {
      if (this.confirmId) {
        useResumes().deleteResume(this.confirmId);
        this.confirmId = null;
        this.$nextTick(() => this.calculateScales());
      }
    }
  }
});
</script>
