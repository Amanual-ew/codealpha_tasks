/* ---------- 1. Select elements ---------- */
const galleryItems = document.querySelectorAll('.gallery-item');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;
let visibleImages = [];

/* ---------- 2. Filtering ---------- */
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hide');
      } else {
        item.classList.add('hide');
      }
    });

    // Update visible list for lightbox navigation
    updateVisibleImages();
  });
});

/* ---------- 3. Update visible images list ---------- */
function updateVisibleImages() {
  visibleImages = [...galleryItems].filter(
    item => !item.classList.contains('hide')
  );
}

/* ---------- 4. Open lightbox ---------- */
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    updateVisibleImages();
    const imgSrc = item.querySelector('img').src;
    currentIndex = visibleImages.findIndex(v => v === item);
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
  });
});

/* ---------- 5. Close lightbox ---------- */
function closeLightbox() {
  lightbox.classList.remove('active');
}

closeBtn.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

/* ---------- 6. Navigate prev/next ---------- */
function showImage(index) {
  if (index < 0) index = visibleImages.length - 1;
  if (index >= visibleImages.length) index = 0;
  currentIndex = index;
  lightboxImg.src = visibleImages[currentIndex].querySelector('img').src;
}

prevBtn.addEventListener('click', e => {
  e.stopPropagation();
  showImage(currentIndex - 1);
});

nextBtn.addEventListener('click', e => {
  e.stopPropagation();
  showImage(currentIndex + 1);
});

/* ---------- 7. Keyboard controls ---------- */
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  if (e.key === 'ArrowRight') showImage(currentIndex + 1);
});

/* ---------- 8. Initialize ---------- */
updateVisibleImages();