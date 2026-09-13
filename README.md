# Christan Franklin — Portfolio

Jekyll site published with GitHub Pages at
<https://christanfranklin7-lab.github.io/Portfolio/>

## Editing content

You should almost never need to touch HTML. All copy lives in `_data/`:

| File | What it controls |
| --- | --- |
| `_data/profile.yml` | Name, headline, about paragraph, email, LinkedIn, resume link, the three value props |
| `_data/stats.yml` | Hero stats and the Measurable Results grid |
| `_data/expertise.yml` | The three competency tabs and their cards |
| `_data/portfolio.yml` | Featured initiatives — summary, actions, outcomes, stack |
| `_data/credentials.yml` | Certifications |
| `_data/nav.yml` | Navigation links |

Edit a YAML file, commit, and GitHub Pages rebuilds in about a minute.

To add a new certification, append to `_data/credentials.yml`:

```yaml
- icon: "🏅"
  title: New Certification Name
  issuer: Issuing Body
  date: Issued Jan 2027
```

## Structure

```
_config.yml          site settings, baseurl
index.html           front matter + section includes
_layouts/default.html   page shell
_includes/           head, nav, hero, about, expertise, impact,
                     portfolio, recognition, contact, footer, counter
_data/               all editable content
assets/css/main.css  all styling
assets/js/main.js    counters, tabs, accordions, nav, particles
Christan-Franklin-Resume.pdf
```

## Local preview

```
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000/Portfolio/>.

## Publishing

Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`.
GitHub runs Jekyll automatically. No build action required.

## Design

Deep slate ground (`#11161c`) with one warm accent (`#f0a35e`). Headlines and
figures in Source Serif 4; everything else in IBM Plex Sans. No gradients, no
glass blur, no particle canvas — all colors and type live at the top of
`assets/css/main.css` as custom properties, so a palette change is six lines.

## Notes

- `baseurl` in `_config.yml` is `/Portfolio`. If you ever rename the repo or
  move to a custom domain, update it or links will break.
- Statistic numbers are rendered into the HTML and animated up to from zero by
  JavaScript. If the script fails, visitors still see the real figures.
- In `_data/stats.yml`, a stat with a `count:` value animates; one without it
  renders static. Comparison figures like `45 → 2 days` omit `count` on purpose.
- Tailwind is no longer loaded. All styling is in `assets/css/main.css`.
