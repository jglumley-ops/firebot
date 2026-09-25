FireBot PWA 2.0
===============

This is a static Progressive Web App. No server-side code or database is required.

FILES
- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js
- icons/

DEPLOYMENT
PWAs need HTTPS for installation and service-worker offline caching (localhost is the development exception).
Upload the CONTENTS of this folder to any HTTPS static host such as GitHub Pages, Cloudflare Pages, Netlify, or an existing web server.

IPHONE INSTALL
1. Open the deployed HTTPS address in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Tap Add.

ANDROID INSTALL
Open the deployed site in Chrome and use Install app / Add to Home screen, or use FireBot's Install button when Chrome exposes the install prompt.

CALCULATION SET
The lookup arrays and formulas were recovered from the original FireBot 1.02 APK:
- Fog: NP = 100 psi and GPM is selected.
- Smooth bore: GPM = 29.7 * d^2 * sqrt(NP).
- Friction loss: FL = C * (GPM/100)^2 * (hose length/100).
- Elevation: EP = 0.5 * height in feet OR 5 * (stories - 1).
- Appliance loss: 0 psi below 350 gpm; at/above 350 gpm, 25 psi for master stream or 10 psi per appliance.
- PDP = NP + FL + APF + EP.

IMPORTANT
This is a reference calculator. Verify against department SOPs, training, equipment, and actual pump-panel conditions before operational use.
