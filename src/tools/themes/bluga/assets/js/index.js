const hamburgerIcon = document.querySelector('.navigation__hamburger');
const closeIcon = document.querySelector('.navigation__close');
const navigationItem = document.querySelector('.navigation__container');
const postsFilter = document.querySelector('.posts-filter__container');

//  Navigation

hamburgerIcon.addEventListener('click', () => {
  navigationItem.classList.add('open');
});

closeIcon.addEventListener('click', () => {
  navigationItem.classList.remove('open');
});

// Filter

function handleScrollRight() {
  postsFilter.scrollBy({ left: 100, behavior: 'smooth' });
}

function handleScrollLeft() {
  postsFilter.scrollBy({ left: -100, behavior: 'smooth' });
}
