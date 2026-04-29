declare module "*.vue" {
  import type { DefineComponent } from "vue";
<<<<<<< Updated upstream
  const component: DefineComponent<object, object, unknown>;
=======
  const component: DefineComponent<{}, {}, any>;
>>>>>>> Stashed changes
  export default component;
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
