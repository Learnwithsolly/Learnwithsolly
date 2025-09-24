document.addEventListener('DOMContentLoaded', function() {
  // =============================
  // Firebase Init
  // =============================
  const firebaseConfig = {
    apiKey: "AIzaSyAvgEkGU9xizy_XFg-aGD7NnkvtDBdGBtA",
    authDomain: "freelankarx-portfolio.firebaseapp.com",
    projectId: "freelankarx-portfolio",
    storageBucket: "freelankarx-portfolio.firebasestorage.app",
    messagingSenderId: "966215425239",
    appId: "1:966215425239:web:237a699174bfa98b006492",
    measurementId: "G-702ZQ97XWP"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const storage = firebase.storage();

  // =============================
  // Mobile Nav Toggle
  // =============================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // =============================
  // Section Reveal (fix selector)
  // =============================
  const sections = document.querySelectorAll('section'); // use all <section> tags
  const observerOptions = { threshold: 0.1 };
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  sections.forEach(section => revealObserver.observe(section));

  // =============================
  // GSAP Animations
  // =============================
  gsap.from('.hero-content h1', { opacity: 0, y: -50, duration: 1.5, ease: 'power2.out' });
  gsap.from('.hero-content p', { opacity: 0, y: 50, duration: 1.5, delay: 0.3, ease: 'power2.out' });
  gsap.from('.btn', { opacity: 0, scale: 0.8, duration: 1.5, delay: 0.6, ease: 'back.out(1.7)' });

  // =============================
  // Social Icon Hover
  // =============================
  const socialLinks = document.querySelectorAll('.social-icons a');
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => gsap.to(link, { scale: 1.2, duration: 0.3 }));
    link.addEventListener('mouseleave', () => gsap.to(link, { scale: 1, duration: 0.3 }));
  });

  // =============================
  // Reviews Form
  // =============================
  const reviewForm = document.getElementById('reviewForm');
  const reviewsContainer = document.getElementById('reviewsContainer');

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = reviewForm.name.value;
      const reviewText = reviewForm.review.value;
      const rating = reviewForm.rating.value;
      const videoFile = reviewForm.video.files[0];

      let videoURL = "";
      if (videoFile) {
        videoURL = await uploadVideoToCloudinary(videoFile);
      }

      await db.collection('reviews').add({
        name,
        review: reviewText,
        rating,
        videoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      reviewForm.reset();
      loadReviews();
    });
  }

  // Load and Display Reviews
  function loadReviews() {
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = "";
    db.collection('reviews').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
        reviewDiv.innerHTML = `
          <h4>${data.name}</h4>
          <p>${data.review}</p>
          <p>Rating: ${data.rating} / 5</p>
          ${data.videoURL ? `<video controls src="${data.videoURL}" width="300"></video>` : ""}
          <button class="delete-btn" data-id="${doc.id}">Delete</button>
        `;
        reviewsContainer.appendChild(reviewDiv);
      });
      // Delete functionality
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          db.collection('reviews').doc(id).delete().then(loadReviews);
        });
      });
    });
  }
  loadReviews();

  // =============================
  // Cloudinary Upload
  // =============================
  async function uploadVideoToCloudinary(file) {
    const cloudName = "dflqyatre";
    const unsignedPreset = "freelankarx_portfolio"; // ⚠️ safer without space
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", unsignedPreset);

    try {
      const response = await fetch(url, { method: "POST", body: formData });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading video:", error);
      return "";
    }
  }

  // =============================
  // Klaviyo Popup
  // =============================
  const popup = document.getElementById('klaviyoPopup');
  if (popup) {
    const closeBtn = popup.querySelector('.popup-close');
    const klaviyoForm = document.getElementById('klaviyoForm');

    setTimeout(() => popup.style.display = 'block', 7000);

    if (closeBtn) {
      closeBtn.addEventListener('click', () => popup.style.display = 'none');
    }
    window.addEventListener('click', (e) => {
      if (e.target === popup) popup.style.display = 'none';
    });

    if (klaviyoForm) {
      klaviyoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = klaviyoForm.email.value;
        klaviyoForm.innerHTML = '<p class="thank-you">Thank you for subscribing! Check your inbox for a welcome message.</p>';
        setTimeout(() => popup.style.display = 'none', 3000);
      });
    }
  }
});
