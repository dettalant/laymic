import { ViewerPages, ViewerIcons, ViewerUIButtons, LaymicClassNames, LaymicStateClassNames } from "#/interfaces/index";
export default class DOMBuilder {
    private icons;
    readonly classNames: LaymicClassNames;
    readonly stateNames: LaymicStateClassNames;
    constructor(icons?: Partial<ViewerIcons>, classNames?: Partial<LaymicClassNames>, stateNames?: Partial<LaymicStateClassNames>);
    private readonly defaultLaymicClassNames;
    private readonly defaultLaymicStateClassNames;
    /**
     * 初期状態でのアイコンセットを返す
     * @return アイコンをひとまとめにしたオブジェクト
     */
    private readonly defaultMangaViewerIcons;
    /**
     * swiper-container要素を返す
     * @param  className 要素のclass名として付記される文字列
     * @param  pages     要素が内包することになるimg src配列
     * @param  isLTR     左から右に流れる形式を取るならtrue
     * @return           swiper-container要素
     */
    createSwiperContainer(pages: ViewerPages, isLTR?: boolean, isFirstSlideEmpty?: boolean, isAppendEmptySlide?: boolean): HTMLElement;
    /**
     * 漫画ビューワーコントローラー要素を返す
     * @param  id    要素のid名となる文字列
     * @param  isLTR 左から右に流れる形式を取るならtrue
     * @return       [コントローラー要素, コントローラー要素が内包するボタンオブジェクト]
     */
    createViewerController(): [HTMLElement, ViewerUIButtons];
    createZoomWrapper(): HTMLElement;
    /**
     * use要素を内包したSVGElementを返す
     * @param  linkId    xlink:hrefに指定するid名
     * @param  className 返す要素に追加するクラス名
     * @return           SVGElement
     */
    private createSvgUseElement;
    /**
     * 漫画ビューワーが用いるアイコンを返す
     * use要素を用いたsvg引用呼び出しを使うための前処理
     * @return 漫画ビューワーが使うアイコンを詰め込んだsvg要素
     */
    createSVGIcons(): SVGElement;
    /**
     * 空のdiv要素を返す
     * @return div要素
     */
    createDiv(): HTMLDivElement;
    /**
     * 空のbutton要素を返す
     * @return button要素
     */
    createButton(className?: string): HTMLButtonElement;
    createSpan(): HTMLSpanElement;
    createParagraph(): HTMLParagraphElement;
    createCheckBoxButton(label: string, className?: string): HTMLButtonElement;
    createSelectButton(label: string, values: string[], className?: string): HTMLButtonElement;
    createEmptySlideEl(): HTMLElement;
    /**
     * ヘルプとして表示する部分を出力する
     * @return helpWrapperとして用いられるHTMLElement
     */
    createHelpWrapperEl(): HTMLElement;
    /**
     * ヘルプ内のアイコン説明部分を出力する
     * @return アイコン説明を散りばめたHTMLElement
     */
    private createHelpInnerWrapperEl;
    /**
     * IconData形式のオブジェクトであるかを判別する
     * type guard用の関数
     * @param  icon 型診断を行う対象
     * @return      IconDataであるならtrue
     */
    private isIconData;
}
