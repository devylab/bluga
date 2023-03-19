document.addEventListener('alpine:init', async () => {
  let editor; //editor instance
  const renderEditor = (data) => {
    editor = new EditorJS({
      holder: 'editorjs',
      data,
      placeholder: 'Let`s write an awesome story!',
      onChange: async (api) => {
        const rawContent = await api.saver.save();
        Alpine.store('content').saveContent(rawContent);
      },
    });
  };

  Alpine.store('content', {
    show: false,
    data: {},
    title: '',
    message: '',
    hideMessage() {
      this.message = '';
      this.show = false;
    },
    async getContent(id) {
      try {
        const res = await axios.get(`${bluga.appLink}api/content/${id}`);
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
    async saveContent(rawContent) {
      let saveUrl = `${bluga.appLink}api/content/save-content`;
      this.message = 'saving content';
      this.show = true;

      // get id if exists
      const contentID = window.location.pathname.split('/edit/')[1];
      if (contentID) saveUrl += `?content=${contentID}`;

      const title = document.getElementById('contentTitle');
      if (!rawContent) rawContent = await editor.save(); // get content if it doesn't exist

      try {
        const res = await axios.post(saveUrl, {
          title: title.value,
          rawContent,
          // status: 'DRAFT',
        });
        this.message = `content saved as ${res.data?.data?.status}`;
        this.show = true;
        if (!contentID) window.history.pushState('Edit', '', res.data?.data?.to); // redirect if not in edit state
      } catch (err) {
        this.message = 'error while saving content';
        this.show = true;
      }
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
