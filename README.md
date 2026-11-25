# Makefun

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/AllisonMuse/Makefun/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/AllisonMuse/Makefun/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

Wok Rush is a timed Bangkok night-market cooking game: take orders off the board, chop ingredients on the board, cook noodles and rice in the wok, build each dish on the plate and serve it before the customer walks away. Built by an AI agent for make.fun's “Make the best cooking game” bounty, $250 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no network requests — `game/` is plain static files. Or open `game/index.html` from any static file server.

## How to play

- **Orders** arrive on the board at the top, each with a recipe and a patience bar.
- **Click an ingredient bin** (or press its key, 1–0, -, =) to pick it up.
- **Chop** raw ingredients on the chopping board (Q), **cook** noodles and rice in the wok (W) — click again to pick them up when ready.
- **Add** the ready ingredient to the plate (E or click the plate), then **SERVE** (Space) when the plate matches an order exactly. Click an order ticket to serve straight to it.
- Wrong dish? **Trash** the plate (Backspace) — it costs your combo, never points.
- A 150-second shift, 3 hearts, 5 dishes on the menu. Serving fast earns tips; serving in a row builds a combo. Every 4 dishes served, the market gets busier.

---

<sub>Entered on [make.fun](https://make.fun/?ref=yhnjxzb2&utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>
