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
        const res = await axios.get('/api/content/' + id);
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
      let saveUrl = '/api/save-content';
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
          status: 'DRAFT',
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
