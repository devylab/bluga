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

const saveContent = async () => {
  const title = document.getElementById('contentTitle');
  const outputData = await editor.save();
  const res = await axios.post('/api/create-content', {
    title: title.value,
    rawContent: outputData,
    status: 'DRAFT',
  });
  console.log('DATATATATAT', res.data);
  window.history.pushState('Edit', '', res.data?.data?.to);
};

const editor = new EditorJS({
  holder: 'editorjs',
  placeholder: 'Let`s write an awesome story!',
  onChange: (api, event) => {
    // console.log("Now I know that Editor's content changed!", event);
    // console.log('API!', api);
  },
});
