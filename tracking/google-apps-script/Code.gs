const DOWNLOAD_SHEET_NAME = 'Downloads';
const SUMMARY_SHEET_NAME = 'Summary';

function doPost(e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(DOWNLOAD_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(DOWNLOAD_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '기록 시각', '이름/회사명', '연락처', '동일 대상 다운로드 횟수',
      '릴리스', '버튼 위치', '다운로드 URL', '페이지 URL', '유입 경로', '브라우저 정보'
    ]);
    sheet.setFrozenRows(1);
  }

  const params = (e && e.parameter) || {};
  const name = String(params.name || '').trim();
  const contact = String(params.contact || '').trim();
  const values = sheet.getLastRow() > 1
    ? sheet.getRange(2, 2, sheet.getLastRow() - 1, 2).getDisplayValues()
    : [];
  const sameDownloaderCount = values.filter((row) => row[0] === name && row[1] === contact).length + 1;

  sheet.appendRow([
    new Date(), name, contact, sameDownloaderCount,
    params.release || '', params.source || '', params.downloadUrl || '',
    params.pageUrl || '', params.referrer || '', params.userAgent || ''
  ]);

  let summary = spreadsheet.getSheetByName(SUMMARY_SHEET_NAME);
  if (!summary) summary = spreadsheet.insertSheet(SUMMARY_SHEET_NAME);
  summary.getRange('A1').setValue('총 다운로드 기록');
  summary.getRange('B1').setFormula(`=MAX(COUNTA('${DOWNLOAD_SHEET_NAME}'!A:A)-1,0)`);
  summary.getRange('A2').setValue('마지막 다운로드');
  summary.getRange('B2').setFormula(`=IFERROR(MAX('${DOWNLOAD_SHEET_NAME}'!A2:A),"")`);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, total: sheet.getLastRow() - 1 }))
    .setMimeType(ContentService.MimeType.JSON);
}
