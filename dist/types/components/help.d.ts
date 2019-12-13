import DOMBuilder from "./builder";
export default class LaymicHelp {
    private readonly ISDISPLAYED_KEY;
    _isDisplayed: boolean;
    rootEl: HTMLElement;
    el: HTMLElement;
    wrapperEl: HTMLElement;
    readonly builder: DOMBuilder;
    constructor(builder: DOMBuilder, rootEl: HTMLElement);
    private loadIsDisplayedData;
    private readonly isDisplayed;
    private isHelpDisplayed;
    show(): void;
    hide(): void;
    private applyEventListeners;
}
