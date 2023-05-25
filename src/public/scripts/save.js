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
          // TODO: RESOLVE DEBOUNCE
          (async () => {
            const rawContent = await api.saver.save();
            Alpine.store('content').saveContent(rawContent);
          })(),
          500,
        );
      },
    });
  };

  // handle tags
  const tagin = new Tagin(document.querySelector('.tagin'), {
    transform: 'input => input.toLowerCase()',
    enter: true,
  });

  Alpine.store('content', {
    data: {},
    title: '',
    description: '',
    contentStatus: [{ value: 'DRAFT' }, { value: 'PRIVATE' }, { value: 'PUBLIC' }],
    selectedStatus: 'DRAFT',
    categories: [],
    selectedCategory: '',
    thumbnail: '',
    thumbnailFile: '',
    async getContent(id) {
      try {
        const res = await axiosApiInstance.get(`/content/${id}`);
        const rawContent = JSON.parse(res.data?.data?.rawContent || null);
        this.data = rawContent;
        this.title = res.data?.data?.title;
        this.description = res.data?.data?.description;
        this.thumbnail = res.data?.data?.thumbnail;
        this.selectedStatus = res.data?.data?.status;
        this.selectedCategory = res.data?.data?.categoryId;
        tagin.addTag([res.data?.data?.tags]);
        return rawContent;
      } catch (err) {
        console.log(err);
        return {};
      }
    },
    async getCategories() {
      try {
        const res = await axiosApiInstance.get('/categories');
        this.categories = res.data?.data || [];
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

      if (!rawContent) rawContent = await editor.save(); // get content if it doesn't exist

      try {
        let data = {};
        const contentTags = tagin.getTag();
        const category = this.selectedCategory
          ? { id: this.selectedCategory }
          : this.categories.find((category) => category.name === 'general');
        if (this.thumbnailFile) {
          const formData = new FormData();
          formData.append('title', this.title);
          formData.append('rawContent', JSON.stringify(rawContent));
          formData.append('status', this.selectedStatus);
          formData.append('description', this.description);
          formData.append('categoryId', category?.id);
          formData.append('tags', contentTags);
          formData.append('thumbnail', this.thumbnailFile);
          data = formData;
        } else {
          data = {
            title: this.title,
            rawContent: JSON.stringify(rawContent),
            status: this.selectedStatus,
            description: this.description,
            categoryId: category?.id,
            tags: contentTags,
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
  await Alpine.store('content').getCategories();
  const contentID = window.location.pathname.split('/edit/')[1];
  if (contentID) {
    const res = await Alpine.store('content').getContent(contentID);
    renderEditor(res); // render editor with data
  } else {
    renderEditor(); // render editor
  }
});
