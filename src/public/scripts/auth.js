const handleLogin = async (email, password) => {
  try {
    const res = await axios.post('/api/user/login', { email, password });
    if (res.data?.code === 200 && res.data?.data === 'login success') {
      window.location.replace('/admin');
    }
  } catch (err) {
    $(document).Toasts('create', {
      title: 'Login Error',
      class: 'bg-danger',
      autohide: true,
      delay: 4000,
      body: err?.response?.data?.error,
    });
  }
};
