import { MangaViewerIcons, MangaViewerUIButtons } from "./interfaces";
export declare class ViewerDOMBuilder {
    private icons;
    private readonly uiButtonClass;
    constructor(icons?: MangaViewerIcons);
    /**
     * 初期状態でのアイコンセットを返す
     * @return アイコンをひとまとめにしたオブジェクト
     */
    private readonly defaultMangaViewerIcons;
    /**
     * swiper-container要素を返す
     * @param  id        要素のid名となる文字列
     * @param  className 要素のclass名として付記される文字列
     * @param  pages     要素が内包することになるimg src配列
     * @param  isLTR     左から右に流れる形式を取るならtrue
     * @return           swiper-container要素
     */
    createSwiperContainer(id: string, className: string, pages: (string | HTMLElement)[], isLTR: boolean): HTMLElement;
    /**
     * 漫画ビューワーコントローラー要素を返す
     * @param  id 要素のid名となる文字列
     * @return    [コントローラー要素, コントローラー要素が内包するボタンオブジェクト]
     */
    createViewerController(id: string): [HTMLElement, MangaViewerUIButtons];
    /**
     * サムネイル表示要素を生成して返す
     * @param  className 要素に付記するクラス名
     * @param  pages     要素に内包させるページ配列
     * @return           生成されたサムネイル表示要素
     */
    createThumbnailsEl(className: string, pages: (string | HTMLElement)[]): [HTMLElement, HTMLElement];
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
    private createDiv;
    /**
     * 空のbutton要素を返す
     * @return button要素
     */
    private createButton;
    /**
     * IconData形式のオブジェクトであるかを判別する
     * type guard用の関数
     * @param  icon 型診断を行う対象
     * @return      IconDataであるならtrue
     */
    private isIconData;
}
