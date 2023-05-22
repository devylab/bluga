document.addEventListener('alpine:init', async () => {
  let editor; //editor instance
  const renderEditor = (data) => {
    editor = new EditorJS({
      holder: 'editorjs',
      data,
      placeholder: 'Let`s write an awesome story!',
      tools: {
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile(file) {
                const formData = new FormData();
                formData.append('field', file);
                return axiosApiInstance.post(`/upload/content-image`, formData).then((res) => res.data);
              },
            },
          },
        },
        attaches: {
          class: AttachesTool,
          config: {
            uploader: {
              uploadByFile(file) {
                const formData = new FormData();
                formData.append('field', file);
                return axiosApiInstance.post(`/upload/content-file`, formData).then((res) => res.data);
              },
            },
          },
        },
        code: CodeTool,
      },
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
    data: {},
    title: '',
    contentStatus: [{ value: 'DRAFT' }, { value: 'PRIVATE' }, { value: 'PUBLIC' }],
    selectedStatus: 'DRAFT',
    thumbnail: '',
    thumbnailFile: '',
    async getContent(id) {
      try {
        const res = await axiosApiInstance.get(`/content/${id}`);
        const rawContent = JSON.parse(res.data?.data?.rawContent || null);
        this.data = rawContent;
        this.title = res.data?.data?.title;
        this.thumbnail = res.data?.data?.thumbnail;
        this.selectedStatus = res.data?.data?.status;
        return rawContent;
      } catch (err) {
        console.log(err);
        return {};
      }
    },

    async saveContent(rawContent) {
      let saveUrl = `/content/save-content`;

      // get id if exists
      const contentID = window.location.pathname.split('/edit/')[1];
      if (contentID) saveUrl += `?content=${contentID}`;

      const title = document.getElementById('contentTitle');
      if (!rawContent) rawContent = await editor.save(); // get content if it doesn't exist

      try {
        let data = {};
        if (this.thumbnailFile) {
          const formData = new FormData();
          formData.append('title', title.value);
          formData.append('rawContent', JSON.stringify(rawContent));
          formData.append('status', this.selectedStatus);
          formData.append('description', '');
          formData.append('thumbnail', this.thumbnailFile);
          data = formData;
        } else {
          data = {
            title: title.value,
            rawContent: JSON.stringify(rawContent),
            status: this.selectedStatus,
            description: '',
          };
        }

        const res = await axiosApiInstance.post(saveUrl, data, {
          headers: {
            'Content-Type': this.thumbnailFile ? 'multipart/form-data' : 'application/json',
          },
        });

        toastr.success(`content saved as ${res.data?.data?.status}`);
        if (this.thumbnailFile) this.thumbnailFile = '';
        if (!contentID) window.history.pushState('Edit', '', res.data?.data?.to); // redirect if not in edit state
      } catch (err) {
        if (err?.response?.status !== 401) {
          toastr.error('error while saving content');
        }
      }
    },

    selectThumbnail(event) {
      Alpine.store('content').fileToDataUrl(event, (src, file) => {
        Alpine.store('content').thumbnail = src;
        Alpine.store('content').thumbnailFile = file;
      });
    },

    fileToDataUrl(event, callback) {
      if (!event.target.files.length) return;

      const file = event.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (e) => callback(e.target.result, file);
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
