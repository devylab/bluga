$('#loginBtn').click((event) => {
  event.preventDefault();
  const email = $('#email').val();
  const password = $('#password').val();

  $.post('/api/user/login', { email, password })
    .done((data) => {
      if (data?.code === 200 && data?.data === 'login success') {
        window.location.replace('/admin');
      }
    })
    .fail((error) => {
      $(document).Toasts('create', {
        title: 'Login Error',
        class: 'bg-danger',
        autohide: true,
        delay: 4000,
        body: error.responseJSON.error,
      });
    });
});
