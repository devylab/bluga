document.addEventListener('alpine:init', () => {
  Alpine.store('sidebar', {
    show: window.innerWidth >= 774,
    toggleSidebar() {
      this.show = !this.show;
    },
  });

  Alpine.store('app', {
    appLoading: window.innerWidth >= 774,
    toggleSidebar() {
      this.show = !this.show;
    },
  });
});
