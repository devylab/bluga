document.addEventListener('alpine:init', async () => {
  Alpine.store('themes', {
    themes: [],
    async getThemes() {
      try {
        const res = await axios.get('/api/themes');
        console.log(res.data.data);
        this.themes = res.data.data || [];
      } catch (err) {
        console.log(err);
        // this.message = 'error while saving content';
        // this.show = true;
      }
    },
    async activateTheme(themeId) {
      try {
        console.log(themeId);
        await axios.post('/api/theme/' + themeId);
        window.location.reload();
      } catch (err) {
        console.log(err);
        // this.message = 'error while saving content';
        // this.show = true;
      }
    },
  });
});
