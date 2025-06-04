// directives/v-img-loaded.ts
export default {
  mounted(el: HTMLImageElement) {
    el.classList.add('img-loading');

    const onLoad = () => {
      el.classList.remove('img-loading');
      el.classList.add('img-loaded');
    };

    if (el.complete && el.naturalHeight !== 0) {
      onLoad(); // Cached image
    } else {
      el.addEventListener('load', onLoad);
    }
  },

  unmounted(el: HTMLImageElement) {
    el.removeEventListener('load', () => {}); // Prevent memory leaks
  }
};
