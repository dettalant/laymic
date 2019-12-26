import { ViewerPages } from "../interfaces/index";
import { setAriaExpanded, setRole, multiRafSleep } from "../utils"
import DOMBuilder from "./builder";
import LaymicStates from "./states";

export default class LaymicThumbnails {
  private _isActive = false;
  readonly state: LaymicStates;
  readonly builder: DOMBuilder;
  readonly rootEl: HTMLElement;
  readonly el: HTMLElement;
  readonly wrapperEl: HTMLElement;
  readonly thumbEls: Element[];
  readonly thumbButtons: HTMLButtonElement[];

  constructor(builder: DOMBuilder, rootEl: HTMLElement, pages: ViewerPages, thumbPages: string[], state: LaymicStates) {
    this.builder = builder;
    const thumbsNames = this.builder.classNames.thumbs;
    const thumbsEl = builder.createDiv(thumbsNames.container);

    // 初期状態では表示しないようにしておく
    thumbsEl.style.display = "none";
    setAriaExpanded(thumbsEl, false);

    const wrapperEl = builder.createDiv(thumbsNames.wrapper);
    setRole(wrapperEl, "list");
    wrapperEl.tabIndex = -1;

    const thumbEls = [];
    const thumbButtons = [];
    const loopLen = pages.length;
    // idxを使いたいので古めかしいforループを使用
    for (let i = 0; i < loopLen; i++) {
      const p = pages[i];
      const t = thumbPages[i] || "";

      const btn = builder.createButton(thumbsNames.item);
      btn.title = (i + 1) + "P目へと遷移";
      setRole(btn, "listitem");

      let el: Element;
      if (t !== "" || typeof p === "string") {
        let src = "";
        if (t !== "") {
          src = t;
        } else if (typeof p === "string") {
          src = p;
        }

        const img = new Image();
        img.dataset.src = src;
        img.className = `${thumbsNames.lazyload} ${thumbsNames.imgThumb}`;
        el = img;
      } else {
        // thumbs用にnodeをコピー
        const slideEl = p.cloneNode(true);
        if (!(slideEl instanceof Element)) continue;
        el = slideEl;
        el.classList.add(thumbsNames.slideThumb)
      }

      thumbEls.push(el);
      thumbButtons.push(btn);

      btn.appendChild(el);
      wrapperEl.appendChild(btn);
    }

    thumbsEl.appendChild(wrapperEl);

    this.el = thumbsEl;
    this.wrapperEl = wrapperEl;
    this.thumbEls = thumbEls;
    this.thumbButtons = thumbButtons;
    this.state = state;
    this.rootEl = rootEl;

    [
      {
        label: "--thumb-item-height",
        num: this.state.thumbItemHeight
      },
      {
        label: "--thumb-item-width",
        num: this.state.thumbItemWidth,
      },
      {
        label: "--thumb-item-gap",
        num: this.state.thumbItemGap
      },
      {
        label: "--thumbs-wrapper-padding",
        num: this.state.thumbsWrapperPadding
      }
    ].forEach(obj => this.wrapperEl.style.setProperty(obj.label, obj.num + "px"));

    this.applyEventListeners();
  }

  /**
   * サムネイル画面表示中か否かのboolを返す
   * @return サムネイル画面表示中ならばtrue
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * thumbsWrapperElのwidthを計算し、
   * 折り返しが発生しないようなら横幅の値を書き換える
   */
  cssThumbsWrapperWidthUpdate(rootEl: HTMLElement) {
    const {offsetWidth: ow} = rootEl;

    // thumb item offset width
    const tW = this.state.thumbItemWidth;
    // thumbs length
    const tLen = this.wrapperEl.children.length;
    // thumbs grid gap
    const tGaps = this.state.thumbItemGap * (tLen - 1);
    // thumbs wrapper padding
    const tWPadding = this.state.thumbsWrapperPadding * 2;

    const thumbsWrapperWidth = tW * tLen + tGaps + tWPadding;
    const widthStyleStr = (ow * 0.9 > thumbsWrapperWidth)
      ? thumbsWrapperWidth + "px"
      : "";
    this.wrapperEl.style.width = widthStyleStr;
  }

  /**
   * サムネイル画面を表示する
   */
  show() {
    if (this.el.style.display === "none") {
      // ページ読み込み後一度だけ動作する
      this.el.style.display = "";
      this.revealImgs();
    }

    this.rootEl.classList.add(this.builder.stateNames.showThumbs);
    setAriaExpanded(this.rootEl, true);
    this._isActive = true;

    // 少々遅延させてからフォーカスを移動させる
    // 二回ほどrafSleepすると良い塩梅になる
    multiRafSleep(2).then(() => {
      this.wrapperEl.focus();
    })
  }

  /**
   * サムネイル画面を閉じる
   */
  hide() {
    this.rootEl.classList.remove(this.builder.stateNames.showThumbs);
    setAriaExpanded(this.rootEl, false);
    this._isActive = false;
    // サムネイル閉止時にrootElへとfocusを戻す
    this.rootEl.focus();
  }

  /**
   * 読み込み待ち状態のimg elementを全て読み込む
   * いわゆるlazyload処理
   */
  private revealImgs() {
    const {lazyload, lazyloading, lazyloaded} = this.builder.classNames.thumbs;
    this.thumbEls.forEach(el => {
      if (!(el instanceof HTMLImageElement)) {
        return;
      }

      const s = el.dataset.src;
      if (s) {
        // 読み込み中はクラス名を変更
        el.classList.replace(lazyload, lazyloading);

        // 読み込みが終わるとクラス名を再変更
        el.addEventListener("load", () => {
          el.classList.replace(lazyloading, lazyloaded);
        })

        el.src = s;
      }
    })
  }

  /**
   * 各種イベントリスナーの登録
   */
  private applyEventListeners() {
    // サムネイルwrapperクリック時にサムネイル表示が消えないようにする
    this.wrapperEl.addEventListener("click", e => {
      e.stopPropagation();
    });

    // サムネイル表示中オーバーレイ要素でのクリックイベント
    this.el.addEventListener("click", () => {
      this.hide();
    });
  }
}
