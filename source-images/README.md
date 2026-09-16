# source-images/

Full-resolution originals. **Nothing here is deployed** — it sits outside
`public/`, so it never reaches `out/`.

`npm run images` reads this folder and `public/assets/img/`, and writes
responsive WebP derivatives plus a manifest into `public/assets/opt/`, which is
what `<Plate>` actually serves. Keep the big files here; ship the small ones.
