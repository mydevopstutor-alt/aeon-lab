# Aeon Industries showcase

A static site in plain HTML, CSS and JS, with no build step.

- `index.html`: the hero and the crew grid
- `mission.html` + `mission.js`: the "Breach the Docker Dock" mission
- `style.css`: shared neon theme (`--bg`, `--teal`, `--mag` variables)

## Adding your section
1. Edit `<yourname>/index.html` (dev, lilith, azrael, liu, samael, kashi, daegon) and replace the PLACEHOLDER block.
2. Keep `<meta name="robots" content="noindex">` and `<link rel="stylesheet" href="../style.css">`.
3. Put your assets (images, audio, JS) in your own folder and use relative paths.
4. Test it locally with `python3 -m http.server 8000`, then commit.
