document.addEventListener('alpine:init', async () => {
  Alpine.store('contentLists', {
    ids: [],
    selectAll: false,
    async deleteContent() {
      console.log(this.ids);
      const removeUrl = `${bluga.appLink}/api/content/remove-content`;
      try {
        const res = await axios.post(removeUrl, {
          ids: this.ids,
        });
        if (res.data.data === 'removed') {
          window.location.reload();
        }
      } catch (err) {
        // this.message = 'error removing contents';
        console.log(err);
      }
    },
    checkAll() {
      const checkboxes = document.querySelectorAll('.content-list-check');
      const allValues = [];

      [...checkboxes].forEach((el) => allValues.push(el.value));

      this.ids = !this.selectAll ? allValues : [];
      this.selectAll = !this.selectAll;
    },
  });
});