# Interval Trainer

A fretboard interval trainer for unlocktheguitar.net with no diagrams. It accompanies the book *No Shapes*.

Four modes:

- **Cells**: a chord, its formula and a 3–5 note interval cell to find in order.
- **Locate**: one interval from one root on one string, timed.
- **Constraints**: a cell plus a rule (one string, a fret range, every note on a different string, and so on).
- **Changes**: a progression against a click; land on the chosen target tones of each chord.

Plain JavaScript with Vite. No framework and no runtime dependencies. Audio is a Karplus-Strong pluck synth using the Web Audio API.

## Run locally

```
npm install
npm run dev
```

## Deploy

Push to GitHub and import the repo in Vercel. It detects Vite, builds with `npm run build` and serves `dist`.

`vercel.json` limits iframe embedding to unlocktheguitar.net. Add any other domain to `frame-ancestors` if you embed it elsewhere.

## Embed

```html
<iframe src="https://interval-trainer-psi.vercel.app/" title="Guitar Interval Trainer" style="width:100%;height:900px;border:0" loading="lazy" allow="autoplay"></iframe>
```

## Files

- `index.html`: markup
- `src/style.css`: styles (light and dark)
- `src/main.js`: theory, generators, audio, UI
