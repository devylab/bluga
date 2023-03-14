document.addEventListener('alpine:init', async () => {
  Alpine.store('contents', {
    headings: [],
    contents: [],
    async getContents() {
      try {
        const res = await axios.get('/api/contents');
        this.contents = res.data?.data?.contents || [];
        this.headings = res.data?.data?.headings || [];

        console.log(this.contents);
        console.log(this.headings);
      } catch (err) {
        console.log(err);
        // this.message = 'error while saving content';
        // this.show = true;
      }
    },
  });
});
