# Prinshu Shukla — Cybersecurity Portfolio

A responsive, futuristic cybersecurity portfolio built with HTML, CSS, and vanilla JavaScript. No Node.js, build step, package installation, API key, backend, database, paid template, domain, or hosting subscription is required.

## Run locally on Windows

1. Download the ZIP and choose **Extract All**. Do not open `index.html` from inside the ZIP preview; the linked CSS/JavaScript files need to remain together in the extracted folder.
2. For the easiest start, double-click `START_PORTFOLIO.bat`. It opens the regular `index.html` page, which loads `styles.css` and `script.js` from the same folder.
3. Alternatively, open `Prinshu_Portfolio_Standalone.html`. Its CSS and JavaScript are embedded in the HTML, so the visual styles and interactions do not depend on separate CSS/JS files. Keep `resume.pdf` beside it for the résumé links.
4. For a localhost preview, use `START_LOCAL_SERVER.bat` if Python is installed. It serves the folder at `http://127.0.0.1:8000`.

## Files

- `index.html` — main page content and structure
- `styles.css` — theme, responsive layout, animation, and mobile styling
- `script.js` — mobile navigation, reveal and metric animations, project filters, simulated terminal, modal, and copy-email action
- `Prinshu_Portfolio_Standalone.html` — self-contained CSS/JavaScript edition for quick local preview
- `resume.pdf` — résumé used by the page links
- `favicon.svg` — site icon

## Free deployment using GitHub Pages

1. Sign in at https://github.com/.
2. Create a **public** repository named exactly `YOUR-GITHUB-USERNAME.github.io` (replace the placeholder with your GitHub username).
3. Extract this ZIP and upload the *contents* of the ZIP—not the enclosing folder—to the repository root. Make sure `index.html`, `styles.css`, `script.js`, `favicon.svg`, and `resume.pdf` are directly at the root.
4. Commit the files to the `main` branch.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**, then select branch `main` and folder `/(root)`. Save.
7. Visit `https://YOUR-GITHUB-USERNAME.github.io/` after the deployment completes. Check the Pages section for any build/deployment status if it is not available yet.

Official documentation:
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Verified interactions

- Responsive navigation and the mobile menu
- Animated counters and rotating focus labels
- Project category filters
- Simulated portfolio terminal with `help`, `about`, `skills`, `projects`, `metrics`, `contact`, and `clear`
- Terminal information modal, close button, backdrop, and Escape key
- Copy-email action with fallback text if clipboard permissions are unavailable
- Résumé links, project notes, keyboard focus styles, and reduced-motion support

The simulated terminal only matches a list of built-in portfolio commands. It does not execute operating-system commands or connect to target systems.

## Before publishing

The résumé contains the phone number and email address from the supplied resume. Anyone can access a public website, so remove or replace `resume.pdf` and edit public contact details if you do not want them published. Verify experience dates, achievements, metrics, employer names, and certifications before deployment.
