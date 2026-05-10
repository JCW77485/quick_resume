import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import { useAuth } from './store/auth';
import './index.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);

// Initialize auth before mounting
const auth = useAuth();
auth.init().then(() => {
  app.mount('#root');
});
