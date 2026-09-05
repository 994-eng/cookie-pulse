# Cookie Pulse

Cookie Pulse is a compact **Cookie Chain** activity console. Connect [Nightly](https://nightly.app/), read your native **COOK** balance and recent signatures, then send a real on-chain **Memo** ping with pending → confirmed/failed handling and a Cookiescan explorer link.

This app is built for the Superteam Earn bounty **Create an App on Cookie Chain**. Cookie Chain is a Solana-compatible SVM: `@solana/web3.js` and the Solana wallet adapter work against the community RPC.

**Live app:** [https://994-eng.github.io/cookie-pulse/](https://994-eng.github.io/cookie-pulse/)

GitHub Pages is published from the `main` branch by `.github/workflows/deploy-pages.yml`. The repository Pages source must be **GitHub Actions** (not “Deploy from a branch”).

## Bounty checklist

| Requirement | How Cookie Pulse meets it |
| --- | --- |
| Web app targeting Cookie Chain | Next.js app pointed at `https://rpc.cookiescan.io` |
| Nightly wallet support | `@solana/wallet-adapter-nightly` is first in the wallet modal; Wallet Standard still discovers installed wallets |
| Show connected wallet address | Full address, copy, and Cookiescan link after connect |
| Real on-chain transactions | Memo-program ping signed by the connected wallet, submitted to Cookie Chain RPC |
| Confirmation + errors | Status steps for sign → confirm; explorer link on signature; mapped rejection / fee / RPC errors |
| Application-specific data | Native COOK balance, recent signature list, recent-tx count, last activity, live slot/epoch |
| Comprehensive README | This file |
| Open source | MIT (`LICENSE`) |

Out of scope, as requested: no invented vault/program addresses, no paid API key, no DEX.

## Network

| Resource | URL |
| --- | --- |
| RPC | https://rpc.cookiescan.io |
| Docs | https://docs.cookiechain.wtf |
| Getting started | https://docs.cookiechain.wtf/getting-started |
| Explorer | https://cookiescan.io |
| Explorer API / DAS | https://api.cookiescan.io |
| Nightly | https://nightly.app/ |
| Native asset | COOK (9 decimals, same unit as Solana lamports) |
| Genesis hash (verified via `getGenesisHash`) | `9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2` |
| Memo program (Cookie Chain genesis list) | `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr` |

Point the Solana CLI at the same RPC if you want to inspect the chain locally:

```bash
solana config set --url https://rpc.cookiescan.io
solana cluster-version
solana balance
```

## Local run

Requires Node.js 20+.

```bash
git clone https://github.com/994-eng/cookie-pulse.git
cd cookie-pulse
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Local dev uses an empty `basePath` so routes stay at `/`.

Production static export (same mode GitHub Pages uses):

```bash
NEXT_PUBLIC_BASE_PATH=/cookie-pulse npm run build
```

That writes a static site to `out/`. Preview it locally with any static server, for example `npx serve out`. `next start` is not used — this app is an `output: 'export'` build.

### Environment

Copy `.env.example` to `.env.local`. There are no secrets and no paid keys.

```
NEXT_PUBLIC_COOKIE_RPC_URL=https://rpc.cookiescan.io
NEXT_PUBLIC_COOKIE_EXPLORER_URL=https://cookiescan.io
NEXT_PUBLIC_BASE_PATH=
```

CI sets `NEXT_PUBLIC_BASE_PATH=/cookie-pulse` so assets resolve under the project Pages URL. Leave it empty locally.

Do not put private keys in the repo or in env files. The app never asks for a secret key; it only signs through the wallet adapter.

## Connect Nightly (required)

1. Install [Nightly](https://nightly.app/) (browser extension).
2. Open Cookie Pulse and click **Connect wallet**.
3. Choose **Nightly**. Phantom and Solflare also appear if they are installed, via the standard adapters.
4. Click **Switch Nightly to Cookie Chain**. Nightly’s SVM `changeNetwork()` is called with Cookie Chain’s genesis hash and `https://rpc.cookiescan.io`. Confirm the Nightly popup if it appears.
5. Your full public key is shown on the dashboard.

Nightly network switching is documented here: [Change the adapter network](https://docs.nightly.app/docs/solana/solana/change_network/). Cookie Chain’s genesis hash is fetched live from RPC, with the verified hash above as fallback.

To hold COOK on Cookie Chain, bridge from Solana using the community Hyperlane route described in the [Cookie Chain getting-started docs](https://docs.cookiechain.wtf/getting-started).

## How the ping transaction works

1. Cookie Pulse builds a legacy Solana `Transaction` with one instruction to the **Memo** program (`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`), which Cookie Chain lists as a genesis program.
2. The connected wallet (Nightly / Phantom / Solflare) signs it. No key material is handled by the app.
3. The signed transaction is sent to `https://rpc.cookiescan.io`.
4. The UI moves **Sign → Confirm on-chain → Confirmed** (or **Failed**) and shows the Cookiescan link: `https://cookiescan.io/tx/<signature>`.
5. After confirmation, the activity panel refreshes `getSignaturesForAddress` so the ping appears in recent activity.

If the wallet rejects the request, COOK is insufficient for the fee, the blockhash expires, or RPC is unreachable, the error panel shows a clear message instead of a raw stack.

Dashboard numbers are live RPC reads (`getBalance`, `getSignaturesForAddress`, `getEpochInfo`). The “recent signatures” stat is the count of fetched signatures (up to 20), not a fabricated metric.

## Tech

- Next.js App Router + TypeScript + Tailwind CSS
- `@solana/web3.js`
- `@solana/wallet-adapter-react` + `@solana/wallet-adapter-react-ui`
- `@solana/wallet-adapter-nightly` (required)
- `@solana/wallet-adapter-phantom` and `@solana/wallet-adapter-solflare`

## License

MIT. See [LICENSE](./LICENSE).
