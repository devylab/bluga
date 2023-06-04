document.addEventListener('alpine:init', async () => {
  // TODO: Add a loader to load contents
  Alpine.store('contentLists', {
    lists: [],
    headings: [],
    ids: [],
    contentStatus: [{ value: '', name: 'All' }, { value: 'DRAFT' }, { value: 'PRIVATE' }, { value: 'PUBLIC' }],
    selectedStatus: '',
    selectAll: false,
    search: '',
    async getContents() {
      try {
        const contentsUrl = '/contents';
        const params = {};
        if (this.search) params.search = this.search;
        if (this.selectedStatus && this.selectedStatus !== 'All') params.status = this.selectedStatus;

        const res = await axiosApiInstance.get(contentsUrl, { params });
        if (res?.data?.data) {
          this.lists = res?.data?.data.contents;
          this.headings = res?.data?.data.headings;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async deleteContent() {
      const removeUrl = '/content/remove-content';
      try {
        const res = await axiosApiInstance.post(removeUrl, {
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

  Alpine.store('contentLists').getContents();
});
