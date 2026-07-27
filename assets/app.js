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


  const screenshotButtons = [...document.querySelectorAll('.screenshot-open')];
  const screenshotDialog = document.getElementById('screenshotDialog');
  const screenshotDialogImage = document.getElementById('screenshotDialogImage');
  const screenshotDialogTitle = document.getElementById('screenshotDialogTitle');
  const screenshotDialogDescription = document.getElementById('screenshotDialogDescription');
  const screenshotDialogCount = document.getElementById('screenshotDialogCount');
  const screenshotDialogClose = document.getElementById('screenshotDialogClose');
  const screenshotPrev = document.getElementById('screenshotPrev');
  const screenshotNext = document.getElementById('screenshotNext');
  let screenshotIndex = 0;

  const showScreenshot = (index) => {
    if (!screenshotButtons.length || !screenshotDialogImage) return;
    screenshotIndex = (index + screenshotButtons.length) % screenshotButtons.length;
    const button = screenshotButtons[screenshotIndex];
    const image = button.querySelector('img');
    screenshotDialogImage.src = button.dataset.full || image?.src || '';
    screenshotDialogImage.alt = image?.alt || '';
    if (screenshotDialogTitle) screenshotDialogTitle.textContent = button.dataset.title || '프로그램 화면';
    if (screenshotDialogDescription) screenshotDialogDescription.textContent = button.dataset.description || '';
    if (screenshotDialogCount) screenshotDialogCount.textContent = `${screenshotIndex + 1} / ${screenshotButtons.length}`;
  };

  if (screenshotDialog && typeof screenshotDialog.showModal === 'function') {
    screenshotButtons.forEach((button, index) => button.addEventListener('click', () => {
      showScreenshot(index);
      screenshotDialog.showModal();
    }));
    screenshotDialogClose?.addEventListener('click', () => screenshotDialog.close());
    screenshotPrev?.addEventListener('click', () => showScreenshot(screenshotIndex - 1));
    screenshotNext?.addEventListener('click', () => showScreenshot(screenshotIndex + 1));
    screenshotDialog.addEventListener('click', (event) => {
      if (event.target === screenshotDialog) screenshotDialog.close();
    });
    document.addEventListener('keydown', (event) => {
      if (!screenshotDialog.open) return;
      if (event.key === 'ArrowLeft') showScreenshot(screenshotIndex - 1);
      if (event.key === 'ArrowRight') showScreenshot(screenshotIndex + 1);
    });
  }


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
    document.querySelectorAll('.screen-story-card, .mosaic-showcase, .screenshot-card, .feature-grid article, .flow-line > div, .install-guide-card').forEach((element) => observer.observe(element));
  }
})();
