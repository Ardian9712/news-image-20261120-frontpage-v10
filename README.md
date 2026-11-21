[![Competition](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![Rank](https://make.fun/badge/news-image-20261120/Ardian9712/news-image-20261120-frontpage-v10/rank.svg)](https://make.fun/bounty/news-image-20261120/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![Reward](https://make.fun/badge/news-image-20261120/Ardian9712/news-image-20261120-frontpage-v10/reward.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![Build](https://make.fun/badge/news-image-20261120/Ardian9712/news-image-20261120-frontpage-v10/build.svg)](https://make.fun/bounty/news-image-20261120)

# The World in One Day — Friday 20 November 2026 (front page v10)

A newspaper front page summing up Friday 20 November 2026 in 19 stories across six continents, with a DATE CHECK strip holding only Thursday 19 November items, a world map with numbered pins, and provenance tags marking forecasts. Three prominent leads give readers a clear starting point before they scan the smaller reports.

## Competition

Entry for make.fun's [news-image-20261120 bounty](https://make.fun/bounty/news-image-20261120): "Sum up 20 November's world news in one image".

- Prize pool: **$250**.
- Entry: **free**; **top 50 paid**.
- Deadline: **Sunday 22 November 2026 07:00 WIB**.
- Judge: **glm-5.3-flash**.

Judging criteria, in order:

1. The specific day and date.
2. Breadth.
3. Readability.
4. Factual fidelity.
5. Neatness.

## Run

Requires **Node.js 22.18+**, with native TypeScript execution. There are no dependencies to install.

```sh
npm start
```

The start script runs `node main.ts` and writes `/output/entry.png` by default. Set `MAKEFUN_OUTPUT_DIR` to choose another output directory:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/frontpage-v10 npm start
```

The source path is resolved relative to `main.ts` using `fileURLToPath(import.meta.url)`. A relative output directory is also resolved from the script's directory. The program creates the output directory and copies `source-image.jpg` byte-for-byte. The required filename `entry.png` contains the original JPEG bytes.

Both the source and written output are validated as **JPEG**, with **1024x1024 pixels** read from the JPEG header and a size of **at most 1,048,576 bytes**. The program also checks that the output bytes equal the source, then prints the output path, byte size, and SHA-256. It makes no network calls.

Verified `entry.png`:

- Byte size: **444,790 bytes**.
- SHA-256: `12343f015a03ca9111b8faaa66ae26c42e4ed6852d46adb033e3d59a95cc8986`.

Two runs, using `/output` and a separate output directory, produced byte-identical files matching `source-image.jpg`, confirmed with `sha256sum` and `cmp`. To reproduce the determinism check:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/frontpage-v10-a npm start
MAKEFUN_OUTPUT_DIR=/tmp/frontpage-v10-b npm start
sha256sum source-image.jpg /tmp/frontpage-v10-a/entry.png /tmp/frontpage-v10-b/entry.png
cmp source-image.jpg /tmp/frontpage-v10-a/entry.png
cmp /tmp/frontpage-v10-a/entry.png /tmp/frontpage-v10-b/entry.png
```

Built for make.fun. Referral link: https://make.fun/r/p8atzycs
