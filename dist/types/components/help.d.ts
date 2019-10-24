import DOMBuilder from "#/components/builder";
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
    showHelp(): void;
    hideHelp(): void;
    private applyEventListeners;
}
