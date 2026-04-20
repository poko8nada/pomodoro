# pomodoro

Todo とポモドーロタイマーを並べた、小さな実験用の Web アプリ。

## 目的

- 小さなことを始めるのに躊躇してしまう自分の改善のため
- 手戻りや間違いを嫌う精神構造の改善のため、短い実験として Todo を捉え直す試み

## プロダクト方針（MVP）

- Todo 一覧（または表）とポモドーロタイマーを同一画面に置く
- 1 サイクルは **25 分（集中）＋ 5 分（休憩）で固定**
  - 時間のカスタム UI は後回し
- Todo の登録項目は **まず最小**（例: タスク名、予定サイクル数）。
  - 起算日・完了日・仮説・感想などは必要になった段階で足す
- Todo を選んでタイマーをスタートする
- レイアウトの目安: 画面上部がタイマー、下部が Todo。

## データの置き場

- ブラウザの `localStorage` に永続化する（サーバーなし前提）

## タイマー実装

- 締切ベース: 終了時刻を `Date.now() + 残りミリ秒` のように持ち、表示は常に `max(0, endTime - Date.now())` から算出する。裏タブで `setInterval` が間引かれても、論理上の残り時間は破綻しない
- 補助: `visibilitychange` で `document.visibilityState === 'visible'` のときに、上記の式で一度再計算して UI を更新する（表に戻った直後の表示ズレを減らす）
- PWA / プッシュ通知: タイマー精度の問題とは別軸のため、いったん検討しない

## 技術スタック

- Honox（ファイルルーティングは使えるが、当面はトップのみでよい）
- Tailwind CSS v4（`@tailwindcss/vite`）
- daisyUI（Tailwind のプラグイン。コンポーネント用クラスとテーマ。`app/style.css` で `@plugin 'daisyui'`）
  - themeは `nord` 。ダークモードは基本なし。
- パッケージ管理: `pnpm`（詳細は `package.json`）

## デプロイ

- ホスト先は未決定（GitHub Pages などは保留）
- 方針としては **SSG して静的アセットを置くだけで動く形** でよい
- Cloudflare を使う場合も Worker 実行ではなく Pages / 静的配信寄りでよい

## 開発

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```
