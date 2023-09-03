document.addEventListener('alpine:init', async () => {
  const defaultValues = { id: '', firstName: '', lastName: '', username: '', email: '' };
  Alpine.store('profile', {
    data: defaultValues,
    async getProfile() {
      try {
        const res = await axiosApiInstance.get(`/user/profile`);
        this.data = res.data?.data || defaultValues;
      } catch (error) {
        toastr.error('error while getting profile');
      }
    },
  });

  await Alpine.store('profile').getProfile();
});
