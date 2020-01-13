Laymic API簡易説明
===============

主だった部分のみ表記しています。詳細なAPIについてはソースを見たほうが早いので、そちらを参照ください。

## Laymicクラス

ビューワー本体を制御するクラス。

### new Laymic(LaymicPages, LaymicOptions)

laymicインスタンスの生成。

第一引数の`LaymicPages`は漫画本編用に表示するページと、サムネイルとして表示される画像セットをまとめたオブジェクト。

第二引数の`LaymicOptions`は各種設定を詰め込んだオブジェクト。省略可能。

### Laymic.open(isDisableFullscreen)

laymicビューワーを展開する。

第一引数であるBooleanの`isDisableFullscreen`がtrueであるならば、「自動的に全画面で開く」処理を強制無効化する。省略可能。

### Laymic.close()

laymicビューワーを閉じる。

## LaymicApplicatorクラス

複数のビューワーを管理することを前提としたクラス。

### new LaymicApplicator(templateSelector | LaymicApplicatorOptions, LaymicOptions)

LaymicApplicatorインスタンスの生成。

第一引数はtemplateとして認識する要素を指定するselector文字列か、LaymicApplicator用のオプションをまとめたオブジェクト。

第二引数の`LaymicOptions`はLaymic側の各種設定を詰め込んだオブジェクト。省略可能。

### LaymicApplicator.open(viewerId)

指定したviewerIdと紐づくLaymicインスタンスがあれば、それを展開する。

### LaymicApplicator.close(viewerId)

指定したviewerIdと紐づくLaymicインスタンスがあれば、それを閉じる。
