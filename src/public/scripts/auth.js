const handleLogin = async (email, password) => {
  console.log('TRUTH', email, password);
  try {
    const res = await axios.post('/api/user/login', {
      email,
      password,
    });
    console.log(res.data);
    if (res.data?.code === 200 && res.data?.data === 'login success') {
      window.location.replace('/admin');
    }
  } catch (err) {
    // this.message = 'error while saving content';
    // this.show = true;
    console.log(err.response.data);
  }
};
