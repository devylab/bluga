document.addEventListener('alpine:init', async () => {
  let editor; //editor instance
  const renderEditor = (data) => {
    editor = new EditorJS({
      holder: 'editorjs',
      data,
      placeholder: 'Let`s write an awesome story!',
      onChange: async (api) => {
        Alpine.debounce(
          (async () => {
            const rawContent = await api.saver.save();
            Alpine.store('content').saveContent(rawContent);
          })(),
          500,
        );
      },
    });
  };

  Alpine.store('content', {
    show: false,
    data: {},
    title: '',
    message: '',
    thumbnail: '',
    hideMessage() {
      this.message = '';
      this.show = false;
    },
    async getContent(id) {
      try {
        const res = await axios.get(`${bluga.appLink}/api/content/${id}`);
        this.data = res.data?.data?.rawContent;
        this.title = res.data?.data?.title;
        return res.data?.data?.rawContent;
      } catch (err) {
        console.log(err);
        // this.message = 'error while saving content';
        // this.show = true;
        return {};
      }
    },
    async saveContent(rawContent, status) {
      let saveUrl = `${bluga.appLink}/api/content/save-content`;

      // get id if exists
      const contentID = window.location.pathname.split('/edit/')[1];
      if (contentID) saveUrl += `?content=${contentID}`;

      const title = document.getElementById('contentTitle');
      if (!rawContent) rawContent = await editor.save(); // get content if it doesn't exist

      try {
        this.message = 'saving content';
        this.show = true;
        const res = await axios.post(saveUrl, {
          title: title.value,
          rawContent,
          status: status || 'DRAFT',
        });
        this.message = `content saved as ${res.data?.data?.status}`;
        this.show = true;
        if (!contentID) window.history.pushState('Edit', '', res.data?.data?.to); // redirect if not in edit state
      } catch (err) {
        this.message = 'error while saving content';
        this.show = true;
      }
    },

    selectThumbnail(event) {
      Alpine.store('content').fileToDataUrl(event, (src) => {
        Alpine.store('content').thumbnail = src;
      });
    },

    fileToDataUrl(event, callback) {
      if (!event.target.files.length) return;

      const file = event.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (e) => callback(e.target.result);
    },
  });

  // get id if exists... load data
  const contentID = window.location.pathname.split('/edit/')[1];
  if (contentID) {
    const res = await Alpine.store('content').getContent(contentID);
    renderEditor(res); // render editor with data
  } else {
    renderEditor(); // render editor
  }
});
