document.addEventListener('alpine:init', async () => {
  Alpine.store('contents', {
    headings: [],
    open: false,
    contents: [],
    selectedRows: [],
    toggle() {
      this.open = !this.open;
    },
    toggleColumn(key) {
      // Note: All td must have the same class name as the headings key!
      let columns = document.querySelectorAll('.' + key);
      const currentColumn = document.querySelector(`.${key}`);

      if (currentColumn.classList.contains('hidden') && currentColumn.classList.contains(key)) {
        columns.forEach((column) => {
          column.classList.remove('hidden');
        });
      } else {
        columns.forEach((column) => {
          column.classList.add('hidden');
        });
      }
    },
    getRowDetail($event, id) {
      let rows = this.selectedRows;

      if (rows.includes(id)) {
        let index = rows.indexOf(id);
        rows.splice(index, 1);
      } else {
        rows.push(id);
      }
    },
    selectAllCheckbox($event) {
      let columns = document.querySelectorAll('.rowCheckbox');

      this.selectedRows = [];

      if ($event.target.checked == true) {
        columns.forEach((column) => {
          column.checked = true;
          this.selectedRows.push(parseInt(column.name));
        });
      } else {
        columns.forEach((column) => {
          column.checked = false;
        });
        this.selectedRows = [];
      }
    },
    async getContents() {
      try {
        const res = await axios.get('/api/contents');
        this.contents = res.data?.data?.contents || [];
        this.headings = res.data?.data?.headings || [];
      } catch (err) {
        console.log(err);
        // this.message = 'error while saving content';
        // this.show = true;
      }
    },
  });
});
