window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('appearance')?.addEventListener('click', () => {
    console.log('headache');
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      console.log('\n', localStorage.theme);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Whenever the user explicitly chooses light mode
    // localStorage.theme = 'light';

    // // Whenever the user explicitly chooses dark mode
    // localStorage.theme = 'dark';

    // // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem('theme');
  });
});
document.addEventListener('alpine:init', () => {
  Alpine.store('sidebar', {
    show: window.innerWidth >= 774,

    toggleSidebar() {
      this.show = !this.show;
    },
  });
});
