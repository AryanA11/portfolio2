document.addEventListener('DOMContentLoaded', function () {
  var reveals = document.querySelectorAll('.reveal');
  var videos = document.querySelectorAll('video');

  var hasObserver = 'IntersectionObserver' in window;

  // ---- Prepare videos for lazy loading ----
  // Move each <source src> into data-src and clear it so the browser
  // downloads nothing until the video scrolls into view.
  videos.forEach(function (video) {
    video.removeAttribute('autoplay');
    video.preload = 'none';
    video.loop = true;
    video.muted = true; // required for programmatic play() without a user gesture

    if (hasObserver) {
      video.querySelectorAll('source').forEach(function (source) {
        var src = source.getAttribute('src');
        if (src) {
          source.dataset.src = src;
          source.removeAttribute('src');
        }
      });
      video.load(); // commit the now-empty sources
    }
  });

  // Fallback: no IntersectionObserver -> reveal everything and let videos play.
  if (!hasObserver) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
    videos.forEach(function (v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
    return;
  }

  // ---- Scroll-reveal (once) ----
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  });

  reveals.forEach(function (el) { revealObserver.observe(el); });

  // ---- Lazy-load + play videos only while in view ----
  var videoObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target;

      if (entry.isIntersecting) {
        // Load the real sources the first time it enters view.
        if (!video.dataset.loaded) {
          video.querySelectorAll('source').forEach(function (source) {
            if (source.dataset.src) source.src = source.dataset.src;
          });
          video.load();
          video.dataset.loaded = 'true';
        }
        var p = video.play();
        if (p && p.catch) p.catch(function () {}); // ignore autoplay rejections
      } else {
        video.pause();
      }
    });
  }, {
    threshold: 0.25 // play once ~a quarter of the video is on screen
  });

  videos.forEach(function (v) { videoObserver.observe(v); });
});
