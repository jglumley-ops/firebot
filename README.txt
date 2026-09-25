FireBot PWA 2.1.3
=================

This is a static Progressive Web App. No server-side code or database is required.

WHAT'S NEW IN 2.1.3
- Added smooth-bore tip sizes 15/16 in., 1 1/16 in., and 1 3/16 in.
- Added 40 psi to the smooth-bore nozzle-pressure selector.
- Added a Standard / Updated friction-coefficient selector.
- Standard preserves the original FireBot 1.02 coefficient table.
- Updated uses the supplied updated hose-friction coefficients based on charged/measured internal hose diameter.
- The updated hose-friction coefficients include nominal 1.5, 1.75, 2.0 (with 1.5-in couplings), 2.25, and 2.5-in hose.
- The measured internal diameter selector now shows only the internal diameter, not the coefficient value.
- The result screen still shows the selected coefficient C after calculation.
- The Show Math screen identifies the coefficient set, hose, measured I.D., and C value.

FILES
- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js
- icons/

UPDATING AN EXISTING GITHUB PAGES INSTALL
Upload these files over the existing files in the repository root and commit the changes. The service-worker cache name was bumped to v2.1.3 so installed phones can receive the new app files.

DEPLOYMENT
PWAs need HTTPS for installation and service-worker offline caching (localhost is the development exception). Upload the CONTENTS of this folder to an HTTPS static host such as GitHub Pages.

IPHONE INSTALL
1. Open the deployed HTTPS address in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Tap Add.

ANDROID INSTALL
Open the deployed site in Chrome and use Install app / Add to Home screen, or use FireBot's Install button when Chrome exposes the install prompt.

CALCULATION SET
- Fog: NP = 100 psi and GPM is selected.
- Smooth bore: GPM = 29.7 * d^2 * sqrt(NP).
- Friction loss: FL = C * (GPM/100)^2 * (hose length/100).
- Elevation: EP = 0.5 * height in feet OR 5 * (stories - 1).
- Appliance loss: 0 psi below 350 gpm; at/above 350 gpm, 25 psi for master stream or 10 psi per appliance.
- PDP = NP + FL + APF + EP.

IMPORTANT
This is a reference calculator. Verify against department SOPs, training, equipment, and actual pump-panel conditions before operational use.
