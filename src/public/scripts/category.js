document.addEventListener('alpine:init', async () => {
  Alpine.store('category', {
    id: '',
    name: '',
    setData(event) {
      const data = JSON.parse(event.currentTarget.getAttribute('value') || null);
      Alpine.store('category').id = data.id;
      Alpine.store('category').name = data.name;
    },
    async saveCategory() {
      let saveUrl = `/category`;
      try {
        if (!this.name.trim()) {
          throw new Error('category name is empty');
        }

        const res = await axiosApiInstance.post(saveUrl, {
          id: this.id,
          name: this.name.toLowerCase(),
        });

        toastr.success(`category saved`);
        window.location.reload();
      } catch (err) {
        toastr.error('error while saving category');
      }
    },
    async removeCategory(event) {
      const data = event.currentTarget.getAttribute('value');
      let deleteUrl = `/category/${data}`;
      try {
        const res = await axiosApiInstance.delete(deleteUrl);

        toastr.success(`category removed`);
        window.location.reload();
      } catch (err) {
        toastr.error(err?.response?.data?.error || 'error while removing category');
      }
    },
  });
});
