(() => {
  'use strict';

  const hashElement = document.getElementById('shaValue');
  const copyButton = document.getElementById('copyHash');
  if (hashElement && copyButton) {
    copyButton.addEventListener('click', async () => {
      const value = hashElement.textContent.trim();
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const input = document.createElement('textarea');
        input.value = value;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      copyButton.textContent = '복사 완료';
      window.setTimeout(() => { copyButton.textContent = 'SHA-256 복사'; }, 1600);
    });
  }

  const config = window.ACS_CONFIG || {};
  const downloadUrl = typeof config.downloadUrl === 'string' ? config.downloadUrl.trim() : '';
  const downloadFileName = typeof config.downloadFileName === 'string' ? config.downloadFileName.trim() : '';
  const downloadLinks = [...document.querySelectorAll('[data-download-link]')];

  downloadLinks.forEach((link) => {
    if (downloadUrl) {
      link.href = downloadUrl;
      if (downloadFileName && !/^https?:/i.test(downloadUrl)) link.setAttribute('download', downloadFileName);
    } else {
      link.href = '#download';
      link.setAttribute('aria-disabled', 'true');
      link.title = 'assets/config.js의 downloadUrl을 설정해 주세요.';
      link.addEventListener('click', (event) => event.preventDefault());
    }
  });

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate([
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 }) : null;

  if (observer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.feature-grid article, .flow-line > div, .install-guide-card, .download-card').forEach((element) => observer.observe(element));
  }
})();
