# R33 Frontend Installation Guide & Download Tracking Update

- Added a Windows SmartScreen installation guide.
- Replaced the example app name in the guide image with `AccidentContentStudio_Setup.exe`.
- Enlarged both primary download CTAs to 76px height and increased visual emphasis.
- Kept download URL configuration in `assets/config.js`.
- Added optional download identity/event logging through Google Apps Script.
- Tracking is disabled by default until `trackingEndpoint` is configured.
- Removed/kept hidden all future web extension and web-admin entry points.

## Tracking limitation

GitHub Pages alone can count neither named downloaders nor reliable per-person downloads. The included Apps Script logs user-entered name/company, contact, timestamp, release, source button, and repeat-download count into Google Sheets.
