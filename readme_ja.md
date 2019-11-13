laymic - overlay comic viewer
=======================

オーバーレイ表示により設置するサイトを選ばない漫画ビューワーです。
「2p見開き横読み表示 <-> 縦読み表示」の切り替え対応。

## 使用方法

漫画ビューワー単体・javascriptのみで使用する場合は`Laymic`クラス。

一つのページに複数のビューワーを登録したい場合・htmlによるテンプレート記述を用いたい場合は`LaymicApplicator`クラスの使用を想定しています。

**commonjs形式でのLaymicクラス記述**

```javascript

const { Laymic } = require("laymic"); 

const pages = [
  "page0.png",
  "page1.png",
  "page2.png",
  "page3.png",
  "page4.png"
];

const laymic = new Laymic(pages, {
  // 原稿画像横幅
  pageWidth: 690,
  // 原稿画像縦幅
  pageHeight: 976,
})

// ここではbutton要素のクリックイベントに展開イベントを登録している
el.addEventListener("click", () => {
  laymic.open();
})

```

**iife形式でのLaymicApplicatorクラス記述**

```html
<!-- ビューワー1 -->
<div class="laymic_template" data-viewer-id="laymic0">
  <img data-src="page0.png">
  <img data-src="page1.png">
  <img data-src="page2.png">
  ...以下ページを好きなだけ並べる
</div>
<button class="laymic_opener" type="button" data-for="laymic0">
  ここをクリックでlaymic0のビューワー展開
</button>

<!-- ビューワー2 -->
<div class="laymic_template" data-viewer-id="laymic1">
  <img data-src="page0.png">
  <img data-src="page1.png">
  <img data-src="page2.png">
  ...以下ページを好きなだけ並べる
</div>
<button class="laymic_opener" type="button" data-for="laymic1">
  ここをクリックでlaymic0のビューワー展開
</button>

<script src="laymic.iife.min.js"></script>
<script>
const applicator = new laymic.LaymicApplicator(".laymic_template", {
  // 原稿画像横幅
  pageWidth: 690,
  // 原稿画像縦幅
  pageHeight: 976,
})
</script>
```

## Laymicの引数

**LaymicPages**
|名前|型|説明|
|---|型|---|
|`pages`|`(string | Element)[]`|表示する漫画ページセット|
|`thumbs`|`string[]`|サムネイルとして表示する画像セット|

**LaymicOptions**

|名前|初期値|説明|
|---|---|---|
|`icons`||アイコンを別のものに変更する。具体的な中身はViewerIconsを参照|
|`stateNames`||ステート変化用クラス名を別のものに変更する。具体的な中身はLaymicStateClassNamesを参照|
|`classNames`||各種クラス名を別のものに変更する。具体的な中身はLaymicClassNamesを参照|
|`viewerId`|`"laymic"`|インスタンスと紐付けられる文字列|
|`pageWidth`|`720`|原稿画像横幅|
|`pageHeight`|`1024`|原稿画像縦幅|
|`vertPageMargin`|`10`|縦読み時のページ間余白ピクセル数値|
|`horizPageMargin`|`0`|横読み時のページ間余白ピクセル数値|
|`viewerPadding`|`10`|漫画ページ表示コンテナ周囲の余白ピクセル数値|
|`viewerDirection`|`"horizontal"`|漫画を読み進める方向のデフォルト値。横読みなら`"horizontal"`、縦読みなら`"vertical"`|
|`isLTR`|`false`|左から右へと流れていく表示形式を取るなら`true`|
|`isVisiblePagination`|`false`|ページ送りボタンを表示する設定|
|`isFirstSlideEmpty`|`true`|横読み時一ページ目を空白として空ける設定|
|`isAppendEmptySlide`|`true`|横読み時 + ページ数が偶数の場合最終ページに空白を追加する|
|`isInstantOpen`|`true`|`location.hash`と`viewerId`が一致していた場合、ページ読み込み直後にビューワーを開く機能。`false`で無効化|
|`progressBarWidth`|`"auto"`|進捗バーの太さを変更する。使用できる値は`"auto"`, `"none"`, `"tint"`, `"medium"`, `"bold"`の五つ|

**LaymicStateClassNames**

|名前|初期値|説明|
|---|---|---|
|`active`|`"laymic_isActive"`|汎用的なアクティブ時ステート|
|`hidden`|`"laymic_isHidden"`|汎用的な非表示時ステート|
|`singleSlide`|`"laymic_isSingleSlide"`|横読み時1p表示がなされている際に付与|
|`showPreference`|`"laymic_isShowPreference"`|設定画面展開中に付与|
|`showThumbs`|`"laymic_isShowThumbs"`|サムネイル表示展開中に付与|
|`showHelp`|`"laymic_isShowHelp"`|ヘルプ表示展開中に付与|
|`fullscreen`|`"laymic_isFullscreen"`|全画面表示時に付与|
|`unsupportedFullscreen`|`"laymic_isUnsupportedFullscreen"`|使用ブラウザがFullscreen APIに未対応の場合に付与|
|`visibleUI`|`"laymic_isVisibleUI"`|UI表示がなされている場合に付与|
|`visiblePagination`|`"laymic_isVisiblePagination"`|ページ送りボタン表示設定が有効な場合に付与|
|`vertView`|`"laymic_isVertView"`|縦読み時に付与|
|`ltr`|`"laymic_isLTR"`|`isLTR`設定が有効な場合に付与|
|`mobile`|`"laymic_isMobile"`|モバイル端末の場合に付与|

**ViewerIcons**

`ViewerIcons`に指定する値は全て`IconData`である必要あり

|名前|説明|
|---|---|
|`close`|閉じるアイコン|
|`fullscreen`|全画面化アイコン|
|`exitFullscreen`|全画面終了アイコン|
|`preference`|設定アイコン|
|`showThumbs`|サムネイル表示アイコン|
|`vertView`|縦読みアイコン|
|`horizView`|横読みアイコン|
|`checkboxOuter`|チェックボックス外側|
|`checkboxInner`|チェックボックス内部|
|`showHelp`|ヘルプ表示アイコン|
|`zoomIn`|拡大アイコン|

**IconData**

|名前|型|説明|
|---|---|---|
|`id`|`string`|アイコンidとして使われる値|
|`className`|`string`|アイコンに付与するクラス名|
|`viewBox`|`string`|アイコンのviewBox|
|`pathDs`|`string[]`|アイコンのpath要素d属性に用いられる文字列配列|

## LaymicApplicator固有の引数

html側に付与出来る引数は概ね`LaymicOptions`と似ていますが、指定方法が異なっています。

また、`icons`と`classNames`と`stateNames`は指定できません。

|名前|説明|
|---|---|
|`dir`|ltr設定を有効にする（`isLTR`が`true`である場合と同様）には`"ltr"`を指定|
|`data-viewer-id`|`viewerId`と同様|
|`data-page-height`|`pageHeight`と同様|
|`data-page-width`|`pageWidth`と同様|
|`data-viewer-direction`|`viewerDirection`と同様|
|`data-is-visible-pagination`|`isVisiblePagination`と同様|
|`data-is-first-slide-empty`|`isFirstSlideEmpty`と同様|
|`data-is-instant-open`|`isInstantOpen`と同様|
|`data-vert-page-margin`|`vertPageMargin`と同様|
|`data-horiz-page-margin`|`horizPageMargin`と同様|
|`data-viewer-padding`|`viewerPadding`と同様|
|`data-progress-bar-width`|`progressBarWidth`と同様|

`laymic_template`内要素固有の設定
|名前|説明|備考|
|---|---|---|
|`data-src`|src属性の代わりとして使用可能|`<img>`要素のみ付与可能|
|`data-thumb-src`|そのページのサムネイル画像を別途指定する||

指定例

```html
<div class="laymic_template" 
  dir="ltr"
  data-viewer-id="laymic0"
  data-viewer-direction="vertical"
  >
  <img data-src="page0.png">
  <img data-src="page1.png">
  <img data-src="page2.png">
</div>
<button class="laymic_opener" type="button" data-for="laymic0">
  ここをクリックでlaymic0のビューワー展開
</button>
```
