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
  const downloadFileName = typeof config.downloadFileName === 'string' ? config.downloadFileName.trim() : '';
  const trackingEndpoint = typeof config.trackingEndpoint === 'string' ? config.trackingEndpoint.trim() : '';
  const trackingEnabled = Boolean(config.trackingEnabled && trackingEndpoint);
  const downloadLinks = [...document.querySelectorAll('[data-download-link]')];

  const modal = document.getElementById('downloadTrackerModal');
  const identityForm = document.getElementById('downloadIdentityForm');
  const nameInput = document.getElementById('downloaderName');
  let pendingSource = 'unknown';

  const openModal = (source) => {
    if (!modal) return;
    pendingSource = source || 'unknown';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => nameInput?.focus(), 30);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  document.querySelectorAll('[data-download-modal-close]').forEach((button) => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });

  const startDownload = () => {
    if (!downloadUrl) return;
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    if (downloadFileName && !/^https?:/i.test(downloadUrl)) anchor.download = downloadFileName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    try {
      const count = Number(localStorage.getItem('acsDownloadClickCount') || '0') + 1;
      localStorage.setItem('acsDownloadClickCount', String(count));
      localStorage.setItem('acsLastDownload', new Date().toISOString());
    } catch { /* storage may be unavailable */ }
  };

  const postTrackingRecord = (fields) => {
    if (!trackingEnabled) return;
    const sinkName = 'acsDownloadTrackingSink';
    let sink = document.querySelector(`iframe[name="${sinkName}"]`);
    if (!sink) {
      sink = document.createElement('iframe');
      sink.name = sinkName;
      sink.hidden = true;
      document.body.appendChild(sink);
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = trackingEndpoint;
    form.target = sinkName;
    form.hidden = true;
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value ?? '');
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    window.setTimeout(() => form.remove(), 1500);
  };

  downloadLinks.forEach((link, index) => {
    if (downloadUrl) {
      link.href = downloadUrl;
      if (downloadFileName && !/^https?:/i.test(downloadUrl)) link.setAttribute('download', downloadFileName);
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
      if (trackingEnabled) {
        event.preventDefault();
        openModal(index === 0 ? 'hero' : 'download-section');
      }
    });
  });

  identityForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(identityForm);
    postTrackingRecord({
      name: formData.get('name'),
      contact: formData.get('contact'),
      timestamp: new Date().toISOString(),
      release: config.trackingRelease || 'R33',
      source: pendingSource,
      downloadUrl,
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });
    closeModal();
    startDownload();
    identityForm.reset();
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
