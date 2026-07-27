(() => {
  'use strict';

  const titles = {
    overview: '운영 현황', devices: 'PC 관리', contents: '콘텐츠 이력',
    schedules: '스케줄', prompts: '프롬프트', reviews: '사진 검수', logs: '오류 로그'
  };
  const navButtons = [...document.querySelectorAll('[data-admin-page]')];
  const pages = [...document.querySelectorAll('[data-admin-view]')];
  const title = document.getElementById('adminTitle');
  const toast = document.getElementById('adminToast');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1800);
  };

  const showPage = (name) => {
    if (!titles[name]) return;
    navButtons.forEach((button) => button.classList.toggle('active', button.dataset.adminPage === name));
    pages.forEach((page) => page.classList.toggle('active', page.dataset.adminView === name));
    if (title) title.textContent = titles[name];
    const hash = `#${name}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  navButtons.forEach((button) => button.addEventListener('click', () => showPage(button.dataset.adminPage)));
  document.querySelectorAll('[data-admin-jump]').forEach((button) => button.addEventListener('click', () => showPage(button.dataset.adminJump)));

  const initial = location.hash.replace('#', '');
  if (titles[initial]) showPage(initial);

  const refresh = document.getElementById('refreshAdmin');
  if (refresh) {
    refresh.addEventListener('click', () => {
      refresh.disabled = true;
      refresh.textContent = '불러오는 중';
      document.querySelectorAll('.bar-chart i').forEach((bar, index) => {
        const current = parseInt(bar.style.height, 10) || 50;
        const delta = ((index * 7 + 3) % 11) - 5;
        bar.style.height = `${Math.max(28, Math.min(94, current + delta))}%`;
      });
      window.setTimeout(() => {
        refresh.disabled = false;
        refresh.textContent = '새로고침';
        showToast('최신 운영 상태를 불러왔습니다.');
      }, 650);
    });
  }

  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('input', () => {
      const query = globalSearch.value.trim().toLocaleLowerCase('ko-KR');
      document.querySelectorAll('.admin-page.active .searchable').forEach((row) => {
        row.classList.toggle('search-hidden', Boolean(query) && !row.textContent.toLocaleLowerCase('ko-KR').includes(query));
      });
    });
  }

  const contentSearch = document.getElementById('contentSearch');
  const contentStatus = document.getElementById('contentStatus');
  const filterContentRows = () => {
    if (!contentSearch || !contentStatus) return;
    const query = contentSearch.value.trim().toLocaleLowerCase('ko-KR');
    const status = contentStatus.value;
    document.querySelectorAll('#contentTable .data-row.content:not(.head)').forEach((row) => {
      const textMatch = !query || row.textContent.toLocaleLowerCase('ko-KR').includes(query);
      const statusMatch = status === 'all' || row.dataset.status === status;
      row.classList.toggle('search-hidden', !(textMatch && statusMatch));
    });
  };
  contentSearch?.addEventListener('input', filterContentRows);
  contentStatus?.addEventListener('change', filterContentRows);

  document.querySelectorAll('.prompt-layout > aside button:not(.add-prompt)').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.prompt-layout > aside button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const heading = document.querySelector('.prompt-editor h2');
      if (heading) heading.textContent = button.querySelector('strong')?.textContent || '프롬프트';
      showToast('선택한 프롬프트를 불러왔습니다.');
    });
  });

  document.querySelectorAll('.review-queue button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.review-queue button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filename = button.querySelector('strong')?.textContent || '사진';
      const heading = document.querySelector('.remote-review h2');
      if (heading) heading.textContent = filename;
    });
  });

  document.querySelectorAll('button:not([data-admin-page]):not([data-admin-jump]):not(#refreshAdmin)').forEach((button) => {
    if (button.closest('.review-queue') || button.closest('.prompt-layout > aside')) return;
    button.addEventListener('click', () => {
      if (button.type === 'submit') return;
      showToast('제안용 화면에서 동작을 확인했습니다.');
    });
  });
})();
