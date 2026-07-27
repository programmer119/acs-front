(() => {
  'use strict';

  const navButtons = [...document.querySelectorAll('[data-demo-view]')];
  const views = [...document.querySelectorAll('[data-view]')];
  const breadcrumb = document.getElementById('demoBreadcrumb');
  const labels = {
    generate: '콘텐츠 생성',
    mosaic: '사진 모자이크',
    schedule: '스케줄',
    history: '생성 이력'
  };

  const setDemoView = (name) => {
    if (!labels[name]) return;
    navButtons.forEach((button) => {
      const active = button.dataset.demoView === name;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    views.forEach((view) => view.classList.toggle('active', view.dataset.view === name));
    if (breadcrumb) breadcrumb.textContent = labels[name];
  };

  navButtons.forEach((button) => button.addEventListener('click', () => setDemoView(button.dataset.demoView)));

  const hashElement = document.getElementById('shaValue');
  const copyButton = document.getElementById('copyHash');
  if (hashElement && copyButton) {
    copyButton.addEventListener('click', async () => {
      const value = hashElement.textContent.trim();
      try {
        await navigator.clipboard.writeText(value);
        copyButton.textContent = '복사 완료';
      } catch {
        const input = document.createElement('textarea');
        input.value = value;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
        copyButton.textContent = '복사 완료';
      }
      window.setTimeout(() => { copyButton.textContent = 'SHA-256 복사'; }, 1600);
    });
  }

  const config = window.ACS_CONFIG || {};
  const downloadUrl = typeof config.downloadUrl === 'string' ? config.downloadUrl.trim() : '';
  const downloadLinks = [...document.querySelectorAll('[data-download-link]')];

  downloadLinks.forEach((link) => {
    if (downloadUrl) {
      link.href = downloadUrl;
    } else {
      link.href = '#download';
      link.setAttribute('aria-disabled', 'true');
      link.title = 'assets/config.js의 downloadUrl을 설정해 주세요.';
    }

    link.addEventListener('click', (event) => {
      if (!downloadUrl) {
        event.preventDefault();
        return;
      }
      try { localStorage.setItem('acsLastDownload', new Date().toISOString()); } catch { /* storage may be unavailable */ }
    });
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
    document.querySelectorAll('.feature-grid article, .flow-line > div, .download-card').forEach((element) => observer.observe(element));
  }
})();
