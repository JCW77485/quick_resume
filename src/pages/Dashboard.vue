<template>
  <div class="flex min-h-full flex-col bg-slate-50">
    <Navbar />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            My Resumes
          </h1>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            @click="createNew"
          >
            <FilePlus :size="16" /> New resume
          </button>
        </div>
      </div>

      <div
        v-if="order.length === 0"
        class="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center"
      >
        <div class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-brand-700">
          <FileText :size="22" />
        </div>
        <h2 class="mt-4 text-lg font-semibold text-slate-900">
          You don't have any resumes yet
        </h2>
        <p class="mt-1 text-slate-600">
          Create a blank resume or start from a filled-in sample to see how it works.
        </p>
        <div class="mt-5 flex justify-center gap-2">
          <button
            type="button"
            class="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            @click="createNew"
          >
            New resume
          </button>
          <router-link
            to="/templates"
            class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Browse templates
          </router-link>
        </div>
      </div>

      <div
        v-else
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <template
          v-for="id in order"
          :key="id"
        >
          <div
            v-if="resumes[id]"
            class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <router-link
              :to="`/builder/${id}`"
              class="block bg-slate-100 p-3"
            >
              <div style="width: 100%; aspect-ratio: 8.5 / 11; overflow: hidden">
                <div
                  style="transform-origin: top left; transform: scale(0.33); width: 8.5in"
                >
                  <ResumePreview
                    :resume="resumes[id]"
                    :scale="1"
                    :interactive="false"
                  />
                </div>
              </div>
            </router-link>
            <div class="flex items-center justify-between gap-3 border-t border-slate-200 p-3">
              <div class="min-w-0">
                <div class="truncate font-semibold text-slate-900">
                  {{ resumes[id].name }}
                </div>
                <div class="text-xs text-slate-500">
                  Updated {{ new Date(resumes[id].updatedAt).toLocaleDateString() }}
                </div>
              </div>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  title="Duplicate"
                  class="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  @click="duplicateResume(id)"
                >
                  <Copy :size="16" />
                </button>
                <button
                  type="button"
                  title="Delete"
                  class="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  @click="confirmId = id"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
<<<<<<< Updated upstream
    <AppFooter />
=======
    <Footer />
>>>>>>> Stashed changes

    <!-- Confirmation Modal -->
    <div
      v-if="confirmId"
      class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      @click="confirmId = null"
    >
      <div
        class="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-slate-900">
          Delete this resume?
        </h3>
        <p class="mt-1 text-sm text-slate-600">
          This can't be undone. The resume will be removed from your browser.
        </p>
        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            @click="confirmId = null"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            @click="handleDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Copy, FilePlus, FileText, Trash2 } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
<<<<<<< Updated upstream
import AppFooter from '../components/AppFooter.vue';
=======
import Footer from '../components/Footer.vue';
>>>>>>> Stashed changes
import ResumePreview from '../components/ResumePreview.vue';
import { useResumes } from '../store/resumes';

export default defineComponent({
  name: 'Dashboard',
  components: {
    Navbar,
<<<<<<< Updated upstream
    AppFooter,
=======
    Footer,
>>>>>>> Stashed changes
    ResumePreview,
    Copy,
    FilePlus,
    FileText,
    Trash2
  },
  data() {
    return {
      confirmId: null as string | null
    };
  },
  computed: {
    resumes() { return useResumes().resumes; },
    order() { return useResumes().order; }
  },
  methods: {
    createNew() {
      const id = useResumes().createResume();
      this.$router.push(`/builder/${id}`);
    },
    duplicateResume(id: string) {
      useResumes().duplicateResume(id);
    },
    handleDelete() {
      if (this.confirmId) {
        useResumes().deleteResume(this.confirmId);
        this.confirmId = null;
      }
    }
  }
});
</script>
