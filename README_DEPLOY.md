# Accident Content Studio Proposal Landing

Static deployment package for the Accident Content Studio proposal and download page.

## Local preview

Open `index.html` directly, or run:

```bash
python -m http.server 8080
```

Then browse to `http://localhost:8080`.

## GitHub Pages

1. Upload this folder to a repository.
2. Keep `.nojekyll` in the root.
3. Enable GitHub Pages from the repository root or `/docs` directory.
4. The download button serves `downloads/Accident_Content_Studio_R33_Windows_Project.zip`.

## Replace with final installer

When the signed Windows installer is ready:

1. Copy it into `downloads/`.
2. Update every element with `data-download-link` in `index.html`.
3. Update the displayed filename, size, version, and SHA-256.

## Pages

- `index.html`: proposal, desktop-program preview, implemented scope, download

## Brand note

See `BRAND_ASSET_STATUS.md`. The exact extracted SuaveForge final-logo geometry is included and applied.

## 다운로드 링크 변경

다운로드 URL은 HTML이 아니라 아래 설정 파일에서만 관리합니다.

```text
assets/config.js
```

예시:

```javascript
window.ACS_CONFIG = Object.freeze({
  downloadUrl: 'downloads/Accident_Content_Studio_R33_Windows_Project.zip'
});
```

- 저장소 내부 파일: `downloads/파일명.zip`
- GitHub Releases 등 외부 파일: 전체 HTTPS URL
- `index.html`을 수정할 필요가 없습니다.


## 다운로드 기록

- GitHub Pages만으로는 누가 다운로드했는지 확인할 수 없습니다.
- `tracking/google-apps-script/`의 스크립트를 Google Sheet에 배포한 뒤 `assets/config.js`에 URL을 설정하면 이름/회사명과 다운로드 횟수를 기록할 수 있습니다.
- 기록 기능을 켜면 사용자는 다운로드 전에 이름 또는 회사명을 입력하고 저장 동의 항목을 확인합니다.
