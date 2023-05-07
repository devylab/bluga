function faviconViewer() {
  return {
    imageUrl: window.bluga.favicon,
    showFileError: false,

    fileChosen(event) {
      this.fileToDataUrl(event, (err, src) => {
        if (err) {
          this.showFileError = true;
        } else {
          this.showFileError = false;
          this.imageUrl = src;
        }
      });
    },

    fileToDataUrl(event, callback) {
      if (!event.target.files.length) return;

      const file = event.target.files[0];
      const reader = new FileReader();
      const maxSize = 500000;

      if (file.size > maxSize) {
        callback(true);
      } else {
        reader.readAsDataURL(file);
        reader.onload = (e) => callback(false, e.target.result);
      }
    },
  };
}

$('#blogFavicon').change(() => {
  const file = $('#blogFavicon').prop('files')[0];
  const maxSize = '500000';
  if (file.size > maxSize) {
    $('#blogFavicon').addClass('is-invalid');
    $('#favicon-msg').show();
  } else {
    $('#blogFavicon').removeClass('is-invalid');
    $('#favicon-msg').hide();
  }
});
