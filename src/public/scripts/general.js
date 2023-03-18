$(function () {
  bsCustomFileInput.init();
});

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
