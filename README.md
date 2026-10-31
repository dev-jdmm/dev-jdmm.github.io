# Jonathan Monroy Mancera · Portfolio

Personal portfolio of **Jonathan Monroy Mancera**, Junior Software Engineer from Bogotá, Colombia.

A static, dependency-free site (HTML, CSS and vanilla JavaScript) designed to be hosted for free on **GitHub Pages**.

## Structure

```text
.
├── index.html                 # All page content
├── .nojekyll                  # Tells GitHub Pages to serve files as-is
└── assets/
    ├── css/style.css          # Styles, colors and animations
    ├── js/main.js             # Interactions (menu, reveal, filters, lightbox…)
    ├── img/
    │   ├── projects/          # Project screenshots (.webp)
    │   ├── certificates/      # Certificate previews (.webp)
    │   ├── favicon.svg
    │   └── og-image.png       # Preview image for link sharing
    └── certificates/          # Original certificate PDFs
```

## Publish on GitHub Pages

1. Create a new repository on GitHub. Naming it **`dev-jdmm.github.io`** makes the site live at `https://dev-jdmm.github.io`.
2. Upload every file and folder from this directory to the repository root (drag and drop works in the GitHub web UI), then commit.
3. Go to **Settings → Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. After a minute or two, the site is online at the address shown on that page.

## Preview locally

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 8000
```

## Editing

- **Text and projects:** edit `index.html`. Each project is an `<article class="project">` block; set `data-status` to `progress`, `undeployed` or `academic` so the filters work.
- **Colors:** change the variables at the top of `assets/css/style.css` (`--navy-900`, `--blue-600`, `--sky-400`, …).
- **Screenshots:** replace the files in `assets/img/projects/` (16:10 images look best).

Animations automatically turn off for visitors who have "reduce motion" enabled in their system settings.

---

© Jonathan Monroy Mancera · business.jonathan.monroy@gmail.com
