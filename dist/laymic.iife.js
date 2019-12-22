/*!
 *   laymic.js
 *
 * @author dettalant
 * @version v2.0.0
 * @license MIT License
 */
var laymic = (function (exports) {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var screenfull = createCommonjsModule(function (module) {
	/*!
	* screenfull
	* v5.0.0 - 2019-09-09
	* (c) Sindre Sorhus; MIT License
	*/
	(function () {

		var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
		var isCommonjs =  module.exports;

		var fn = (function () {
			var val;

			var fnMap = [
				[
					'requestFullscreen',
					'exitFullscreen',
					'fullscreenElement',
					'fullscreenEnabled',
					'fullscreenchange',
					'fullscreenerror'
				],
				// New WebKit
				[
					'webkitRequestFullscreen',
					'webkitExitFullscreen',
					'webkitFullscreenElement',
					'webkitFullscreenEnabled',
					'webkitfullscreenchange',
					'webkitfullscreenerror'

				],
				// Old WebKit
				[
					'webkitRequestFullScreen',
					'webkitCancelFullScreen',
					'webkitCurrentFullScreenElement',
					'webkitCancelFullScreen',
					'webkitfullscreenchange',
					'webkitfullscreenerror'

				],
				[
					'mozRequestFullScreen',
					'mozCancelFullScreen',
					'mozFullScreenElement',
					'mozFullScreenEnabled',
					'mozfullscreenchange',
					'mozfullscreenerror'
				],
				[
					'msRequestFullscreen',
					'msExitFullscreen',
					'msFullscreenElement',
					'msFullscreenEnabled',
					'MSFullscreenChange',
					'MSFullscreenError'
				]
			];

			var i = 0;
			var l = fnMap.length;
			var ret = {};

			for (; i < l; i++) {
				val = fnMap[i];
				if (val && val[1] in document) {
					for (i = 0; i < val.length; i++) {
						ret[fnMap[0][i]] = val[i];
					}
					return ret;
				}
			}

			return false;
		})();

		var eventNameMap = {
			change: fn.fullscreenchange,
			error: fn.fullscreenerror
		};

		var screenfull = {
			request: function (element) {
				return new Promise(function (resolve, reject) {
					var onFullScreenEntered = function () {
						this.off('change', onFullScreenEntered);
						resolve();
					}.bind(this);

					this.on('change', onFullScreenEntered);

					element = element || document.documentElement;

					Promise.resolve(element[fn.requestFullscreen]()).catch(reject);
				}.bind(this));
			},
			exit: function () {
				return new Promise(function (resolve, reject) {
					if (!this.isFullscreen) {
						resolve();
						return;
					}

					var onFullScreenExit = function () {
						this.off('change', onFullScreenExit);
						resolve();
					}.bind(this);

					this.on('change', onFullScreenExit);

					Promise.resolve(document[fn.exitFullscreen]()).catch(reject);
				}.bind(this));
			},
			toggle: function (element) {
				return this.isFullscreen ? this.exit() : this.request(element);
			},
			onchange: function (callback) {
				this.on('change', callback);
			},
			onerror: function (callback) {
				this.on('error', callback);
			},
			on: function (event, callback) {
				var eventName = eventNameMap[event];
				if (eventName) {
					document.addEventListener(eventName, callback, false);
				}
			},
			off: function (event, callback) {
				var eventName = eventNameMap[event];
				if (eventName) {
					document.removeEventListener(eventName, callback, false);
				}
			},
			raw: fn
		};

		if (!fn) {
			if (isCommonjs) {
				module.exports = {isEnabled: false};
			} else {
				window.screenfull = {isEnabled: false};
			}

			return;
		}

		Object.defineProperties(screenfull, {
			isFullscreen: {
				get: function () {
					return Boolean(document[fn.fullscreenElement]);
				}
			},
			element: {
				enumerable: true,
				get: function () {
					return document[fn.fullscreenElement];
				}
			},
			isEnabled: {
				enumerable: true,
				get: function () {
					// Coerce to boolean in case of old WebKit
					return Boolean(document[fn.fullscreenEnabled]);
				}
			}
		});

		if (isCommonjs) {
			module.exports = screenfull;
		} else {
			window.screenfull = screenfull;
		}
	})();
	});
	var screenfull_1 = screenfull.isEnabled;

	/**
	 * 最大公約数を計算する
	 * ユークリッドの互除法を使用
	 * @param  x 最終的に出力される公約数
	 * @param  y 直前の計算での残余。これが0になるまで処理を続ける
	 * @return   計算結果の最大公約数
	 */
	const calcGCD = (x, y) => {
	    while (y !== 0) {
	        const tx = x;
	        x = y;
	        y = tx % y;
	    }
	    return x;
	};
	/**
	 * インスタンスで固有のviewerIdを出力するための関数
	 * 呼び出されるたびにインクリメントするだけ
	 * @return  固有のviewerId数値
	 */
	const viewerCnt = (() => {
	    let _viewerCntNum = 0;
	    return () => _viewerCntNum++;
	})();
	/**
	 * 一定時間ウェイトを取る
	 * @param  ms ウェイト秒数。ミリ秒で指定
	 * @return    Promiseに包まれたsetTimeout戻り値
	 */
	const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
	// /**
	//  * 画像をimg要素として読み取る
	//  * @param   path 画像path文字列
	//  * @return       Promiseに包まれたHTMLImageElement
	//  */
	// export const readImage = (path: string): Promise<HTMLImageElement> => {
	//   return new Promise((res, rej) => {
	//     const img = new Image();
	//     img.onload = () => res(img);
	//     img.onerror = (e) => rej(e);
	//     img.src = path;
	//   })
	// }
	const isMobile = () => {
	    const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Mobile|Opera Mini/i;
	    return regex.test(window.navigator.userAgent);
	};
	// export const isExistTouchEvent = (): boolean => {
	//   return "ontouchmove" in window;
	// }
	const isSupportedPassive = () => {
	    let passive = false;
	    const options = Object.defineProperty({}, "passive", {
	        get() { passive = true; }
	    });
	    const testFunc = () => { };
	    window.addEventListener("test", testFunc, options);
	    window.removeEventListener("test", testFunc);
	    return passive;
	};
	const passiveFalseOption = (isSupportedPassive()) ? { passive: false } : false;
	const isMultiTouch = (e) => {
	    return e.targetTouches.length > 1;
	};
	/**
	 * requestAnimationFrameを用いて呼び出し頻度を下げた関数を返す
	 * addEventListener第二引数に用いられることを想定。
	 *
	 * 使用例
	 * ```javascript
	 *  el.addEventListener("mousemove", rafThrottle((e) => {
	 *    console.log(e);
	 *  }))
	 * ```
	 *
	 * @param  callback 頻度を下げて呼び出されるコールバック関数
	 * @return          イベントデータを受け取る関数
	 */
	const rafThrottle = function (callback) {
	    let requestId = 0;
	    return function (ev) {
	        if (requestId)
	            return;
	        requestId = requestAnimationFrame(() => {
	            requestId = 0;
	            callback.call(this, ev);
	        });
	    };
	};
	const cancelableRafThrottle = function (callback) {
	    let requestId = 0;
	    const listener = function (ev) {
	        if (requestId)
	            return;
	        requestId = requestAnimationFrame(() => {
	            requestId = 0;
	            callback.call(this, ev);
	        });
	    };
	    const canceler = () => {
	        cancelAnimationFrame(requestId);
	        requestId = 0;
	    };
	    return {
	        listener,
	        canceler
	    };
	};
	// export const createDoubleTapHandler = function<
	//   T extends HTMLElement,
	//   E extends TouchEvent
	// > (
	//   callback: (e: E) => void,
	//   ms: number = 500,
	//   distance: number = 40
	// ) {
	//   let tapCnt = 0;
	//   let pastX = 0;
	//   let pastY = 0;
	//
	//   const isContainedDistance = (e: TouchEvent): boolean => {
	//     const {clientX: cx, clientY: cy} = e.changedTouches[0];
	//     const diffX = Math.abs(cx - pastX);
	//     const diffY = Math.abs(cy - pastY);
	//
	//     return diffX < distance && diffY < distance;
	//   }
	//
	//   const setPastPos = (e: TouchEvent) => {
	//     const {clientX: cx, clientY: cy} = e.changedTouches[0];
	//     pastX = cx;
	//     pastY = cy;
	//   }
	//
	//   return function(this: T, e: E) {
	//     if (!tapCnt) {
	//       tapCnt++;
	//       sleep(ms).then(() => {
	//         tapCnt = 0;
	//       });
	//     } else if (isContainedDistance(e)) {
	//       // ダブルタップ処理
	//       callback.call(this, e);
	//       tapCnt = 0;
	//     }
	//     setPastPos(e)
	//   }
	// }
	// ipadではdblclick eventが使えないと聞いたので
	// click eventで同じ操作を代用するためのもの
	const createDoubleClickHandler = function (callback, ms = 500) {
	    let clickCnt = 0;
	    return function (e) {
	        if (!clickCnt) {
	            clickCnt++;
	            sleep(ms).then(() => {
	                clickCnt = 0;
	            });
	        }
	        else {
	            callback.call(this, e);
	            clickCnt = 0;
	        }
	    };
	};
	// export const isHTMLElementArray = (array: any): array is HTMLElement[] => {
	//   let bool = true;
	//
	//   if (Array.isArray(array) && array.length > 0) {
	//     array.forEach(v => {
	//       const b = v instanceof HTMLElement;
	//       if (!b) bool = false;
	//     })
	//   } else {
	//     bool = false;
	//   }
	//
	//   return bool;
	// }
	const isBarWidth = (s) => {
	    return s === "auto" || s === "none" || s === "tint" || s === "bold" || s === "medium";
	};
	const isUIVisibility = (s) => {
	    return s === "auto" || s === "none" || s === "visible";
	};
	const compareString = (s, cmp, success) => {
	    return s.toLowerCase() === cmp.toLowerCase() ? success : undefined;
	};
	const excludeHashLocation = () => location.protocol + "//" + location.host + location.pathname + location.search;
	const calcWindowVH = (el = document.documentElement) => {
	    const vh = window.innerHeight * 0.01;
	    el.style.setProperty("--js-vh", vh + "px");
	};
	const isLaymicPages = (pages) => {
	    return "pages" in pages && Array.isArray(pages.pages);
	};
	// /**
	//  * ViewerPages内はじめのHTMLImageElementのsrcを取得する
	//  * @param  pages laymicに指定された全ページ
	//  * @return       取得したsrc文字列。取得できなければ空欄を返す
	//  */
	// export const getBeginningSrc = (pages: ViewerPages): string => {
	//   let result = "";
	//   for (let p of pages) {
	//     if (typeof p === "string") {
	//       result = p;
	//       break;
	//     } else if (p instanceof HTMLImageElement) {
	//       result = p.dataset.src || p.src;
	//       break;
	//     }
	//   }
	//   return result;
	// }
	const orientationChangeFuncs = [];
	const orientationChangeHandler = () => {
	    orientationChangeFuncs.forEach(func => func());
	};
	const getDeviceOrientation = () => {
	    let orientation = "unknown";
	    if (screen.orientation) {
	        const type = screen.orientation.type;
	        if (type.includes("landscape"))
	            orientation = "landscape";
	        if (type.includes("portrait"))
	            orientation = "portrait";
	    }
	    else if (window.orientation) {
	        orientation = (parseInt(window.orientation.toString(), 10) % 180)
	            ? "landscape"
	            : "portrait";
	    }
	    return orientation;
	};
	const setAriaExpanded = (el, bool) => el.setAttribute("aria-expanded", (bool) ? "true" : "false");
	const setRole = (el, role) => el.setAttribute("role", role);

	// svg namespace
	const SVG_NS = "http://www.w3.org/2000/svg";
	// svg xlink namespace
	const SVG_XLINK_NS = "http://www.w3.org/1999/xlink";
	// mangaViewerで用いるDOMを生成するやつ
	class DOMBuilder {
	    constructor(icons, classNames, stateNames) {
	        // 使用するアイコンセット
	        this.icons = this.defaultMangaViewerIcons;
	        this.classNames = this.defaultLaymicClassNames;
	        this.stateNames = this.defaultLaymicStateClassNames;
	        if (icons)
	            this.icons = Object.assign(this.icons, icons);
	        if (classNames)
	            this.classNames = Object.assign(this.classNames, classNames);
	        if (stateNames)
	            this.stateNames = Object.assign(this.stateNames, stateNames);
	    }
	    get defaultLaymicClassNames() {
	        return {
	            root: "laymic_root",
	            slider: "laymic_slider",
	            // uiボタンクラス名
	            uiButton: "laymic_uiButton",
	            // 空スライドクラス名
	            emptySlide: "laymic_emptySlide",
	            pagination: "laymic_pagination",
	            controller: {
	                controller: "laymic_controller",
	                controllerTop: "laymic_controllerTop",
	                controllerBottom: "laymic_controllerBottom",
	                progressbar: "laymic_progressbar",
	            },
	            buttons: {
	                direction: "laymic_direction",
	                fullscreen: "laymic_fullscreen",
	                thumbs: "laymic_showThumbs",
	                preference: "laymic_showPreference",
	                close: "laymic_close",
	                help: "laymic_showHelp",
	                nextPage: "laymic_paginationNext",
	                prevPage: "laymic_paginationPrev",
	                zoom: "laymic_zoom",
	            },
	            svg: {
	                icon: "laymic_svgIcon",
	                defaultProp: "laymic_svgDefaultProp",
	                container: "laymic_svgContainer",
	            },
	            checkbox: {
	                container: "laymic_checkbox",
	                label: "laymic_checkboxLabel",
	                iconWrapper: "laymic_checkboxIconWrapper",
	            },
	            select: {
	                container: "laymic_select",
	                label: "laymic_selectLabel",
	                wrapper: "laymic_selectWrapper",
	                current: "laymic_selectCurrentItem",
	                item: "laymic_selectItem",
	                itemWrapper: "laymic_selectItemWrapper"
	            },
	            thumbs: {
	                container: "laymic_thumbs",
	                wrapper: "laymic_thumbsWrapper",
	                item: "laymic_thumbItem",
	                slideThumb: "laymic_slideThumb",
	                imgThumb: "laymic_imgThumb",
	                lazyload: "laymic_lazyload",
	                lazyloading: "laymic_lazyloading",
	                lazyloaded: "laymic_lazyloaded",
	            },
	            preference: {
	                container: "laymic_preference",
	                wrapper: "laymic_preferenceWrapper",
	                notice: "laymic_preferenceNotice",
	                button: "laymic_preferenceButton",
	                paginationVisibility: "laymic_preferencePaginationVisibility",
	                isAutoFullscreen: "laymic_preferenceIsAutoFullscreen",
	                zoomButtonRatio: "laymic_preferenceZoomButtonRatio",
	                isDisabledTapSlidePage: "laymic_preferenceIsDisabledTapSlidePage",
	                isDisabledForceHorizView: "laymic_preferenceIsDisabledForceHorizView",
	                isDisabledDoubleTapResetZoom: "laymic_preferenceIsDisabledDoubleTapResetZoom",
	            },
	            help: {
	                container: "laymic_help",
	                wrapper: "laymic_helpWrapper",
	                vertImg: "laymic_helpVertImg",
	                horizImg: "laymic_helpHorizImg",
	                innerWrapper: "laymic_helpInnerWrapper",
	                innerItem: "laymic_helpInnerItem",
	                iconWrapper: "laymic_helpIconWrapper",
	                iconLabel: "laymic_helpIconLabel",
	                chevronsContainer: "laymic_helpChevrons",
	                zoomItem: "laymic_helpZoomItem",
	                fullscreenItem: "laymic_helpFullscreenItem",
	            },
	            zoom: {
	                controller: "laymic_zoomController",
	                wrapper: "laymic_zoomWrapper",
	            }
	        };
	    }
	    get defaultLaymicStateClassNames() {
	        return {
	            active: "laymic_isActive",
	            hidden: "laymic_isHidden",
	            reversed: "laymic_isReversed",
	            showHelp: "laymic_isShowHelp",
	            showThumbs: "laymic_isShowThumbs",
	            showPreference: "laymic_isShowPreference",
	            singleSlide: "laymic_isSingleSlide",
	            vertView: "laymic_isVertView",
	            visibleUI: "laymic_isVisibleUI",
	            visiblePagination: "laymic_isVisiblePagination",
	            fullscreen: "laymic_isFullscreen",
	            unsupportedFullscreen: "laymic_isUnsupportedFullscreen",
	            ltr: "laymic_isLTR",
	            mobile: "laymic_isMobile",
	            zoomed: "laymic_isZoomed",
	        };
	    }
	    /**
	     * 初期状態でのアイコンセットを返す
	     * @return アイコンをひとまとめにしたオブジェクト
	     */
	    get defaultMangaViewerIcons() {
	        // material.io: close
	        const close = {
	            id: "laymic_svgClose",
	            className: "icon_close",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
	            ]
	        };
	        // material.io: fullscreen
	        const fullscreen = {
	            id: "laymic_svgFullscreen",
	            className: "icon_fullscreen",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M6 15H4v5h5v-2H6zM4 9h2V6h3V4H4zm14 9h-3v2h5v-5h-2zM15 4v2h3v3h2V4z",
	            ]
	        };
	        // material.io: fullscreen-exit
	        const exitFullscreen = {
	            id: "laymic_svgExitFullscreen",
	            className: "icon_exitFullscreen",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M4 17h3v3h2v-5H4zM7 7H4v2h5V4H7zm8 13h2v-3h3v-2h-5zm2-13V4h-2v5h5V7z"
	            ]
	        };
	        const showThumbs = {
	            id: "laymic_svgThumbs",
	            className: "icon_showThumbs",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm1 1v4h4V7H5zm5 0v4h4V7h-4zm5 0v4h4V7h-4zM5 13v4h4v-4H5zm5 0v4h4v-4h-4zm5 0v4h4v-4h-4z",
	            ]
	        };
	        // material.io: settings_applications(modified)
	        const preference = {
	            id: "laymic_svgPreference",
	            className: "icon_showPreference",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M4.283 14.626l1.6 2.76c.106.173.306.24.492.173l1.986-.8c.414.32.854.586 1.347.786l.293 2.12c.04.186.2.333.4.333h3.2c.2 0 .359-.147.399-.347l.293-2.12c.48-.2.933-.466 1.347-.786l1.986.8c.186.067.386 0 .493-.173l1.6-2.76c.106-.173.053-.386-.094-.52l-1.693-1.319c.04-.253.054-.52.054-.773 0-.267-.027-.52-.054-.786l1.693-1.32c.147-.12.2-.347.094-.52l-1.6-2.76a.408.408 0 00-.493-.173l-1.986.8a5.657 5.657 0 00-1.347-.786L14 4.335a.414.414 0 00-.4-.333h-3.2c-.199 0-.359.147-.399.347l-.293 2.12c-.48.2-.947.452-1.347.772l-1.986-.8a.408.408 0 00-.493.174l-1.6 2.759c-.106.173-.053.387.094.52l1.693 1.32c-.04.266-.067.52-.067.786 0 .267.027.52.053.786l-1.692 1.32a.408.408 0 00-.08.52zM12 9.721A2.287 2.287 0 0114.28 12 2.287 2.287 0 0112 14.28 2.287 2.287 0 019.722 12a2.287 2.287 0 012.28-2.28z"
	            ]
	        };
	        const horizView = {
	            id: "laymic_svgHorizView",
	            className: "icon_horizView",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm2 1v10h5V7H6zm7 0v10h5V7h-5z"
	            ]
	        };
	        const vertView = {
	            id: "laymic_svgVertView",
	            className: "icon_vertView",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm2 1v4h12V7H6zm0 6v4h12v-4H6z"
	            ]
	        };
	        // material.io: check_box(modified)
	        const checkboxInner = {
	            id: "laymic_svgCheckboxInner",
	            className: "icon_checkboxInner",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"
	            ]
	        };
	        // material.io: check_box(modified)
	        const checkboxOuter = {
	            id: "laymic_svgCheckboxOuter",
	            className: "icon_checkboxOuter",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
	            ]
	        };
	        // material.io: help(modified)
	        const showHelp = {
	            id: "laymic_svgShowHelp",
	            className: "icon_showHelp",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M12 6.4a3.2 3.2 0 00-3.2 3.2h1.6c0-.88.72-1.6 1.6-1.6.88 0 1.6.72 1.6 1.6 0 .44-.176.84-.472 1.128l-.992 1.008A3.22 3.22 0 0011.2 14v.4h1.6c0-1.2.36-1.68.936-2.264l.72-.736a2.545 2.545 0 00.744-1.8A3.2 3.2 0 0012 6.4zm-.8 9.6v1.6h1.6V16z",
	                "M12 3a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm0 1.445A7.555 7.555 0 0119.555 12 7.555 7.555 0 0112 19.555 7.555 7.555 0 014.445 12 7.555 7.555 0 0112 4.445z"
	            ]
	        };
	        // material.io: zoom_in(modified)
	        const zoomIn = {
	            id: "laymic_svgZoomIn",
	            className: "icon_zoomIn",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
	                "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z",
	            ]
	        };
	        // material.io: unfold_more(modified)
	        const viewerDirection = {
	            id: "laymic_svgViewerDirection",
	            className: "icon_viewerDirection",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M18.17 12.002l-4.243 4.242 1.41 1.41 5.662-5.652-5.657-5.658-1.41 1.42zm-12.34 0l4.24-4.242-1.41-1.41L3 12.002l5.662 5.662 1.41-1.42z"
	            ]
	        };
	        const touchApp = {
	            id: "laymic_svgTouchApp",
	            className: "icon_touchApp",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M9.156 9.854v-3.56a2.381 2.381 0 014.76 0v3.56a4.27 4.27 0 001.904-3.56 4.279 4.279 0 00-4.284-4.285 4.279 4.279 0 00-4.284 4.284 4.27 4.27 0 001.904 3.561zm9.368 4.408l-4.322-2.152a1.34 1.34 0 00-.514-.104h-.724V6.293c0-.79-.638-1.428-1.428-1.428-.79 0-1.428.638-1.428 1.428V16.52l-3.266-.686c-.076-.01-.143-.029-.228-.029-.295 0-.562.124-.752.315l-.752.761 4.703 4.703c.257.258.619.42 1.009.42h6.464c.714 0 1.267-.524 1.371-1.22l.714-5.017c.01-.066.02-.133.02-.19 0-.59-.362-1.104-.867-1.314z"
	            ]
	        };
	        const chevronLeft = {
	            id: "laymic_svgChevronLeft",
	            className: "icon_chevronLeft",
	            viewBox: "0 0 24 24",
	            pathDs: [
	                "M18 4.12L10.12 12 18 19.88 15.88 22l-10-10 10-10z"
	            ]
	        };
	        return {
	            close,
	            fullscreen,
	            exitFullscreen,
	            showThumbs,
	            preference,
	            horizView,
	            vertView,
	            checkboxInner,
	            checkboxOuter,
	            showHelp,
	            zoomIn,
	            viewerDirection,
	            touchApp,
	            chevronLeft
	        };
	    }
	    /**
	     * swiper-container要素を返す
	     * @param  className 要素のclass名として付記される文字列
	     * @param  pages     要素が内包することになるimg src配列
	     * @param  isLTR     左から右に流れる形式を取るならtrue
	     * @return           swiper-container要素
	     */
	    createSwiperContainer(pages, isLTR, isFirstSlideEmpty, isAppendEmptySlide) {
	        const swiperEl = this.createDiv();
	        swiperEl.className = "swiper-container " + this.classNames.slider;
	        swiperEl.dir = (isLTR) ? "" : "rtl";
	        const wrapperEl = this.createDiv();
	        wrapperEl.className = "swiper-wrapper";
	        // isFirstSlideEmpty引数がtrueならば
	        // 空の要素を一番目に入れる
	        if (isFirstSlideEmpty) {
	            const emptyEl = this.createEmptySlideEl();
	            wrapperEl.appendChild(emptyEl);
	        }
	        for (let p of pages) {
	            const divEl = this.createDiv();
	            divEl.className = "swiper-slide";
	            if (p instanceof Element) {
	                divEl.appendChild(p);
	            }
	            else {
	                const imgEl = new Image();
	                imgEl.dataset.src = p;
	                imgEl.className = "swiper-lazy";
	                divEl.appendChild(imgEl);
	            }
	            wrapperEl.appendChild(divEl);
	        }
	        // isAppendEmptySlide引数がtrueならば
	        // 空の要素を最後に入れる
	        if (isAppendEmptySlide) {
	            const emptyEl = this.createEmptySlideEl();
	            wrapperEl.appendChild(emptyEl);
	        }
	        swiperEl.appendChild(wrapperEl);
	        return swiperEl;
	    }
	    /**
	     * 漫画ビューワーコントローラー要素を返す
	     * @param  id    要素のid名となる文字列
	     * @param  isLTR 左から右に流れる形式を取るならtrue
	     * @return       [コントローラー要素, コントローラー要素が内包するボタンオブジェクト]
	     */
	    createViewerController() {
	        const btnClassNames = this.classNames.buttons;
	        const ctrlClassNames = this.classNames.controller;
	        const ctrlEl = this.createDiv();
	        ctrlEl.className = ctrlClassNames.controller;
	        const progressEl = this.createDiv();
	        progressEl.className = "swiper-pagination " + ctrlClassNames.progressbar;
	        const ctrlTopEl = this.createDiv();
	        ctrlTopEl.className = ctrlClassNames.controllerTop;
	        ctrlTopEl.setAttribute("aria-orientation", "horizontal");
	        setRole(ctrlTopEl, "menu");
	        const direction = this.createButton();
	        direction.classList.add(btnClassNames.direction);
	        [
	            this.createSvgUseElement(this.icons.vertView),
	            this.createSvgUseElement(this.icons.horizView),
	        ].forEach(icon => direction.appendChild(icon));
	        const fullscreen = this.createButton();
	        [
	            this.createSvgUseElement(this.icons.fullscreen),
	            this.createSvgUseElement(this.icons.exitFullscreen),
	        ].forEach(icon => fullscreen.appendChild(icon));
	        fullscreen.classList.add(btnClassNames.fullscreen);
	        const thumbs = this.createButton();
	        [
	            this.createSvgUseElement(this.icons.showThumbs),
	        ].forEach(icon => thumbs.appendChild(icon));
	        thumbs.classList.add(btnClassNames.thumbs);
	        const preference = this.createButton();
	        preference.classList.add(btnClassNames.preference);
	        const preferenceIcon = this.createSvgUseElement(this.icons.preference);
	        preference.appendChild(preferenceIcon);
	        const close = this.createButton();
	        close.classList.add(btnClassNames.close);
	        const closeIcon = this.createSvgUseElement(this.icons.close);
	        close.appendChild(closeIcon);
	        const help = this.createButton();
	        help.classList.add(btnClassNames.help);
	        const helpIcon = this.createSvgUseElement(this.icons.showHelp);
	        help.appendChild(helpIcon);
	        const zoom = this.createButton();
	        zoom.classList.add(btnClassNames.zoom);
	        [
	            this.createSvgUseElement(this.icons.zoomIn),
	        ].forEach(icon => zoom.appendChild(icon));
	        [
	            preference,
	            thumbs,
	            help,
	        ].forEach(el => el.setAttribute("aria-haspopup", "true"));
	        [
	            help,
	            direction,
	            thumbs,
	            zoom,
	            fullscreen,
	            preference,
	            close
	        ].forEach(btn => {
	            setRole(btn, "menuitem");
	            ctrlTopEl.appendChild(btn);
	        });
	        const paginationClass = this.classNames.pagination;
	        const nextPage = this.createButton(`${paginationClass} ${btnClassNames.nextPage} swiper-button-next`);
	        const prevPage = this.createButton(`${paginationClass} ${btnClassNames.prevPage} swiper-button-prev`);
	        const uiButtons = {
	            help,
	            close,
	            thumbs,
	            zoom,
	            fullscreen,
	            preference,
	            direction,
	            nextPage,
	            prevPage
	        };
	        const ctrlBottomEl = this.createDiv();
	        ctrlBottomEl.className = ctrlClassNames.controllerBottom;
	        [
	            ctrlTopEl,
	            ctrlBottomEl,
	            progressEl,
	            nextPage,
	            prevPage,
	        ].forEach(el => ctrlEl.appendChild(el));
	        return [ctrlEl, uiButtons];
	    }
	    createZoomWrapper() {
	        const zoomWrapper = this.createDiv();
	        zoomWrapper.className = this.classNames.zoom.wrapper;
	        return zoomWrapper;
	    }
	    /**
	     * use要素を内包したSVGElementを返す
	     * @param  linkId    xlink:hrefに指定するid名
	     * @param  className 返す要素に追加するクラス名
	     * @return           SVGElement
	     */
	    createSvgUseElement(icon) {
	        const svgClassNames = this.classNames.svg;
	        const svgEl = document.createElementNS(SVG_NS, "svg");
	        svgEl.setAttribute("class", `${svgClassNames.icon} ${icon.className}`);
	        svgEl.setAttribute("role", "img");
	        const useEl = document.createElementNS(SVG_NS, "use");
	        useEl.setAttribute("class", svgClassNames.defaultProp);
	        useEl.setAttributeNS(SVG_XLINK_NS, "xlink:href", "#" + icon.id);
	        svgEl.appendChild(useEl);
	        return svgEl;
	    }
	    /**
	     * 漫画ビューワーが用いるアイコンを返す
	     * use要素を用いたsvg引用呼び出しを使うための前処理
	     * @return 漫画ビューワーが使うアイコンを詰め込んだsvg要素
	     */
	    createSVGIcons() {
	        const svgCtn = document.createElementNS(SVG_NS, "svg");
	        svgCtn.setAttributeNS(null, "version", "1.1");
	        svgCtn.setAttribute("xmlns", SVG_NS);
	        svgCtn.setAttribute("xmlns:xlink", SVG_XLINK_NS);
	        svgCtn.setAttribute("class", this.classNames.svg.container);
	        const defs = document.createElementNS(SVG_NS, "defs");
	        Object.values(this.icons).forEach(icon => {
	            if (!this.isIconData(icon)) {
	                return;
	            }
	            const symbol = document.createElementNS(SVG_NS, "symbol");
	            symbol.setAttribute("id", icon.id);
	            symbol.setAttribute("viewBox", icon.viewBox);
	            icon.pathDs.forEach(d => {
	                const path = document.createElementNS(SVG_NS, "path");
	                path.setAttribute("d", d);
	                symbol.appendChild(path);
	            });
	            defs.appendChild(symbol);
	        });
	        svgCtn.appendChild(defs);
	        // 画面上に表示させないためのスタイル定義
	        svgCtn.style.height = "1px";
	        svgCtn.style.width = "1px";
	        svgCtn.style.position = "absolute";
	        svgCtn.style.left = "-9px";
	        return svgCtn;
	    }
	    /**
	     * 空のdiv要素を返す
	     * @return div要素
	     */
	    createDiv() {
	        return document.createElement("div");
	    }
	    /**
	     * 空のbutton要素を返す
	     * @return button要素
	     */
	    createButton(className = this.classNames.uiButton) {
	        const btn = document.createElement("button");
	        btn.type = "button";
	        btn.className = className;
	        return btn;
	    }
	    createSpan() {
	        return document.createElement("span");
	    }
	    createParagraph() {
	        return document.createElement("p");
	    }
	    createEmptySlideEl() {
	        const emptyEl = this.createDiv();
	        emptyEl.className = "swiper-slide " + this.classNames.emptySlide;
	        return emptyEl;
	    }
	    /**
	     * ヘルプとして表示する部分を出力する
	     * @return helpWrapperとして用いられるHTMLElement
	     */
	    createHelpWrapperEl() {
	        const helpClassNames = this.classNames.help;
	        const wrapperEl = this.createDiv();
	        wrapperEl.className = helpClassNames.wrapper;
	        const innerWrapperEl = this.createHelpInnerWrapperEl();
	        const touchAppIcon = this.createSvgUseElement(this.icons.touchApp);
	        const chevronsContainer = this.createDiv();
	        chevronsContainer.className = helpClassNames.chevronsContainer;
	        const iconChevron = this.icons.chevronLeft;
	        // 右向き矢印は一度生成してから反転クラス名を付与する
	        const chevronRight = this.createSvgUseElement(iconChevron);
	        chevronRight.classList.add(this.stateNames.reversed);
	        [
	            this.createSvgUseElement(iconChevron),
	            chevronRight
	        ].forEach(el => chevronsContainer.appendChild(el));
	        [
	            chevronsContainer,
	            innerWrapperEl,
	            touchAppIcon,
	        ].forEach(el => wrapperEl.appendChild(el));
	        return wrapperEl;
	    }
	    /**
	     * ヘルプ内のアイコン説明部分を出力する
	     * @return アイコン説明を散りばめたHTMLElement
	     */
	    createHelpInnerWrapperEl() {
	        const helpClassNames = this.classNames.help;
	        const innerWrapper = this.createDiv();
	        innerWrapper.className = helpClassNames.innerWrapper;
	        setRole(innerWrapper, "list");
	        [
	            {
	                icons: [this.icons.close],
	                label: "閉じる"
	            },
	            {
	                icons: [this.icons.preference],
	                label: "設定"
	            },
	            {
	                icons: [this.icons.fullscreen, this.icons.exitFullscreen],
	                label: "全画面切り替え",
	                className: helpClassNames.fullscreenItem,
	            },
	            {
	                icons: [this.icons.zoomIn],
	                label: "拡大表示",
	                className: helpClassNames.zoomItem,
	            },
	            {
	                icons: [this.icons.showThumbs],
	                label: "サムネイル"
	            },
	            {
	                icons: [this.icons.vertView, this.icons.horizView],
	                label: "縦読み/横読み"
	            },
	            {
	                icons: [this.icons.showHelp],
	                label: "ヘルプ"
	            },
	            {
	                icons: [this.icons.viewerDirection],
	                label: "ページ送り"
	            },
	            {
	                icons: [this.icons.touchApp],
	                label: "機能呼び出し"
	            }
	        ].forEach(obj => {
	            const item = this.createDiv();
	            item.className = helpClassNames.innerItem;
	            setRole(item, "listitem");
	            if (obj.className)
	                item.classList.add(obj.className);
	            const iconWrapper = this.createDiv();
	            iconWrapper.className = helpClassNames.iconWrapper;
	            obj.icons.forEach(icon => iconWrapper.appendChild(this.createSvgUseElement(icon)));
	            const label = this.createSpan();
	            label.textContent = obj.label;
	            label.className = helpClassNames.iconLabel;
	            [iconWrapper, label].forEach(el => item.appendChild(el));
	            innerWrapper.appendChild(item);
	        });
	        return innerWrapper;
	    }
	    /**
	     * IconData形式のオブジェクトであるかを判別する
	     * type guard用の関数
	     * @param  icon 型診断を行う対象
	     * @return      IconDataであるならtrue
	     */
	    isIconData(icon) {
	        return typeof icon.id === "string"
	            && typeof icon.viewBox === "string"
	            && Array.isArray(icon.pathDs);
	    }
	}

	var dist = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	const createDiv = (className) => {
	    const div = document.createElement("div");
	    if (className)
	        div.className = className;
	    return div;
	};
	const createSpan = (className) => {
	    const span = document.createElement("span");
	    if (className)
	        span.className = className;
	    return span;
	};
	const createButton = (className) => {
	    const btn = document.createElement("button");
	    if (className)
	        btn.className = className;
	    btn.type = "button";
	    return btn;
	};
	const boolToString = (bool) => {
	    return (bool) ? "true" : "false";
	};
	const setAriaSelected = (el, bool) => el.setAttribute("aria-selected", boolToString(bool));
	const setAriaExpanded = (el, bool) => el.setAttribute("aria-expanded", boolToString(bool));
	const setAriaChecked = (el, bool) => el.setAttribute("aria-checked", boolToString(bool));
	// export const setAriaHidden = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-hidden", boolToString(bool));
	const createSVG = (pathDs, viewBox = "0 0 24 24") => {
	    const ns = "http://www.w3.org/2000/svg";
	    const svg = document.createElementNS(ns, "svg");
	    svg.setAttribute("role", "img");
	    svg.setAttribute("xmlns", ns);
	    svg.setAttribute("viewBox", viewBox);
	    pathDs.forEach(d => {
	        const path = document.createElementNS(ns, "path");
	        path.setAttribute("d", d);
	        svg.appendChild(path);
	    });
	    return svg;
	};

	class SimpleSelectBuilder {
	    constructor(classNames = {}) {
	        this.classNames = Object.assign(this.defaultSelectClassNames, classNames);
	    }
	    get defaultSelectClassNames() {
	        return {
	            container: "simpleSelect_container",
	            label: "simpleSelect_label",
	            wrapper: "simpleSelect_wrapper",
	            itemWrapper: "simpleSelect_itemWrapper",
	            item: "simpleSelect_item",
	            current: "simpleSelect_currentItem",
	        };
	    }
	    create(label, items, className) {
	        const el = this.genSelectElements(label, items, className);
	        const select = new SimpleSelect(el, items);
	        // set initial selected
	        let selectedIdx = items.findIndex(item => item.selected);
	        if (selectedIdx === -1)
	            selectedIdx = 0;
	        // 初期化のためにアップデート関数を呼んでおく
	        select.updateCurrentItem(selectedIdx, false);
	        return select;
	    }
	    genSelectElements(label, items, className = "") {
	        const names = this.classNames;
	        const containerEl = createButton(names.container + " " + className);
	        containerEl.setAttribute("role", "tree");
	        containerEl.setAttribute("aria-haspopup", "tree");
	        containerEl.title = label;
	        const labelEl = createSpan(names.label);
	        labelEl.textContent = label;
	        const wrapperEl = createDiv(names.wrapper);
	        const currentEl = createDiv(names.current);
	        const itemWrapperEl = createDiv(names.itemWrapper);
	        itemWrapperEl.setAttribute("role", "group");
	        // set aria expanded;
	        [containerEl, itemWrapperEl].forEach(el => setAriaExpanded(el, false));
	        const itemEls = items.map((item, i) => {
	            const className = names.item + " " + names.item + i;
	            const el = createDiv(className);
	            el.textContent = item.label;
	            el.dataset.itemIdx = i.toString();
	            el.setAttribute("role", "treeitem");
	            itemWrapperEl.appendChild(el);
	            return el;
	        });
	        // append childs
	        [
	            currentEl,
	            itemWrapperEl,
	        ].forEach(el => wrapperEl.appendChild(el));
	        [
	            labelEl,
	            wrapperEl
	        ].forEach(el => containerEl.appendChild(el));
	        return {
	            container: containerEl,
	            label: labelEl,
	            current: currentEl,
	            wrapper: wrapperEl,
	            itemWrapper: itemWrapperEl,
	            items: itemEls,
	        };
	    }
	}
	class SimpleSelect {
	    /**
	     * SimpleSelectのコンストラクタ
	     *
	     * @param el    生成されたselect要素内のHTMLElementまとめ
	     * @param items 生成されたselect要素が内包する要素データ
	     */
	    constructor(el, items) {
	        this._currentIdx = 0;
	        this._isActive = false;
	        this.el = el;
	        this.items = items;
	        this.applyEventListeners();
	    }
	    get isActive() {
	        return this._isActive;
	    }
	    get currentIdx() {
	        return this._currentIdx;
	    }
	    /**
	     * currentIdx指定を行うsetter
	     * 内部変数の書き換えと同時にupdateCurrentItem関数も呼ぶ
	     * @param  idx 更新後のインデックス数値
	     */
	    set currentIdx(idx) {
	        // 保有items配列を越える数値の場合は早期リターン
	        if (idx > this.items.length - 1)
	            return;
	        this._currentIdx = idx;
	        this.updateCurrentItem(idx);
	    }
	    get currentItem() {
	        return this.items[this._currentIdx];
	    }
	    /**
	     * 入力インデックス数値の値が選択されたものとして
	     * currentItemなどの値を更新する
	     * @param  itemIdx         更新先となるインデックス数値
	     * @param  isDispatchEvent falseならばdispatchEventしない
	     */
	    updateCurrentItem(itemIdx, isDispatchEvent = true) {
	        this.updateCurrentItemLabel(itemIdx);
	        this.updateHighlightItem(itemIdx);
	        if (isDispatchEvent)
	            this.dispatchSelectEvent();
	    }
	    /**
	     * 選択中要素のハイライトを切り替える
	     * @param  itemIdx 更新先となるインデックス数値
	     */
	    updateHighlightItem(itemIdx) {
	        // 配列数を越えているidxの場合は早期リターン
	        if (itemIdx >= this.el.items.length)
	            return;
	        this.el.items.forEach(item => {
	            setAriaSelected(item, false);
	        });
	        const item = this.el.items[itemIdx];
	        setAriaSelected(item, true);
	        this._currentIdx = itemIdx;
	    }
	    /**
	     * 選択中要素ラベル値を書き換える
	     * @param  itemIdx 更新先となるインデックス数値
	     */
	    updateCurrentItemLabel(itemIdx) {
	        const item = this.items[itemIdx];
	        if (item)
	            this.el.current.textContent = item.label;
	    }
	    /**
	     * ドロップダウンを開く
	     */
	    showDropdown() {
	        const { container, itemWrapper } = this.el;
	        [container, itemWrapper].forEach(el => setAriaExpanded(el, true));
	        this._isActive = true;
	    }
	    /**
	     * ドロップダウンを閉じる
	     * hideDropdown後に行う処理を簡便にするため、promiseで包んで返す
	     *
	     * @return 非同期処理終了後のPromiseオブジェクト
	     */
	    hideDropdown() {
	        // onKeyDown時にうまく動かなかったので
	        // requestAnimationFrameを挟んで実行タイミングをずらす
	        return new Promise(res => requestAnimationFrame(() => {
	            const { container, itemWrapper } = this.el;
	            [container, itemWrapper].forEach(el => setAriaExpanded(el, false));
	            this._isActive = false;
	            res();
	        }));
	    }
	    /**
	     * container elementのカスタムイベントを発火させる
	     * "SimpleSelectEvent"がカスタムイベント名
	     */
	    dispatchSelectEvent() {
	        const ev = new CustomEvent("SimpleSelectEvent", {
	            detail: this.items[this._currentIdx],
	        });
	        this.el.container.dispatchEvent(ev);
	    }
	    onKeyDownHandler(e) {
	        // イベントのバブリングを停止させる
	        e.stopPropagation();
	        if (!this.isActive) {
	            // 非アクティブ状態の際は特殊モード
	            this.showDropdown();
	            return;
	        }
	        const isArrowDown = e.key === "ArrowDown" || e.keyCode === 40;
	        const isArrowUp = e.key === "ArrowUp" || e.keyCode === 38;
	        const isEnter = e.key === "Enter" || e.keyCode === 13;
	        const isSpace = e.key === "Space" || e.keyCode === 32;
	        if (isArrowUp) {
	            const idx = (this._currentIdx > 0)
	                ? --this._currentIdx
	                : 0;
	            this.updateHighlightItem(idx);
	        }
	        else if (isArrowDown) {
	            const idx = (this._currentIdx < this.items.length - 1)
	                ? ++this._currentIdx
	                : this._currentIdx;
	            this.updateHighlightItem(idx);
	        }
	        else if (isEnter || isSpace) {
	            const idx = this._currentIdx;
	            this.updateCurrentItem(idx);
	            this.hideDropdown();
	        }
	    }
	    applyEventListeners() {
	        const { container, items } = this.el;
	        container.addEventListener("blur", () => {
	            this.hideDropdown();
	        });
	        container.addEventListener("click", () => {
	            (!this.isActive)
	                ? this.showDropdown()
	                : this.hideDropdown();
	        });
	        container.addEventListener("keydown", e => this.onKeyDownHandler(e));
	        items.forEach(el => {
	            el.addEventListener("mouseenter", () => {
	                const idx = parseInt(el.dataset.itemIdx || "", 10);
	                this.updateHighlightItem(idx);
	            });
	            el.addEventListener("click", () => {
	                const idx = parseInt(el.dataset.itemIdx || "", 10);
	                this.updateCurrentItem(idx);
	            });
	        });
	    }
	}

	class SimpleCheckboxBuilder {
	    constructor(classNames = {}, icons = {}) {
	        this.classNames = Object.assign(this.defaultCheckboxClassNames, classNames);
	        this.icons = Object.assign(this.defaultCheckboxIcons, icons);
	    }
	    get defaultCheckboxClassNames() {
	        return {
	            container: "simpleCheckbox_container",
	            label: "simpleCheckbox_label",
	            iconWrapper: "simpleCheckbox_iconWrapper",
	        };
	    }
	    get defaultCheckboxIcons() {
	        // material.io: check_box(modified)
	        const outerPathDs = ["M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"];
	        // material.io: check_box(modified)
	        const innerPathDs = ["M17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"];
	        const outer = createSVG(outerPathDs);
	        const inner = createSVG(innerPathDs);
	        return {
	            outer,
	            inner
	        };
	    }
	    create(label, initialValue = false, className) {
	        const el = this.genCheckboxElements(label, className);
	        const checkbox = new SimpleCheckbox(el);
	        if (initialValue)
	            checkbox.setChecked(initialValue, false);
	        return checkbox;
	    }
	    genCheckboxElements(label, className = "") {
	        const names = this.classNames;
	        const containerEl = createButton(names.container + " " + className);
	        containerEl.setAttribute("role", "switch");
	        setAriaChecked(containerEl, false);
	        containerEl.title = label;
	        const labelEl = createSpan(names.label);
	        labelEl.textContent = label;
	        const iconWrapperEl = createDiv(names.iconWrapper);
	        [
	            this.icons.outer.cloneNode(true),
	            this.icons.inner.cloneNode(true)
	        ].forEach(el => iconWrapperEl.appendChild(el));
	        [labelEl, iconWrapperEl].forEach(el => containerEl.appendChild(el));
	        return {
	            container: containerEl,
	            label: labelEl,
	            iconWrapper: iconWrapperEl
	        };
	    }
	}
	class SimpleCheckbox {
	    constructor(el) {
	        this._isActive = false;
	        this.el = el;
	        this.applyEventListeners();
	    }
	    get isActive() {
	        return this._isActive;
	    }
	    set isActive(bool) {
	        this.setChecked(bool);
	    }
	    toggle() {
	        // reverse bool
	        const bool = !this._isActive;
	        this.setChecked(bool);
	    }
	    setChecked(bool, isDispatchEvent = true) {
	        this._isActive = bool;
	        // aria-checkedも同時に切り替える
	        this.updateAriaChecked(bool);
	        if (isDispatchEvent)
	            this.dispatchCheckboxEvent();
	    }
	    updateAriaChecked(bool) {
	        setAriaChecked(this.el.container, bool);
	    }
	    dispatchCheckboxEvent() {
	        const ev = new CustomEvent("SimpleCheckboxEvent", {
	            detail: this._isActive
	        });
	        this.el.container.dispatchEvent(ev);
	    }
	    applyEventListeners() {
	        this.el.container.addEventListener("click", e => {
	            this.toggle();
	            e.stopPropagation();
	        });
	    }
	}

	exports.SimpleCheckbox = SimpleCheckbox;
	exports.SimpleCheckboxBuilder = SimpleCheckboxBuilder;
	exports.SimpleSelect = SimpleSelect;
	exports.SimpleSelectBuilder = SimpleSelectBuilder;
	});

	unwrapExports(dist);
	var dist_1 = dist.SimpleCheckbox;
	var dist_2 = dist.SimpleCheckboxBuilder;
	var dist_3 = dist.SimpleSelect;
	var dist_4 = dist.SimpleSelectBuilder;

	class LaymicPreference {
	    constructor(builder, rootEl) {
	        this.PREFERENCE_KEY = "laymic_preferenceData";
	        // preference save data
	        this.data = LaymicPreference.defaultPreferenceData;
	        this.builder = builder;
	        const selectBuilder = new dist_4(this.builder.classNames.select);
	        const icons = this.builder.icons;
	        const checkboxBuilder = new dist_2(this.builder.classNames.checkbox, {
	            inner: this.builder.createSvgUseElement(icons.checkboxInner),
	            outer: this.builder.createSvgUseElement(icons.checkboxOuter),
	        });
	        const containerEl = builder.createDiv();
	        setAriaExpanded(containerEl, false);
	        const names = this.builder.classNames.preference;
	        containerEl.className = names.container;
	        const wrapperEl = builder.createDiv();
	        wrapperEl.className = names.wrapper;
	        setRole(wrapperEl, "list");
	        const isAutoFullscreen = checkboxBuilder.create("ビューワー展開時の自動全画面化", false, this.genPreferenceButtonClass(names.isAutoFullscreen));
	        const isDisabledTapSlidePage = checkboxBuilder.create("タップでのページ送り無効化", false, this.genPreferenceButtonClass(names.isDisabledTapSlidePage));
	        const isDisabledForceHorizView = checkboxBuilder.create("端末横持ち時の強制2p表示無効化", false, this.genPreferenceButtonClass(names.isDisabledForceHorizView));
	        const isDisabledDoubleTapResetZoom = checkboxBuilder.create("ズーム中ダブルタップでのズーム解除無効化", false, this.genPreferenceButtonClass(names.isDisabledDoubleTapResetZoom));
	        const progressBarWidth = selectBuilder.create("進捗バー表示設定", this.barWidthItems, this.genPreferenceButtonClass());
	        const paginationVisibility = selectBuilder.create("ページ送りボタン表示設定", this.uiVisibilityItems, this.genPreferenceButtonClass(names.paginationVisibility));
	        const zoomButtonRatio = selectBuilder.create("ズームボタン倍率設定", this.zoomButtonRatioItems, this.genPreferenceButtonClass(names.zoomButtonRatio));
	        const noticeEl = builder.createDiv();
	        noticeEl.className = names.notice;
	        [
	            "※1: 自動全画面化設定はビューワー展開ボタンクリック時にのみ用いられます",
	            "※2: タップページ送り無効化設定は次回ページ読み込み時に適用されます",
	        ].forEach(s => {
	            const p = builder.createParagraph();
	            p.textContent = s;
	            noticeEl.appendChild(p);
	        });
	        const prefItemEls = [
	            // ここでの並び順が表示順に反映される
	            progressBarWidth,
	            zoomButtonRatio,
	            paginationVisibility,
	            isAutoFullscreen,
	            isDisabledTapSlidePage,
	            isDisabledForceHorizView,
	            isDisabledDoubleTapResetZoom
	        ].map(choice => choice.el.container);
	        // 説明文要素を追加
	        prefItemEls.push(noticeEl);
	        prefItemEls.forEach(el => {
	            wrapperEl.appendChild(el);
	            setRole(el, "listitem");
	        });
	        containerEl.appendChild(wrapperEl);
	        this.rootEl = rootEl;
	        this.el = containerEl;
	        this.wrapperEl = wrapperEl;
	        this.choices = {
	            progressBarWidth,
	            paginationVisibility,
	            zoomButtonRatio,
	            isAutoFullscreen,
	            isDisabledTapSlidePage,
	            isDisabledForceHorizView,
	            isDisabledDoubleTapResetZoom,
	        };
	        // 各種イベントをボタンに適用
	        this.applyEventListeners();
	    }
	    /**
	     * defaultデータは静的メソッドとして、
	     * 外部からも容易に呼び出せるようにしておく
	     */
	    static get defaultPreferenceData() {
	        return {
	            isAutoFullscreen: false,
	            isDisabledTapSlidePage: false,
	            isDisabledForceHorizView: false,
	            isDisabledDoubleTapResetZoom: false,
	            progressBarWidth: "auto",
	            paginationVisibility: "auto",
	            zoomButtonRatio: 1.5,
	        };
	    }
	    get isAutoFullscreen() {
	        return this.data.isAutoFullscreen;
	    }
	    set isAutoFullscreen(bool) {
	        this.data.isAutoFullscreen = bool;
	        this.savePreferenceData();
	    }
	    get isDisabledTapSlidePage() {
	        return this.data.isDisabledTapSlidePage;
	    }
	    set isDisabledTapSlidePage(bool) {
	        this.data.isDisabledTapSlidePage = bool;
	        this.savePreferenceData();
	        this.dispatchPreferenceUpdateEvent("isDisabledTapSlidePage");
	    }
	    get isDisabledForceHorizView() {
	        return this.data.isDisabledForceHorizView;
	    }
	    set isDisabledForceHorizView(bool) {
	        this.data.isDisabledForceHorizView = bool;
	        this.savePreferenceData();
	        this.dispatchPreferenceUpdateEvent("isDisabledForceHorizView");
	    }
	    get isDisabledDoubleTapResetZoom() {
	        return this.data.isDisabledDoubleTapResetZoom;
	    }
	    set isDisabledDoubleTapResetZoom(bool) {
	        this.data.isDisabledDoubleTapResetZoom = bool;
	        this.savePreferenceData();
	    }
	    get progressBarWidth() {
	        return this.data.progressBarWidth;
	    }
	    set progressBarWidth(width) {
	        this.data.progressBarWidth = width;
	        this.savePreferenceData();
	        this.dispatchPreferenceUpdateEvent("progressBarWidth");
	    }
	    get paginationVisibility() {
	        return this.data.paginationVisibility;
	    }
	    set paginationVisibility(visibility) {
	        this.data.paginationVisibility = visibility;
	        this.savePreferenceData();
	        this.dispatchPreferenceUpdateEvent("paginationVisibility");
	    }
	    get zoomButtonRatio() {
	        return this.data.zoomButtonRatio;
	    }
	    set zoomButtonRatio(ratio) {
	        this.data.zoomButtonRatio = ratio;
	        this.savePreferenceData();
	    }
	    genPreferenceButtonClass(className = "") {
	        let btnClassName = this.builder.classNames.preference.button;
	        if (className)
	            btnClassName += " " + className;
	        return btnClassName;
	    }
	    get barWidthItems() {
	        return [
	            { value: "auto", label: "初期値" },
	            { value: "none", label: "非表示" },
	            { value: "tint", label: "細い" },
	            { value: "medium", label: "普通" },
	            { value: "bold", label: "太い" },
	        ];
	    }
	    get uiVisibilityItems() {
	        return [
	            { value: "auto", label: "初期値" },
	            { value: "hidden", label: "非表示" },
	            { value: "visible", label: "表示" },
	        ];
	    }
	    get zoomButtonRatioItems() {
	        return [
	            { value: 1.5, label: "1.5倍" },
	            { value: 2.0, label: "2.0倍" },
	            { value: 2.5, label: "2.5倍" },
	            { value: 3.0, label: "3.0倍" },
	        ];
	    }
	    /**
	     * preferenceと関係する項目をセットする
	     * 主にページ読み込み直後にLaymicクラスから呼び出される
	     */
	    applyPreferenceValues() {
	        // 更新前のデータをdeep copy
	        const oldData = Object.assign(this.data);
	        // 設定値をlocalStorageの値と同期させる
	        this.data = this.loadPreferenceData();
	        const dispatchs = [];
	        // 新旧で値が異なっていればdispatchsに追加
	        if (oldData.progressBarWidth !== this.data.progressBarWidth)
	            dispatchs.push("progressBarWidth");
	        if (oldData.paginationVisibility !== this.data.paginationVisibility)
	            dispatchs.push("paginationVisibility");
	        if (oldData.isDisabledTapSlidePage !== this.data.isDisabledTapSlidePage)
	            dispatchs.push("isDisabledTapSlidePage");
	        if (oldData.isDisabledForceHorizView !== this.data.isDisabledForceHorizView)
	            dispatchs.push("isDisabledForceHorizView");
	        dispatchs.forEach(s => this.dispatchPreferenceUpdateEvent(s));
	        // 読み込んだpreference値を各ボタン状態に適用
	        this.overwritePreferenceElValues();
	    }
	    /**
	     * 設定画面を表示する
	     */
	    show() {
	        this.rootEl.classList.add(this.builder.stateNames.showPreference);
	        setAriaExpanded(this.rootEl, true);
	    }
	    /**
	     * 設定画面を非表示とする
	     */
	    hide() {
	        this.rootEl.classList.remove(this.builder.stateNames.showPreference);
	        setAriaExpanded(this.rootEl, false);
	    }
	    /**
	     * BarWidthの値から進捗バー幅数値を取得する
	     * @param  widthStr BarWidth値
	     * @return          対応する数値
	     */
	    getBarWidth(widthStr = "auto") {
	        let width = 8;
	        if (widthStr === "none") {
	            width = 0;
	        }
	        else if (widthStr === "tint") {
	            width = 4;
	        }
	        else if (widthStr === "bold") {
	            width = 12;
	        }
	        return width;
	    }
	    savePreferenceData() {
	        localStorage.setItem(this.PREFERENCE_KEY, JSON.stringify(this.data));
	    }
	    dispatchPreferenceUpdateEvent(detail) {
	        const ev = new CustomEvent("LaymicPreferenceUpdate", {
	            detail
	        });
	        this.rootEl.dispatchEvent(ev);
	    }
	    /**
	     * localStorageから設定データを読み込む
	     */
	    loadPreferenceData() {
	        const dataStr = localStorage.getItem(this.PREFERENCE_KEY);
	        let data = LaymicPreference.defaultPreferenceData;
	        if (dataStr) {
	            try {
	                data = JSON.parse(dataStr);
	            }
	            catch (e) {
	                console.error(e);
	                localStorage.removeItem(this.PREFERENCE_KEY);
	            }
	        }
	        return data;
	    }
	    /**
	     * 現在のpreference状態をボタン状態に適用する
	     * 主に初期化時に用いる関数
	     */
	    overwritePreferenceElValues() {
	        const { paginationVisibility, progressBarWidth, zoomButtonRatio, isAutoFullscreen, isDisabledTapSlidePage, isDisabledForceHorizView, isDisabledDoubleTapResetZoom, } = this.choices;
	        const checkboxs = [
	            {
	                choice: isAutoFullscreen,
	                bool: this.isAutoFullscreen
	            },
	            {
	                choice: isDisabledTapSlidePage,
	                bool: this.isDisabledTapSlidePage
	            },
	            {
	                choice: isDisabledForceHorizView,
	                bool: this.isDisabledForceHorizView
	            },
	            {
	                choice: isDisabledDoubleTapResetZoom,
	                bool: this.isDisabledDoubleTapResetZoom
	            }
	        ];
	        checkboxs.forEach(obj => obj.choice.setChecked(obj.bool, false));
	        const selects = [
	            {
	                choice: paginationVisibility,
	                idx: this.uiVisibilityItems.findIndex(item => item.value === this.paginationVisibility)
	            },
	            {
	                choice: progressBarWidth,
	                idx: this.barWidthItems.findIndex(item => item.value === this.progressBarWidth)
	            },
	            {
	                choice: zoomButtonRatio,
	                idx: this.zoomButtonRatioItems.findIndex(item => item.value === this.zoomButtonRatio)
	            }
	        ];
	        selects.forEach(obj => {
	            if (obj.idx !== -1)
	                obj.choice.updateCurrentItem(obj.idx, false);
	        });
	    }
	    /**
	     * 各種ボタンイベントを登録する
	     * インスタンス生成時に一度だけ呼び出される
	     */
	    applyEventListeners() {
	        const { paginationVisibility, progressBarWidth, zoomButtonRatio, isAutoFullscreen, isDisabledTapSlidePage, isDisabledForceHorizView, isDisabledDoubleTapResetZoom, } = this.choices;
	        const isAutoFullscreenHandler = (bool) => this.isAutoFullscreen = bool;
	        const isDisabledTapSlidePageHandler = (bool) => this.isDisabledTapSlidePage = bool;
	        const isDisabledForceHorizViewHandler = (bool) => this.isDisabledForceHorizView = bool;
	        const isDisabledDoubleTapResetZoomHandler = (bool) => this.isDisabledDoubleTapResetZoom = bool;
	        const checkboxHandlers = [
	            {
	                choice: isAutoFullscreen,
	                handler: isAutoFullscreenHandler
	            },
	            {
	                choice: isDisabledTapSlidePage,
	                handler: isDisabledTapSlidePageHandler
	            },
	            {
	                choice: isDisabledForceHorizView,
	                handler: isDisabledForceHorizViewHandler
	            },
	            {
	                choice: isDisabledDoubleTapResetZoom,
	                handler: isDisabledDoubleTapResetZoomHandler
	            }
	        ];
	        checkboxHandlers.forEach(obj => {
	            obj.choice.el.container.addEventListener("SimpleCheckboxEvent", ((e) => {
	                obj.handler(e.detail);
	            }));
	        });
	        const paginationVisibilityHandler = (item) => {
	            if (isUIVisibility(item.value))
	                this.paginationVisibility = item.value;
	        };
	        const progressBarWidthHandler = (item) => {
	            if (isBarWidth(item.value))
	                this.progressBarWidth = item.value;
	        };
	        const zoomButtonRatioHandler = (item) => {
	            const ratio = item.value;
	            if (Number.isFinite(ratio))
	                this.zoomButtonRatio = ratio;
	        };
	        const selectHandlers = [
	            {
	                choice: paginationVisibility,
	                handler: paginationVisibilityHandler
	            },
	            {
	                choice: progressBarWidth,
	                handler: progressBarWidthHandler
	            },
	            {
	                choice: zoomButtonRatio,
	                handler: zoomButtonRatioHandler
	            }
	        ];
	        selectHandlers.forEach(obj => {
	            obj.choice.el.container.addEventListener("SimpleSelectEvent", ((e) => {
	                obj.handler(e.detail);
	            }));
	        });
	        // preference wrapperのクリックイベント
	        this.wrapperEl.addEventListener("click", e => {
	            // クリックイベントをpreference containerへ伝播させない
	            e.stopPropagation();
	        });
	        // preference containerのクリックイベント
	        this.el.addEventListener("click", () => {
	            this.hide();
	        });
	    }
	}

	class LaymicThumbnails {
	    constructor(builder, rootEl, pages, thumbPages, state) {
	        this.builder = builder;
	        const thumbsClassNames = this.builder.classNames.thumbs;
	        const thumbsEl = builder.createDiv();
	        thumbsEl.className = thumbsClassNames.container;
	        // 初期状態では表示しないようにしておく
	        thumbsEl.style.display = "none";
	        setAriaExpanded(thumbsEl, false);
	        const wrapperEl = builder.createDiv();
	        wrapperEl.className = thumbsClassNames.wrapper;
	        setRole(wrapperEl, "list");
	        const thumbEls = [];
	        const loopLen = pages.length;
	        // idxを使いたいので古めかしいforループを使用
	        for (let i = 0; i < loopLen; i++) {
	            const p = pages[i];
	            const t = thumbPages[i] || "";
	            let el;
	            if (t !== "" || typeof p === "string") {
	                let src = "";
	                if (t !== "") {
	                    src = t;
	                }
	                else if (typeof p === "string") {
	                    src = p;
	                }
	                const img = new Image();
	                img.dataset.src = src;
	                img.className = `${thumbsClassNames.lazyload} ${thumbsClassNames.imgThumb}`;
	                el = img;
	            }
	            else {
	                // thumbs用にnodeをコピー
	                const slideEl = p.cloneNode(true);
	                if (!(slideEl instanceof Element))
	                    continue;
	                el = slideEl;
	                el.classList.add(thumbsClassNames.slideThumb);
	            }
	            el.classList.add(thumbsClassNames.item);
	            if (el instanceof HTMLElement)
	                setRole(el, "listitem");
	            thumbEls.push(el);
	            wrapperEl.appendChild(el);
	        }
	        thumbsEl.appendChild(wrapperEl);
	        this.el = thumbsEl;
	        this.wrapperEl = wrapperEl;
	        this.thumbEls = thumbEls;
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
	     * thumbsWrapperElのwidthを計算し、
	     * 折り返しが発生しないようなら横幅の値を書き換える
	     */
	    cssThumbsWrapperWidthUpdate(rootEl) {
	        const { offsetWidth: ow } = rootEl;
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
	    show() {
	        if (this.el.style.display === "none") {
	            // ページ読み込み後一度だけ動作する
	            this.el.style.display = "";
	            this.revealImgs();
	        }
	        this.rootEl.classList.add(this.builder.stateNames.showThumbs);
	        setAriaExpanded(this.rootEl, true);
	    }
	    hide() {
	        this.rootEl.classList.remove(this.builder.stateNames.showThumbs);
	        setAriaExpanded(this.rootEl, false);
	    }
	    /**
	     * 読み込み待ち状態のimg elementを全て読み込む
	     * いわゆるlazyload処理
	     */
	    revealImgs() {
	        const { lazyload, lazyloading, lazyloaded } = this.builder.classNames.thumbs;
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
	                });
	                el.src = s;
	            }
	        });
	    }
	    /**
	     * 各種イベントリスナーの登録
	     */
	    applyEventListeners() {
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

	class LaymicHelp {
	    constructor(builder, rootEl) {
	        this.ISDISPLAYED_KEY = "laymic_isHelpDisplayed";
	        // 表示済みか否かを判別するbool
	        this._isDisplayed = false;
	        this.rootEl = rootEl;
	        this.builder = builder;
	        const helpClassNames = builder.classNames.help;
	        const containerEl = builder.createDiv();
	        containerEl.className = helpClassNames.container;
	        setAriaExpanded(containerEl, false);
	        const wrapperEl = builder.createHelpWrapperEl();
	        containerEl.appendChild(wrapperEl);
	        this.el = containerEl;
	        this.wrapperEl = containerEl;
	        // 各種イベントをボタンに適用
	        this.applyEventListeners();
	        this.loadIsDisplayedData();
	        if (!this.isDisplayed) {
	            this.show();
	        }
	    }
	    loadIsDisplayedData() {
	        const isDisplayedStr = localStorage.getItem(this.ISDISPLAYED_KEY) || "";
	        if (isDisplayedStr === "true") {
	            this._isDisplayed = true;
	        }
	    }
	    get isDisplayed() {
	        return this._isDisplayed;
	    }
	    set isHelpDisplayed(bool) {
	        this._isDisplayed = bool;
	        localStorage.setItem(this.ISDISPLAYED_KEY, "true");
	    }
	    show() {
	        this.rootEl.classList.add(this.builder.stateNames.showHelp);
	        setAriaExpanded(this.rootEl, true);
	    }
	    hide() {
	        this.rootEl.classList.remove(this.builder.stateNames.showHelp);
	        setAriaExpanded(this.rootEl, false);
	        this.isHelpDisplayed = true;
	    }
	    applyEventListeners() {
	        this.el.addEventListener("click", () => {
	            this.hide();
	        });
	    }
	}

	class LaymicZoom {
	    constructor(builder, rootEl, preference) {
	        this.state = this.defaultLaymicZoomStates;
	        const zoomEl = builder.createDiv();
	        zoomEl.className = builder.classNames.zoom.controller;
	        this.controller = zoomEl;
	        this.rootEl = rootEl;
	        this.wrapper = builder.createZoomWrapper();
	        this.builder = builder;
	        this.preference = preference;
	        this.applyEventListeners();
	    }
	    /**
	     * LaymicZoomStatesのデフォルト値を返す
	     * @return LaymicZoomStatesデフォルト値
	     */
	    get defaultLaymicZoomStates() {
	        return {
	            zoomRatio: 1.0,
	            minRatio: 1.0,
	            maxRatio: 3.0,
	            isSwiped: false,
	            isMouseDown: false,
	            pastX: 0,
	            pastY: 0,
	            zoomRect: {
	                t: 0,
	                l: 0,
	                w: 800,
	                h: 600,
	            },
	            pastDistance: 1
	        };
	    }
	    /**
	     * 現在ズームがなされているかを返す
	     *
	     * 真面目な処理だと操作感があまり良くなかったので
	     * ズーム状態のしきい値を動かすインチキを行っている。
	     *
	     * @return ズーム状態であるならtrue
	     */
	    get isZoomed() {
	        // フルスクリーン状態ではちょっとインチキ、
	        // 非フルスクリーン状態ではだいぶインチキ
	        const ratio = (this.isFullscreen)
	            ? 1.025
	            : 1.1;
	        return this.state.zoomRatio > ratio;
	    }
	    /**
	     * 現在のzoomRatioの値を返す
	     * @return zoomRatioの値
	     */
	    get zoomRatio() {
	        return this.state.zoomRatio;
	    }
	    /**
	     * フルスクリーン状態であるかを返す
	     * @return フルスクリーン状態であるならtrue
	     */
	    get isFullscreen() {
	        return !!document.fullscreenElement;
	    }
	    /**
	     * ピンチズーム処理を行う
	     * @param  e タッチイベント
	     */
	    pinchZoom(e) {
	        const distance = this.getDistanceBetweenTouches(e);
	        const { innerWidth: iw, innerHeight: ih } = window;
	        // 画面サイズの対角線上距離を最大距離とする
	        const maxD = Math.sqrt(iw ** 2 + ih ** 2);
	        const pinchD = distance - this.state.pastDistance;
	        const { minRatio, maxRatio } = this.state;
	        // 計算値そのままでは動作が硬いので
	        // 感度を6倍にしてスマホブラウザ操作感と近づける
	        const ratio = this.state.zoomRatio + (pinchD / maxD) * 6;
	        // maxRatio~minRatio間に収まるよう調整
	        const zoomRatio = Math.max(Math.min(ratio, maxRatio), minRatio);
	        // タッチ座標と画面中央座標を取得し、
	        // その平均値をズームの中心座標とする
	        const [bx, by] = this.getNormalizedPosBetweenTouches(e);
	        const [cx, cy] = this.getNormalizedCurrentCenter();
	        const zoomX = (bx + cx) / 2;
	        const zoomY = (by + cy) / 2;
	        this.enableZoom(zoomRatio, zoomX, zoomY);
	        this.state.pastDistance = distance;
	    }
	    /**
	     * zoomRectの値を更新する
	     * translateXとtranslateYの値を入力していれば自前で計算し、
	     * そうでないなら`getControllerRect()`を呼び出す
	     *
	     * @param  translateX 新たなleft座標
	     * @param  translateY 新たなtop座標
	     */
	    updateZoomRect(translateX, translateY) {
	        let zoomRect;
	        if (translateX !== void 0 && translateY !== void 0) {
	            const { clientHeight: rootCH, clientWidth: rootCW } = this.rootEl;
	            const ratio = this.state.zoomRatio;
	            zoomRect = {
	                l: translateX,
	                t: translateY,
	                w: rootCW * ratio,
	                h: rootCH * ratio
	            };
	        }
	        else {
	            zoomRect = this.getControllerRect();
	        }
	        this.state.zoomRect = zoomRect;
	    }
	    updatePastDistance(e) {
	        const distance = this.getDistanceBetweenTouches(e);
	        this.state.pastDistance = distance;
	    }
	    /**
	     * ズームモードに入る
	     * @param  zoomRatio ズーム倍率
	     * @param  zoomX     正規化されたズーム時中央横座標
	     * @param  zoomY     正規化されたズーム時中央縦座標
	     */
	    enable(zoomRatio = 1.5, zoomX = 0.5, zoomY = 0.5) {
	        this.enableController();
	        this.enableZoom(zoomRatio, zoomX, zoomY);
	    }
	    /**
	     * 拡大縮小処理を行う
	     * 引数を省略した場合は中央寄せでズームする
	     * @param  zoomRatio ズーム倍率
	     * @param  zoomX     正規化されたズーム時中央横座標
	     * @param  zoomY     正規化されたズーム時中央縦座標
	     */
	    enableZoom(zoomRatio = 1.5, zoomX = 0.5, zoomY = 0.5) {
	        const { clientWidth: cw, clientHeight: ch } = this.rootEl;
	        const translateX = -((cw * zoomRatio - cw) * zoomX);
	        const translateY = -((ch * zoomRatio - ch) * zoomY);
	        // 内部値の書き換え
	        this.state.zoomRatio = zoomRatio;
	        this.updateZoomRect(translateX, translateY);
	        // 内部値に応じたcss transformの設定
	        // 非フルスクリーン時は内部値だけ変更しcssは据え置き
	        this.setTransformProperty();
	    }
	    /**
	     * ズーム時操作要素を前面に出す
	     */
	    enableController() {
	        const zoomed = this.builder.stateNames.zoomed;
	        this.wrapper.classList.add(zoomed);
	    }
	    /**
	     * ズームモードから抜ける
	     */
	    disable() {
	        const zoomed = this.builder.stateNames.zoomed;
	        this.wrapper.classList.remove(zoomed);
	        this.state.zoomRatio = 1.0;
	        this.wrapper.style.transform = "";
	    }
	    /**
	     * タッチされた二点間の距離を返す
	     * reference: https://github.com/nolimits4web/swiper/blob/master/src/components/zoom/zoom.js
	     *
	     * @return 二点間の距離
	     */
	    getDistanceBetweenTouches(e) {
	        // タッチ数が2点に満たない場合は1を返す
	        if (e.targetTouches.length < 2)
	            return 0;
	        const { clientX: x0, clientY: y0 } = e.targetTouches[0];
	        const { clientX: x1, clientY: y1 } = e.targetTouches[1];
	        const distance = ((x1 - x0) ** 2) + ((y1 - y0) ** 2);
	        return Math.sqrt(Math.abs(distance));
	    }
	    /**
	     * タッチされた二点の座標の中心点から、
	     * 正規化された拡大時中心点を返す
	     *
	     * @param  e TouchEvent
	     * @return   [betweenX, betweenY]
	     */
	    getNormalizedPosBetweenTouches(e) {
	        if (e.targetTouches.length < 2)
	            return [0.5, 0.5];
	        const { l: rl, t: rt, w: rw, h: rh } = this.state.zoomRect;
	        const { clientX: x0, clientY: y0 } = e.targetTouches[0];
	        const { clientX: x1, clientY: y1 } = e.targetTouches[1];
	        const rx = Math.abs(rl);
	        const ry = Math.abs(rt);
	        // between x
	        const bx = ((x0 + rx) + (x1 + ry)) / 2;
	        // between y
	        const by = ((y0 + ry) + (y1 + ry)) / 2;
	        return [bx / rw, by / rh];
	    }
	    /**
	     * 画面中央座標を正規化して返す
	     * @return [centeringX, centeringY]
	     */
	    getNormalizedCurrentCenter() {
	        const { innerWidth: cw, innerHeight: ch } = window;
	        const { l: rx, t: ry, w: rw, h: rh } = this.state.zoomRect;
	        const maxX = rw - cw;
	        const maxY = rh - ch;
	        // `0 / 0`とした際はNaNとなってバグが出るので
	        // max値に1を足しておく
	        const nx = Math.abs(rx) / (maxX + 1);
	        const ny = Math.abs(ry) / (maxY + 1);
	        // 戻り値が[0, 0]の場合は[0.5, 0.5]を返す
	        return (nx !== 0 || ny !== 0) ? [nx, ny] : [0.5, 0.5];
	    }
	    /**
	     * css transformの値を設定する
	     * ズームが行われていない際、また非フルスクリーン時は
	     * cssへのtransform追加を行わない
	     */
	    setTransformProperty() {
	        const { l: tx, t: ty } = this.state.zoomRect;
	        const ratio = this.state.zoomRatio;
	        // モバイル環境ではないか、
	        // モバイル環境でフルスクリーンの際にのみ
	        // transformの値をセットする
	        const isSetTransform = this.isFullscreen || !isMobile();
	        const transformStr = (this.isZoomed && isSetTransform)
	            ? `translate(${tx}px, ${ty}px) scale(${ratio})`
	            : "";
	        this.wrapper.style.transform = transformStr;
	    }
	    /**
	     * touchstartに対して登録する処理まとめ
	     * @param  e タッチイベント
	     */
	    touchStartHandler(e) {
	        e.stopPropagation();
	        this.state.isSwiped = false;
	        // for swipe
	        const { clientX: x, clientY: y } = e.targetTouches[0];
	        this.updatePastPos(x, y);
	        // for pinch out/in
	        this.updatePastDistance(e);
	    }
	    /**
	     * touchmoveイベントに対して登録する処理まとめ
	     * @param  e タッチイベント
	     */
	    touchMoveHandler(e) {
	        // rafThrottleでの非同期呼び出しを行うので
	        // 呼び出し時にisZoomedがfalseとなっていれば早期リターン
	        // また、デバイス側ズームがなされている状態でも早期リターン
	        if (!this.isZoomed)
	            return;
	        e.stopPropagation();
	        if (isMultiTouch(e)) {
	            // multi touch
	            this.pinchZoom(e);
	        }
	        else {
	            // single touch
	            const { clientX: x, clientY: y } = e.targetTouches[0];
	            this.state.isSwiped = true;
	            this.setTranslate(x, y);
	            this.updatePastPos(x, y);
	        }
	    }
	    /**
	     * もろもろのEventListenerを登録する
	     * インスタンス生成時に一度だけ呼ばれることを想定
	     */
	    applyEventListeners() {
	        const applyEventsForMobile = () => {
	            this.controller.addEventListener("touchstart", e => this.touchStartHandler(e));
	            const touchMove = cancelableRafThrottle(e => this.touchMoveHandler(e));
	            this.controller.addEventListener("touchmove", touchMove.listener, passiveFalseOption);
	            const disableZoom = () => {
	                // touchMoveHandlerが非同期処理されないよう
	                // キャンセルをかけておく
	                touchMove.canceler();
	                // zoom処理を強制終了
	                this.disable();
	            };
	            this.controller.addEventListener("touchend", e => {
	                e.stopPropagation();
	                if (this.state.isSwiped || this.isZoomed)
	                    return;
	                // ズーム倍率が一定以下の場合はズームモードを終了させる
	                disableZoom();
	            });
	            // タップすると標準倍率に戻す処理
	            this.controller.addEventListener("click", createDoubleClickHandler(() => {
	                // 関連する設定がfalseの際には
	                // ダブルタップでズーム無効化
	                if (!this.preference.isDisabledDoubleTapResetZoom) {
	                    disableZoom();
	                }
	            }));
	        };
	        const applyEventsForPC = () => {
	            this.controller.addEventListener("click", () => {
	                // ドラッグ操作がなされている場合は処理をスキップ
	                if (this.state.isSwiped)
	                    return;
	                // zoom要素クリックでzoom解除
	                this.disable();
	            });
	            this.controller.addEventListener("mousedown", e => {
	                this.state.isMouseDown = true;
	                this.state.isSwiped = false;
	                this.updatePastPos(e.clientX, e.clientY);
	            });
	            [
	                "mouseup",
	                "mouseleave"
	            ].forEach(ev => this.controller.addEventListener(ev, () => {
	                this.state.isMouseDown = false;
	            }));
	            this.controller.addEventListener("mousemove", rafThrottle(e => {
	                // mousedown状況下でなければスキップ
	                if (!this.state.isMouseDown)
	                    return;
	                this.state.isSwiped = true;
	                this.setTranslate(e.clientX, e.clientY);
	                this.updatePastPos(e.clientX, e.clientY);
	            }));
	        };
	        // モバイルとPCで適用イベント変更
	        if (isMobile()) {
	            applyEventsForMobile();
	        }
	        else {
	            applyEventsForPC();
	        }
	    }
	    /**
	     * 過去の座標値を更新する
	     * @param  x 新しいx座標
	     * @param  y 新しいy座標
	     */
	    updatePastPos(x, y) {
	        this.state.pastX = x;
	        this.state.pastY = y;
	    }
	    /**
	     * controller要素のサイズを取得する
	     * @return PageRectの形式に整えられたサイズ値
	     */
	    getControllerRect() {
	        const rect = this.controller.getBoundingClientRect();
	        return {
	            t: rect.top,
	            l: rect.left,
	            w: rect.width,
	            h: rect.height,
	        };
	    }
	    /**
	     * 指定された座標に応じてwrapperのtranslateの値を動かす
	     * @param  currentX x座標
	     * @param  currentY y座標
	     */
	    setTranslate(currentX, currentY) {
	        const { clientWidth: cw, clientHeight: ch } = this.rootEl;
	        const { pastX, pastY, zoomRect } = this.state;
	        const { t: ry, l: rx, w: rw, h: rh } = zoomRect;
	        const x = pastX - currentX;
	        const y = pastY - currentY;
	        // これ以上の数値にはならないしきい値
	        const maxX = -(rw - cw);
	        const maxY = -(rh - ch);
	        const calcX = rx - x;
	        const calcY = ry - y;
	        let translateX = calcX;
	        if (calcX < maxX) {
	            // maxXより小さければmaxXを返す
	            translateX = maxX;
	        }
	        else if (calcX > 0) {
	            // 0より大きければ0を返す
	            translateX = 0;
	        }
	        let translateY = calcY;
	        if (calcY < maxY) {
	            translateY = maxY;
	        }
	        else if (calcY > 0) {
	            translateY = 0;
	        }
	        zoomRect.l = translateX;
	        zoomRect.t = translateY;
	        // 設定した値をcss transformとして反映
	        this.setTransformProperty();
	    }
	}

	class LaymicCSSVariables {
	    constructor(el, state) {
	        this.el = el;
	        this.state = state;
	    }
	    /**
	     * laymicインスタンスの初期化時に行うcss変数登録まとめ関数
	     */
	    initCSSVars() {
	        this.updatePageMaxSize();
	        this.updateProgressBarWidth();
	        this.updateViewerPadding();
	        this.updateJsVh();
	    }
	    /**
	     * css変数として表示可能ページサイズを登録する
	     * 厳密な表示サイズを計算する仕様に変更
	     */
	    updatePageSize() {
	        const { w: width, h: height } = this.getPageRealSize();
	        this.el.rootEl.style.setProperty("--page-width", width + "px");
	        this.el.rootEl.style.setProperty("--page-height", height + "px");
	    }
	    /**
	     * laymicに登録されたページ最大サイズをcss変数に登録する
	     */
	    updatePageMaxSize() {
	        const { w: pageW, h: pageH } = this.state.pageSize;
	        this.el.rootEl.style.setProperty("--page-max-width", pageW + "px");
	        this.el.rootEl.style.setProperty("--page-max-height", pageH + "px");
	    }
	    /**
	     * プログレスバーの太さ数値をcss変数に登録する
	     */
	    updateProgressBarWidth() {
	        this.el.rootEl.style.setProperty("--progressbar-width", this.state.progressBarWidth + "px");
	    }
	    /**
	     * viewerPadding数値をcss変数に登録する
	     */
	    updateViewerPadding() {
	        this.el.rootEl.style.setProperty("--viewer-padding", this.state.viewerPadding + "px");
	    }
	    /**
	     * 各スライド実寸サイズ / 最大表示サイズの比率をcss変数に登録する
	     * この数値を使えば正確なscaleが行えるようになるはず
	     *
	     * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
	     */
	    updatePageScaleRatio() {
	        const ratio = this.getPageScaleRatio();
	        this.el.rootEl.style.setProperty("--page-scale-ratio", ratio.toString());
	    }
	    updateJsVh() {
	        calcWindowVH(this.el.rootEl);
	    }
	    /**
	     * cssレイアウトに用いる各ページサイズを返す
	     * 正確な値ではないことに注意
	     */
	    // private getPageSize(): PageSize {
	    //   const {w: aw, h: ah} = this.state.pageAspect;
	    //   const {offsetWidth: ow, offsetHeight: oh} = this.el.rootEl;
	    //   const {progressBarWidth: pbw, viewerPadding: vp, isVertView} = this.state;
	    //
	    //   const paddingNum = vp * 2;
	    //   // 最大サイズ
	    //   const [mw, mh] = (!isVertView)
	    //     ? [ow - paddingNum, oh - (pbw + paddingNum)]
	    //     : [ow - (pbw + paddingNum), oh - paddingNum];
	    //
	    //   let {w: pageWidth, h: pageHeight} = this.state.pageSize;
	    //
	    //   // 横読み時にはプログレスバー幅を差し引いた縦幅を計算に使い、
	    //   // 縦読み時はプログレスバー幅を差し引いた横幅を計算に使う
	    //   if (!this.state.isVertView && mw < pageWidth * 2
	    //     || mw > pageWidth && mh < pageHeight)
	    //   {
	    //     // 横読み時または縦読み時で横幅が狭い場合でのサイズ計算
	    //     pageWidth = Math.round(mh * aw / ah);
	    //     pageHeight = Math.round(pageWidth * ah / aw);
	    //   } else if (mh < pageHeight) {
	    //     // 縦読み時で縦幅が狭い場合のサイズ計算
	    //     pageHeight = Math.round(mw * ah / aw);
	    //     pageWidth = Math.round(pageHeight * aw / ah);
	    //   }
	    //
	    //   return {
	    //     w: pageWidth,
	    //     h: pageHeight
	    //   }
	    // }
	    /**
	     * pageMaxSizeとpageRealSizeの差異から縮小率を返す
	     * @return                        scaleに用いる縮小表示率
	     */
	    getPageScaleRatio() {
	        const { w: realW, h: realH } = this.getPageRealSize();
	        const { w: pageW, h: pageH } = this.state.pageSize;
	        // アスペクト比固定の縮小表示を想定しているため
	        // 対角線上の長さを取ってから比較する
	        const realD = Math.sqrt(realW ** 2 + realH ** 2);
	        const pageD = Math.sqrt(pageW ** 2 + pageH ** 2);
	        // 最大1に収まるようclampしておく
	        return Math.min(realD / pageD, 1);
	    }
	    /**
	     * ページの実寸表示数値を出力する
	     * getPageSize()と比較して、厳密な計算を行っていることが特徴
	     * @return                        実寸のページサイズ
	     */
	    getPageRealSize() {
	        const { w: aw, h: ah } = this.state.pageAspect;
	        const { offsetWidth: ow, offsetHeight: oh } = this.el.rootEl;
	        const { progressBarWidth: pbw, viewerPadding: vp, isVertView, isDoubleSlideHorizView } = this.state;
	        const paddingNum = vp * 2;
	        // 正確な表示幅サイズ
	        const [mw, mh] = (!isVertView)
	            ? [ow - paddingNum, oh - (pbw + paddingNum)]
	            : [ow - (pbw + paddingNum), oh - paddingNum];
	        let { w: width, h: height } = this.state.pageSize;
	        // 横読み2p表示で縮小の必要性がない場合
	        const isDoubleSlideMaxSize = isDoubleSlideHorizView && width * 2 < mw && height < mh;
	        // 1p表示で縮小の必要性が無い場合
	        const isSingleSlideMaxSize = !isDoubleSlideHorizView && width < mw && height < mh;
	        if (isDoubleSlideMaxSize || isSingleSlideMaxSize) ;
	        else if (!isVertView && isDoubleSlideHorizView) {
	            // 横読み2p
	            // 横幅の半分基準か縦幅基準で値が小さい方を採用
	            width = Math.min(mw / 2, mh * aw / ah);
	            height = width * ah / aw;
	        }
	        else {
	            // 縦読み & 横読み1p
	            // 横幅値か縦幅基準計算値の小さい方を採用
	            width = Math.min(mw, mh * aw / ah);
	            height = width * ah / aw;
	        }
	        return {
	            w: width,
	            h: height
	        };
	    }
	}

	class LaymicStates {
	    constructor() {
	        this.viewerIdx = viewerCnt();
	        this.viewerId = "laymic";
	        this.viewerPadding = 10;
	        // デフォルト値としてウィンドウ幅を指定
	        this.rootRect = {
	            l: 0,
	            t: 0,
	            w: window.innerWidth,
	            h: window.innerHeight,
	        };
	        this.pageSize = {
	            w: 720,
	            h: 1024
	        };
	        this.pageAspect = {
	            w: 45,
	            h: 64
	        };
	        this.isLTR = false;
	        this.isVertView = false;
	        // 空白をつけた左始めがデフォルト設定
	        this.isFirstSlideEmpty = true;
	        this.isAppendEmptySlide = true;
	        this.vertPageMargin = 10;
	        this.horizPageMargin = 0;
	        // mediumと同じ数値
	        this.progressBarWidth = 8;
	        this.thumbItemHeight = 128;
	        this.thumbItemWidth = 96;
	        this.thumbItemGap = 16;
	        this.thumbsWrapperPadding = 16;
	        this.isInstantOpen = true;
	        this.bodyScrollTop = 0;
	        this.isActive = false;
	        this.isDisabledForceHorizView = false;
	    }
	    get thresholdWidth() {
	        return this.pageSize.w;
	    }
	    ;
	    get isMobile() {
	        return isMobile();
	    }
	    /**
	     * デバイスの向き方向を返す
	     * @return 横向き/縦向き/不明のどれか
	     */
	    get deviceOrientation() {
	        return getDeviceOrientation();
	    }
	    /**
	     * 横読み2p表示するか否かの判定を行う
	     * 縦読みモード時にはfalseを返す
	     * @return  2p表示している状態ならばtrue
	     */
	    get isDoubleSlideHorizView() {
	        return this.isMobile2pView || !this.isVertView && this.isDoubleSlideWidth;
	    }
	    /**
	     * 横読み2p表示する解像度であるか否かの判定を行う
	     * @return 2p表示解像度であるならtrue
	     */
	    get isDoubleSlideWidth() {
	        return this.thresholdWidth <= window.innerWidth;
	    }
	    /**
	     * モバイル端末での強制2p見開き表示モードか否かを判定する
	     * @return 2p見開き表示条件ならばtrue
	     */
	    get isMobile2pView() {
	        return this.isMobile && !this.isDisabledForceHorizView && this.deviceOrientation === "landscape";
	    }
	    /**
	     * pageSizeと関連する部分を一挙に設定する
	     * @param  width  新たなページ横幅
	     * @param  height 新たなページ縦幅
	     */
	    setPageSize(width, height) {
	        this.pageSize = {
	            w: width,
	            h: height,
	        };
	        const gcd = calcGCD(width, height);
	        this.pageAspect = {
	            w: width / gcd,
	            h: height / gcd,
	        };
	    }
	}

	/**
	 * SSR Window 1.0.1
	 * Better handling for window object in SSR environment
	 * https://github.com/nolimits4web/ssr-window
	 *
	 * Copyright 2018, Vladimir Kharlampidi
	 *
	 * Licensed under MIT
	 *
	 * Released on: July 18, 2018
	 */
	var doc = (typeof document === 'undefined') ? {
	  body: {},
	  addEventListener: function addEventListener() {},
	  removeEventListener: function removeEventListener() {},
	  activeElement: {
	    blur: function blur() {},
	    nodeName: '',
	  },
	  querySelector: function querySelector() {
	    return null;
	  },
	  querySelectorAll: function querySelectorAll() {
	    return [];
	  },
	  getElementById: function getElementById() {
	    return null;
	  },
	  createEvent: function createEvent() {
	    return {
	      initEvent: function initEvent() {},
	    };
	  },
	  createElement: function createElement() {
	    return {
	      children: [],
	      childNodes: [],
	      style: {},
	      setAttribute: function setAttribute() {},
	      getElementsByTagName: function getElementsByTagName() {
	        return [];
	      },
	    };
	  },
	  location: { hash: '' },
	} : document; // eslint-disable-line

	var win = (typeof window === 'undefined') ? {
	  document: doc,
	  navigator: {
	    userAgent: '',
	  },
	  location: {},
	  history: {},
	  CustomEvent: function CustomEvent() {
	    return this;
	  },
	  addEventListener: function addEventListener() {},
	  removeEventListener: function removeEventListener() {},
	  getComputedStyle: function getComputedStyle() {
	    return {
	      getPropertyValue: function getPropertyValue() {
	        return '';
	      },
	    };
	  },
	  Image: function Image() {},
	  Date: function Date() {},
	  screen: {},
	  setTimeout: function setTimeout() {},
	  clearTimeout: function clearTimeout() {},
	} : window; // eslint-disable-line

	/**
	 * Dom7 2.1.3
	 * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
	 * http://framework7.io/docs/dom.html
	 *
	 * Copyright 2019, Vladimir Kharlampidi
	 * The iDangero.us
	 * http://www.idangero.us/
	 *
	 * Licensed under MIT
	 *
	 * Released on: February 11, 2019
	 */

	class Dom7 {
	  constructor(arr) {
	    const self = this;
	    // Create array-like object
	    for (let i = 0; i < arr.length; i += 1) {
	      self[i] = arr[i];
	    }
	    self.length = arr.length;
	    // Return collection with methods
	    return this;
	  }
	}

	function $(selector, context) {
	  const arr = [];
	  let i = 0;
	  if (selector && !context) {
	    if (selector instanceof Dom7) {
	      return selector;
	    }
	  }
	  if (selector) {
	      // String
	    if (typeof selector === 'string') {
	      let els;
	      let tempParent;
	      const html = selector.trim();
	      if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
	        let toCreate = 'div';
	        if (html.indexOf('<li') === 0) toCreate = 'ul';
	        if (html.indexOf('<tr') === 0) toCreate = 'tbody';
	        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
	        if (html.indexOf('<tbody') === 0) toCreate = 'table';
	        if (html.indexOf('<option') === 0) toCreate = 'select';
	        tempParent = doc.createElement(toCreate);
	        tempParent.innerHTML = html;
	        for (i = 0; i < tempParent.childNodes.length; i += 1) {
	          arr.push(tempParent.childNodes[i]);
	        }
	      } else {
	        if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
	          // Pure ID selector
	          els = [doc.getElementById(selector.trim().split('#')[1])];
	        } else {
	          // Other selectors
	          els = (context || doc).querySelectorAll(selector.trim());
	        }
	        for (i = 0; i < els.length; i += 1) {
	          if (els[i]) arr.push(els[i]);
	        }
	      }
	    } else if (selector.nodeType || selector === win || selector === doc) {
	      // Node/element
	      arr.push(selector);
	    } else if (selector.length > 0 && selector[0].nodeType) {
	      // Array of elements or instance of Dom
	      for (i = 0; i < selector.length; i += 1) {
	        arr.push(selector[i]);
	      }
	    }
	  }
	  return new Dom7(arr);
	}

	$.fn = Dom7.prototype;
	$.Class = Dom7;
	$.Dom7 = Dom7;

	function unique(arr) {
	  const uniqueArray = [];
	  for (let i = 0; i < arr.length; i += 1) {
	    if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
	  }
	  return uniqueArray;
	}

	// Classes and attributes
	function addClass(className) {
	  if (typeof className === 'undefined') {
	    return this;
	  }
	  const classes = className.split(' ');
	  for (let i = 0; i < classes.length; i += 1) {
	    for (let j = 0; j < this.length; j += 1) {
	      if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
	    }
	  }
	  return this;
	}
	function removeClass(className) {
	  const classes = className.split(' ');
	  for (let i = 0; i < classes.length; i += 1) {
	    for (let j = 0; j < this.length; j += 1) {
	      if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
	    }
	  }
	  return this;
	}
	function hasClass(className) {
	  if (!this[0]) return false;
	  return this[0].classList.contains(className);
	}
	function toggleClass(className) {
	  const classes = className.split(' ');
	  for (let i = 0; i < classes.length; i += 1) {
	    for (let j = 0; j < this.length; j += 1) {
	      if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
	    }
	  }
	  return this;
	}
	function attr(attrs, value) {
	  if (arguments.length === 1 && typeof attrs === 'string') {
	    // Get attr
	    if (this[0]) return this[0].getAttribute(attrs);
	    return undefined;
	  }

	  // Set attrs
	  for (let i = 0; i < this.length; i += 1) {
	    if (arguments.length === 2) {
	      // String
	      this[i].setAttribute(attrs, value);
	    } else {
	      // Object
	      // eslint-disable-next-line
	      for (const attrName in attrs) {
	        this[i][attrName] = attrs[attrName];
	        this[i].setAttribute(attrName, attrs[attrName]);
	      }
	    }
	  }
	  return this;
	}
	// eslint-disable-next-line
	function removeAttr(attr) {
	  for (let i = 0; i < this.length; i += 1) {
	    this[i].removeAttribute(attr);
	  }
	  return this;
	}
	function data(key, value) {
	  let el;
	  if (typeof value === 'undefined') {
	    el = this[0];
	    // Get value
	    if (el) {
	      if (el.dom7ElementDataStorage && (key in el.dom7ElementDataStorage)) {
	        return el.dom7ElementDataStorage[key];
	      }

	      const dataKey = el.getAttribute(`data-${key}`);
	      if (dataKey) {
	        return dataKey;
	      }
	      return undefined;
	    }
	    return undefined;
	  }

	  // Set value
	  for (let i = 0; i < this.length; i += 1) {
	    el = this[i];
	    if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
	    el.dom7ElementDataStorage[key] = value;
	  }
	  return this;
	}
	// Transforms
	// eslint-disable-next-line
	function transform(transform) {
	  for (let i = 0; i < this.length; i += 1) {
	    const elStyle = this[i].style;
	    elStyle.webkitTransform = transform;
	    elStyle.transform = transform;
	  }
	  return this;
	}
	function transition(duration) {
	  if (typeof duration !== 'string') {
	    duration = `${duration}ms`; // eslint-disable-line
	  }
	  for (let i = 0; i < this.length; i += 1) {
	    const elStyle = this[i].style;
	    elStyle.webkitTransitionDuration = duration;
	    elStyle.transitionDuration = duration;
	  }
	  return this;
	}
	// Events
	function on(...args) {
	  let [eventType, targetSelector, listener, capture] = args;
	  if (typeof args[1] === 'function') {
	    [eventType, listener, capture] = args;
	    targetSelector = undefined;
	  }
	  if (!capture) capture = false;

	  function handleLiveEvent(e) {
	    const target = e.target;
	    if (!target) return;
	    const eventData = e.target.dom7EventData || [];
	    if (eventData.indexOf(e) < 0) {
	      eventData.unshift(e);
	    }
	    if ($(target).is(targetSelector)) listener.apply(target, eventData);
	    else {
	      const parents = $(target).parents(); // eslint-disable-line
	      for (let k = 0; k < parents.length; k += 1) {
	        if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
	      }
	    }
	  }
	  function handleEvent(e) {
	    const eventData = e && e.target ? e.target.dom7EventData || [] : [];
	    if (eventData.indexOf(e) < 0) {
	      eventData.unshift(e);
	    }
	    listener.apply(this, eventData);
	  }
	  const events = eventType.split(' ');
	  let j;
	  for (let i = 0; i < this.length; i += 1) {
	    const el = this[i];
	    if (!targetSelector) {
	      for (j = 0; j < events.length; j += 1) {
	        const event = events[j];
	        if (!el.dom7Listeners) el.dom7Listeners = {};
	        if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
	        el.dom7Listeners[event].push({
	          listener,
	          proxyListener: handleEvent,
	        });
	        el.addEventListener(event, handleEvent, capture);
	      }
	    } else {
	      // Live events
	      for (j = 0; j < events.length; j += 1) {
	        const event = events[j];
	        if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
	        if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
	        el.dom7LiveListeners[event].push({
	          listener,
	          proxyListener: handleLiveEvent,
	        });
	        el.addEventListener(event, handleLiveEvent, capture);
	      }
	    }
	  }
	  return this;
	}
	function off(...args) {
	  let [eventType, targetSelector, listener, capture] = args;
	  if (typeof args[1] === 'function') {
	    [eventType, listener, capture] = args;
	    targetSelector = undefined;
	  }
	  if (!capture) capture = false;

	  const events = eventType.split(' ');
	  for (let i = 0; i < events.length; i += 1) {
	    const event = events[i];
	    for (let j = 0; j < this.length; j += 1) {
	      const el = this[j];
	      let handlers;
	      if (!targetSelector && el.dom7Listeners) {
	        handlers = el.dom7Listeners[event];
	      } else if (targetSelector && el.dom7LiveListeners) {
	        handlers = el.dom7LiveListeners[event];
	      }
	      if (handlers && handlers.length) {
	        for (let k = handlers.length - 1; k >= 0; k -= 1) {
	          const handler = handlers[k];
	          if (listener && handler.listener === listener) {
	            el.removeEventListener(event, handler.proxyListener, capture);
	            handlers.splice(k, 1);
	          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
	            el.removeEventListener(event, handler.proxyListener, capture);
	            handlers.splice(k, 1);
	          } else if (!listener) {
	            el.removeEventListener(event, handler.proxyListener, capture);
	            handlers.splice(k, 1);
	          }
	        }
	      }
	    }
	  }
	  return this;
	}
	function trigger(...args) {
	  const events = args[0].split(' ');
	  const eventData = args[1];
	  for (let i = 0; i < events.length; i += 1) {
	    const event = events[i];
	    for (let j = 0; j < this.length; j += 1) {
	      const el = this[j];
	      let evt;
	      try {
	        evt = new win.CustomEvent(event, {
	          detail: eventData,
	          bubbles: true,
	          cancelable: true,
	        });
	      } catch (e) {
	        evt = doc.createEvent('Event');
	        evt.initEvent(event, true, true);
	        evt.detail = eventData;
	      }
	      // eslint-disable-next-line
	      el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
	      el.dispatchEvent(evt);
	      el.dom7EventData = [];
	      delete el.dom7EventData;
	    }
	  }
	  return this;
	}
	function transitionEnd(callback) {
	  const events = ['webkitTransitionEnd', 'transitionend'];
	  const dom = this;
	  let i;
	  function fireCallBack(e) {
	    /* jshint validthis:true */
	    if (e.target !== this) return;
	    callback.call(this, e);
	    for (i = 0; i < events.length; i += 1) {
	      dom.off(events[i], fireCallBack);
	    }
	  }
	  if (callback) {
	    for (i = 0; i < events.length; i += 1) {
	      dom.on(events[i], fireCallBack);
	    }
	  }
	  return this;
	}
	function outerWidth(includeMargins) {
	  if (this.length > 0) {
	    if (includeMargins) {
	      // eslint-disable-next-line
	      const styles = this.styles();
	      return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
	    }
	    return this[0].offsetWidth;
	  }
	  return null;
	}
	function outerHeight(includeMargins) {
	  if (this.length > 0) {
	    if (includeMargins) {
	      // eslint-disable-next-line
	      const styles = this.styles();
	      return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
	    }
	    return this[0].offsetHeight;
	  }
	  return null;
	}
	function offset() {
	  if (this.length > 0) {
	    const el = this[0];
	    const box = el.getBoundingClientRect();
	    const body = doc.body;
	    const clientTop = el.clientTop || body.clientTop || 0;
	    const clientLeft = el.clientLeft || body.clientLeft || 0;
	    const scrollTop = el === win ? win.scrollY : el.scrollTop;
	    const scrollLeft = el === win ? win.scrollX : el.scrollLeft;
	    return {
	      top: (box.top + scrollTop) - clientTop,
	      left: (box.left + scrollLeft) - clientLeft,
	    };
	  }

	  return null;
	}
	function styles() {
	  if (this[0]) return win.getComputedStyle(this[0], null);
	  return {};
	}
	function css(props, value) {
	  let i;
	  if (arguments.length === 1) {
	    if (typeof props === 'string') {
	      if (this[0]) return win.getComputedStyle(this[0], null).getPropertyValue(props);
	    } else {
	      for (i = 0; i < this.length; i += 1) {
	        // eslint-disable-next-line
	        for (let prop in props) {
	          this[i].style[prop] = props[prop];
	        }
	      }
	      return this;
	    }
	  }
	  if (arguments.length === 2 && typeof props === 'string') {
	    for (i = 0; i < this.length; i += 1) {
	      this[i].style[props] = value;
	    }
	    return this;
	  }
	  return this;
	}
	// Iterate over the collection passing elements to `callback`
	function each(callback) {
	  // Don't bother continuing without a callback
	  if (!callback) return this;
	  // Iterate over the current collection
	  for (let i = 0; i < this.length; i += 1) {
	    // If the callback returns false
	    if (callback.call(this[i], i, this[i]) === false) {
	      // End the loop early
	      return this;
	    }
	  }
	  // Return `this` to allow chained DOM operations
	  return this;
	}
	function filter(callback) {
	  const matchedItems = [];
	  const dom = this;
	  for (let i = 0; i < dom.length; i += 1) {
	    if (callback.call(dom[i], i, dom[i])) matchedItems.push(dom[i]);
	  }
	  return new Dom7(matchedItems);
	}
	// eslint-disable-next-line
	function html(html) {
	  if (typeof html === 'undefined') {
	    return this[0] ? this[0].innerHTML : undefined;
	  }

	  for (let i = 0; i < this.length; i += 1) {
	    this[i].innerHTML = html;
	  }
	  return this;
	}
	// eslint-disable-next-line
	function text(text) {
	  if (typeof text === 'undefined') {
	    if (this[0]) {
	      return this[0].textContent.trim();
	    }
	    return null;
	  }

	  for (let i = 0; i < this.length; i += 1) {
	    this[i].textContent = text;
	  }
	  return this;
	}
	function is(selector) {
	  const el = this[0];
	  let compareWith;
	  let i;
	  if (!el || typeof selector === 'undefined') return false;
	  if (typeof selector === 'string') {
	    if (el.matches) return el.matches(selector);
	    else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
	    else if (el.msMatchesSelector) return el.msMatchesSelector(selector);

	    compareWith = $(selector);
	    for (i = 0; i < compareWith.length; i += 1) {
	      if (compareWith[i] === el) return true;
	    }
	    return false;
	  } else if (selector === doc) return el === doc;
	  else if (selector === win) return el === win;

	  if (selector.nodeType || selector instanceof Dom7) {
	    compareWith = selector.nodeType ? [selector] : selector;
	    for (i = 0; i < compareWith.length; i += 1) {
	      if (compareWith[i] === el) return true;
	    }
	    return false;
	  }
	  return false;
	}
	function index() {
	  let child = this[0];
	  let i;
	  if (child) {
	    i = 0;
	    // eslint-disable-next-line
	    while ((child = child.previousSibling) !== null) {
	      if (child.nodeType === 1) i += 1;
	    }
	    return i;
	  }
	  return undefined;
	}
	// eslint-disable-next-line
	function eq(index) {
	  if (typeof index === 'undefined') return this;
	  const length = this.length;
	  let returnIndex;
	  if (index > length - 1) {
	    return new Dom7([]);
	  }
	  if (index < 0) {
	    returnIndex = length + index;
	    if (returnIndex < 0) return new Dom7([]);
	    return new Dom7([this[returnIndex]]);
	  }
	  return new Dom7([this[index]]);
	}
	function append(...args) {
	  let newChild;

	  for (let k = 0; k < args.length; k += 1) {
	    newChild = args[k];
	    for (let i = 0; i < this.length; i += 1) {
	      if (typeof newChild === 'string') {
	        const tempDiv = doc.createElement('div');
	        tempDiv.innerHTML = newChild;
	        while (tempDiv.firstChild) {
	          this[i].appendChild(tempDiv.firstChild);
	        }
	      } else if (newChild instanceof Dom7) {
	        for (let j = 0; j < newChild.length; j += 1) {
	          this[i].appendChild(newChild[j]);
	        }
	      } else {
	        this[i].appendChild(newChild);
	      }
	    }
	  }

	  return this;
	}
	function prepend(newChild) {
	  let i;
	  let j;
	  for (i = 0; i < this.length; i += 1) {
	    if (typeof newChild === 'string') {
	      const tempDiv = doc.createElement('div');
	      tempDiv.innerHTML = newChild;
	      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
	        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
	      }
	    } else if (newChild instanceof Dom7) {
	      for (j = 0; j < newChild.length; j += 1) {
	        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
	      }
	    } else {
	      this[i].insertBefore(newChild, this[i].childNodes[0]);
	    }
	  }
	  return this;
	}
	function next(selector) {
	  if (this.length > 0) {
	    if (selector) {
	      if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
	        return new Dom7([this[0].nextElementSibling]);
	      }
	      return new Dom7([]);
	    }

	    if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
	    return new Dom7([]);
	  }
	  return new Dom7([]);
	}
	function nextAll(selector) {
	  const nextEls = [];
	  let el = this[0];
	  if (!el) return new Dom7([]);
	  while (el.nextElementSibling) {
	    const next = el.nextElementSibling; // eslint-disable-line
	    if (selector) {
	      if ($(next).is(selector)) nextEls.push(next);
	    } else nextEls.push(next);
	    el = next;
	  }
	  return new Dom7(nextEls);
	}
	function prev(selector) {
	  if (this.length > 0) {
	    const el = this[0];
	    if (selector) {
	      if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
	        return new Dom7([el.previousElementSibling]);
	      }
	      return new Dom7([]);
	    }

	    if (el.previousElementSibling) return new Dom7([el.previousElementSibling]);
	    return new Dom7([]);
	  }
	  return new Dom7([]);
	}
	function prevAll(selector) {
	  const prevEls = [];
	  let el = this[0];
	  if (!el) return new Dom7([]);
	  while (el.previousElementSibling) {
	    const prev = el.previousElementSibling; // eslint-disable-line
	    if (selector) {
	      if ($(prev).is(selector)) prevEls.push(prev);
	    } else prevEls.push(prev);
	    el = prev;
	  }
	  return new Dom7(prevEls);
	}
	function parent(selector) {
	  const parents = []; // eslint-disable-line
	  for (let i = 0; i < this.length; i += 1) {
	    if (this[i].parentNode !== null) {
	      if (selector) {
	        if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
	      } else {
	        parents.push(this[i].parentNode);
	      }
	    }
	  }
	  return $(unique(parents));
	}
	function parents(selector) {
	  const parents = []; // eslint-disable-line
	  for (let i = 0; i < this.length; i += 1) {
	    let parent = this[i].parentNode; // eslint-disable-line
	    while (parent) {
	      if (selector) {
	        if ($(parent).is(selector)) parents.push(parent);
	      } else {
	        parents.push(parent);
	      }
	      parent = parent.parentNode;
	    }
	  }
	  return $(unique(parents));
	}
	function closest(selector) {
	  let closest = this; // eslint-disable-line
	  if (typeof selector === 'undefined') {
	    return new Dom7([]);
	  }
	  if (!closest.is(selector)) {
	    closest = closest.parents(selector).eq(0);
	  }
	  return closest;
	}
	function find(selector) {
	  const foundElements = [];
	  for (let i = 0; i < this.length; i += 1) {
	    const found = this[i].querySelectorAll(selector);
	    for (let j = 0; j < found.length; j += 1) {
	      foundElements.push(found[j]);
	    }
	  }
	  return new Dom7(foundElements);
	}
	function children(selector) {
	  const children = []; // eslint-disable-line
	  for (let i = 0; i < this.length; i += 1) {
	    const childNodes = this[i].childNodes;

	    for (let j = 0; j < childNodes.length; j += 1) {
	      if (!selector) {
	        if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
	      } else if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) {
	        children.push(childNodes[j]);
	      }
	    }
	  }
	  return new Dom7(unique(children));
	}
	function remove() {
	  for (let i = 0; i < this.length; i += 1) {
	    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
	  }
	  return this;
	}
	function add(...args) {
	  const dom = this;
	  let i;
	  let j;
	  for (i = 0; i < args.length; i += 1) {
	    const toAdd = $(args[i]);
	    for (j = 0; j < toAdd.length; j += 1) {
	      dom[dom.length] = toAdd[j];
	      dom.length += 1;
	    }
	  }
	  return dom;
	}

	/**
	 * Swiper 5.2.1
	 * Most modern mobile touch slider and framework with hardware accelerated transitions
	 * http://swiperjs.com
	 *
	 * Copyright 2014-2019 Vladimir Kharlampidi
	 *
	 * Released under the MIT License
	 *
	 * Released on: November 16, 2019
	 */

	const Methods = {
	  addClass,
	  removeClass,
	  hasClass,
	  toggleClass,
	  attr,
	  removeAttr,
	  data,
	  transform,
	  transition: transition,
	  on,
	  off,
	  trigger,
	  transitionEnd: transitionEnd,
	  outerWidth,
	  outerHeight,
	  offset,
	  css,
	  each,
	  html,
	  text,
	  is,
	  index,
	  eq,
	  append,
	  prepend,
	  next,
	  nextAll,
	  prev,
	  prevAll,
	  parent,
	  parents,
	  closest,
	  find,
	  children,
	  filter,
	  remove,
	  add,
	  styles,
	};

	Object.keys(Methods).forEach((methodName) => {
	  $.fn[methodName] = $.fn[methodName] || Methods[methodName];
	});

	const Utils = {
	  deleteProps(obj) {
	    const object = obj;
	    Object.keys(object).forEach((key) => {
	      try {
	        object[key] = null;
	      } catch (e) {
	        // no getter for object
	      }
	      try {
	        delete object[key];
	      } catch (e) {
	        // something got wrong
	      }
	    });
	  },
	  nextTick(callback, delay = 0) {
	    return setTimeout(callback, delay);
	  },
	  now() {
	    return Date.now();
	  },
	  getTranslate(el, axis = 'x') {
	    let matrix;
	    let curTransform;
	    let transformMatrix;

	    const curStyle = win.getComputedStyle(el, null);

	    if (win.WebKitCSSMatrix) {
	      curTransform = curStyle.transform || curStyle.webkitTransform;
	      if (curTransform.split(',').length > 6) {
	        curTransform = curTransform.split(', ').map((a) => a.replace(',', '.')).join(', ');
	      }
	      // Some old versions of Webkit choke when 'none' is passed; pass
	      // empty string instead in this case
	      transformMatrix = new win.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
	    } else {
	      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
	      matrix = transformMatrix.toString().split(',');
	    }

	    if (axis === 'x') {
	      // Latest Chrome and webkits Fix
	      if (win.WebKitCSSMatrix) curTransform = transformMatrix.m41;
	      // Crazy IE10 Matrix
	      else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
	      // Normal Browsers
	      else curTransform = parseFloat(matrix[4]);
	    }
	    if (axis === 'y') {
	      // Latest Chrome and webkits Fix
	      if (win.WebKitCSSMatrix) curTransform = transformMatrix.m42;
	      // Crazy IE10 Matrix
	      else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
	      // Normal Browsers
	      else curTransform = parseFloat(matrix[5]);
	    }
	    return curTransform || 0;
	  },
	  parseUrlQuery(url) {
	    const query = {};
	    let urlToParse = url || win.location.href;
	    let i;
	    let params;
	    let param;
	    let length;
	    if (typeof urlToParse === 'string' && urlToParse.length) {
	      urlToParse = urlToParse.indexOf('?') > -1 ? urlToParse.replace(/\S*\?/, '') : '';
	      params = urlToParse.split('&').filter((paramsPart) => paramsPart !== '');
	      length = params.length;

	      for (i = 0; i < length; i += 1) {
	        param = params[i].replace(/#\S+/g, '').split('=');
	        query[decodeURIComponent(param[0])] = typeof param[1] === 'undefined' ? undefined : decodeURIComponent(param[1]) || '';
	      }
	    }
	    return query;
	  },
	  isObject(o) {
	    return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
	  },
	  extend(...args) {
	    const to = Object(args[0]);
	    for (let i = 1; i < args.length; i += 1) {
	      const nextSource = args[i];
	      if (nextSource !== undefined && nextSource !== null) {
	        const keysArray = Object.keys(Object(nextSource));
	        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
	          const nextKey = keysArray[nextIndex];
	          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	          if (desc !== undefined && desc.enumerable) {
	            if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
	              Utils.extend(to[nextKey], nextSource[nextKey]);
	            } else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
	              to[nextKey] = {};
	              Utils.extend(to[nextKey], nextSource[nextKey]);
	            } else {
	              to[nextKey] = nextSource[nextKey];
	            }
	          }
	        }
	      }
	    }
	    return to;
	  },
	};

	const Support = (function Support() {
	  return {
	    touch: (win.Modernizr && win.Modernizr.touch === true) || (function checkTouch() {
	      return !!((win.navigator.maxTouchPoints > 0) || ('ontouchstart' in win) || (win.DocumentTouch && doc instanceof win.DocumentTouch));
	    }()),

	    pointerEvents: !!win.PointerEvent && ('maxTouchPoints' in win.navigator) && win.navigator.maxTouchPoints > 0,

	    observer: (function checkObserver() {
	      return ('MutationObserver' in win || 'WebkitMutationObserver' in win);
	    }()),

	    passiveListener: (function checkPassiveListener() {
	      let supportsPassive = false;
	      try {
	        const opts = Object.defineProperty({}, 'passive', {
	          // eslint-disable-next-line
	          get() {
	            supportsPassive = true;
	          },
	        });
	        win.addEventListener('testPassiveListener', null, opts);
	      } catch (e) {
	        // No support
	      }
	      return supportsPassive;
	    }()),

	    gestures: (function checkGestures() {
	      return 'ongesturestart' in win;
	    }()),
	  };
	}());

	class SwiperClass {
	  constructor(params = {}) {
	    const self = this;
	    self.params = params;

	    // Events
	    self.eventsListeners = {};

	    if (self.params && self.params.on) {
	      Object.keys(self.params.on).forEach((eventName) => {
	        self.on(eventName, self.params.on[eventName]);
	      });
	    }
	  }

	  on(events, handler, priority) {
	    const self = this;
	    if (typeof handler !== 'function') return self;
	    const method = priority ? 'unshift' : 'push';
	    events.split(' ').forEach((event) => {
	      if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
	      self.eventsListeners[event][method](handler);
	    });
	    return self;
	  }

	  once(events, handler, priority) {
	    const self = this;
	    if (typeof handler !== 'function') return self;
	    function onceHandler(...args) {
	      self.off(events, onceHandler);
	      if (onceHandler.f7proxy) {
	        delete onceHandler.f7proxy;
	      }
	      handler.apply(self, args);
	    }
	    onceHandler.f7proxy = handler;
	    return self.on(events, onceHandler, priority);
	  }

	  off(events, handler) {
	    const self = this;
	    if (!self.eventsListeners) return self;
	    events.split(' ').forEach((event) => {
	      if (typeof handler === 'undefined') {
	        self.eventsListeners[event] = [];
	      } else if (self.eventsListeners[event] && self.eventsListeners[event].length) {
	        self.eventsListeners[event].forEach((eventHandler, index) => {
	          if (eventHandler === handler || (eventHandler.f7proxy && eventHandler.f7proxy === handler)) {
	            self.eventsListeners[event].splice(index, 1);
	          }
	        });
	      }
	    });
	    return self;
	  }

	  emit(...args) {
	    const self = this;
	    if (!self.eventsListeners) return self;
	    let events;
	    let data;
	    let context;
	    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
	      events = args[0];
	      data = args.slice(1, args.length);
	      context = self;
	    } else {
	      events = args[0].events;
	      data = args[0].data;
	      context = args[0].context || self;
	    }
	    const eventsArray = Array.isArray(events) ? events : events.split(' ');
	    eventsArray.forEach((event) => {
	      if (self.eventsListeners && self.eventsListeners[event]) {
	        const handlers = [];
	        self.eventsListeners[event].forEach((eventHandler) => {
	          handlers.push(eventHandler);
	        });
	        handlers.forEach((eventHandler) => {
	          eventHandler.apply(context, data);
	        });
	      }
	    });
	    return self;
	  }

	  useModulesParams(instanceParams) {
	    const instance = this;
	    if (!instance.modules) return;
	    Object.keys(instance.modules).forEach((moduleName) => {
	      const module = instance.modules[moduleName];
	      // Extend params
	      if (module.params) {
	        Utils.extend(instanceParams, module.params);
	      }
	    });
	  }

	  useModules(modulesParams = {}) {
	    const instance = this;
	    if (!instance.modules) return;
	    Object.keys(instance.modules).forEach((moduleName) => {
	      const module = instance.modules[moduleName];
	      const moduleParams = modulesParams[moduleName] || {};
	      // Extend instance methods and props
	      if (module.instance) {
	        Object.keys(module.instance).forEach((modulePropName) => {
	          const moduleProp = module.instance[modulePropName];
	          if (typeof moduleProp === 'function') {
	            instance[modulePropName] = moduleProp.bind(instance);
	          } else {
	            instance[modulePropName] = moduleProp;
	          }
	        });
	      }
	      // Add event listeners
	      if (module.on && instance.on) {
	        Object.keys(module.on).forEach((moduleEventName) => {
	          instance.on(moduleEventName, module.on[moduleEventName]);
	        });
	      }

	      // Module create callback
	      if (module.create) {
	        module.create.bind(instance)(moduleParams);
	      }
	    });
	  }

	  static set components(components) {
	    const Class = this;
	    if (!Class.use) return;
	    Class.use(components);
	  }

	  static installModule(module, ...params) {
	    const Class = this;
	    if (!Class.prototype.modules) Class.prototype.modules = {};
	    const name = module.name || (`${Object.keys(Class.prototype.modules).length}_${Utils.now()}`);
	    Class.prototype.modules[name] = module;
	    // Prototype
	    if (module.proto) {
	      Object.keys(module.proto).forEach((key) => {
	        Class.prototype[key] = module.proto[key];
	      });
	    }
	    // Class
	    if (module.static) {
	      Object.keys(module.static).forEach((key) => {
	        Class[key] = module.static[key];
	      });
	    }
	    // Callback
	    if (module.install) {
	      module.install.apply(Class, params);
	    }
	    return Class;
	  }

	  static use(module, ...params) {
	    const Class = this;
	    if (Array.isArray(module)) {
	      module.forEach((m) => Class.installModule(m));
	      return Class;
	    }
	    return Class.installModule(module, ...params);
	  }
	}

	function updateSize () {
	  const swiper = this;
	  let width;
	  let height;
	  const $el = swiper.$el;
	  if (typeof swiper.params.width !== 'undefined') {
	    width = swiper.params.width;
	  } else {
	    width = $el[0].clientWidth;
	  }
	  if (typeof swiper.params.height !== 'undefined') {
	    height = swiper.params.height;
	  } else {
	    height = $el[0].clientHeight;
	  }
	  if ((width === 0 && swiper.isHorizontal()) || (height === 0 && swiper.isVertical())) {
	    return;
	  }

	  // Subtract paddings
	  width = width - parseInt($el.css('padding-left'), 10) - parseInt($el.css('padding-right'), 10);
	  height = height - parseInt($el.css('padding-top'), 10) - parseInt($el.css('padding-bottom'), 10);

	  Utils.extend(swiper, {
	    width,
	    height,
	    size: swiper.isHorizontal() ? width : height,
	  });
	}

	function updateSlides () {
	  const swiper = this;
	  const params = swiper.params;

	  const {
	    $wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL,
	  } = swiper;
	  const isVirtual = swiper.virtual && params.virtual.enabled;
	  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
	  const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
	  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
	  let snapGrid = [];
	  const slidesGrid = [];
	  const slidesSizesGrid = [];

	  function slidesForMargin(slideIndex) {
	    if (!params.cssMode) return true;
	    if (slideIndex === slides.length - 1) {
	      return false;
	    }
	    return true;
	  }

	  let offsetBefore = params.slidesOffsetBefore;
	  if (typeof offsetBefore === 'function') {
	    offsetBefore = params.slidesOffsetBefore.call(swiper);
	  }

	  let offsetAfter = params.slidesOffsetAfter;
	  if (typeof offsetAfter === 'function') {
	    offsetAfter = params.slidesOffsetAfter.call(swiper);
	  }

	  const previousSnapGridLength = swiper.snapGrid.length;
	  const previousSlidesGridLength = swiper.snapGrid.length;

	  let spaceBetween = params.spaceBetween;
	  let slidePosition = -offsetBefore;
	  let prevSlideSize = 0;
	  let index = 0;
	  if (typeof swiperSize === 'undefined') {
	    return;
	  }
	  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
	    spaceBetween = (parseFloat(spaceBetween.replace('%', '')) / 100) * swiperSize;
	  }

	  swiper.virtualSize = -spaceBetween;

	  // reset margins
	  if (rtl) slides.css({ marginLeft: '', marginTop: '' });
	  else slides.css({ marginRight: '', marginBottom: '' });

	  let slidesNumberEvenToRows;
	  if (params.slidesPerColumn > 1) {
	    if (Math.floor(slidesLength / params.slidesPerColumn) === slidesLength / swiper.params.slidesPerColumn) {
	      slidesNumberEvenToRows = slidesLength;
	    } else {
	      slidesNumberEvenToRows = Math.ceil(slidesLength / params.slidesPerColumn) * params.slidesPerColumn;
	    }
	    if (params.slidesPerView !== 'auto' && params.slidesPerColumnFill === 'row') {
	      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, params.slidesPerView * params.slidesPerColumn);
	    }
	  }

	  // Calc slides
	  let slideSize;
	  const slidesPerColumn = params.slidesPerColumn;
	  const slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
	  const numFullColumns = Math.floor(slidesLength / params.slidesPerColumn);
	  for (let i = 0; i < slidesLength; i += 1) {
	    slideSize = 0;
	    const slide = slides.eq(i);
	    if (params.slidesPerColumn > 1) {
	      // Set slides order
	      let newSlideOrderIndex;
	      let column;
	      let row;
	      if (params.slidesPerColumnFill === 'row' && params.slidesPerGroup > 1) {
	        const groupIndex = Math.floor(i / (params.slidesPerGroup * params.slidesPerColumn));
	        const slideIndexInGroup = i - params.slidesPerColumn * params.slidesPerGroup * groupIndex;
	        const columnsInGroup = groupIndex === 0
	          ? params.slidesPerGroup
	          : Math.min(Math.ceil((slidesLength - groupIndex * slidesPerColumn * params.slidesPerGroup) / slidesPerColumn), params.slidesPerGroup);
	        row = Math.floor(slideIndexInGroup / columnsInGroup);
	        column = (slideIndexInGroup - row * columnsInGroup) + groupIndex * params.slidesPerGroup;

	        newSlideOrderIndex = column + ((row * slidesNumberEvenToRows) / slidesPerColumn);
	        slide
	          .css({
	            '-webkit-box-ordinal-group': newSlideOrderIndex,
	            '-moz-box-ordinal-group': newSlideOrderIndex,
	            '-ms-flex-order': newSlideOrderIndex,
	            '-webkit-order': newSlideOrderIndex,
	            order: newSlideOrderIndex,
	          });
	      } else if (params.slidesPerColumnFill === 'column') {
	        column = Math.floor(i / slidesPerColumn);
	        row = i - (column * slidesPerColumn);
	        if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn - 1)) {
	          row += 1;
	          if (row >= slidesPerColumn) {
	            row = 0;
	            column += 1;
	          }
	        }
	      } else {
	        row = Math.floor(i / slidesPerRow);
	        column = i - (row * slidesPerRow);
	      }
	      slide.css(
	        `margin-${swiper.isHorizontal() ? 'top' : 'left'}`,
	        (row !== 0 && params.spaceBetween) && (`${params.spaceBetween}px`)
	      );
	    }
	    if (slide.css('display') === 'none') continue; // eslint-disable-line

	    if (params.slidesPerView === 'auto') {
	      const slideStyles = win.getComputedStyle(slide[0], null);
	      const currentTransform = slide[0].style.transform;
	      const currentWebKitTransform = slide[0].style.webkitTransform;
	      if (currentTransform) {
	        slide[0].style.transform = 'none';
	      }
	      if (currentWebKitTransform) {
	        slide[0].style.webkitTransform = 'none';
	      }
	      if (params.roundLengths) {
	        slideSize = swiper.isHorizontal()
	          ? slide.outerWidth(true)
	          : slide.outerHeight(true);
	      } else {
	        // eslint-disable-next-line
	        if (swiper.isHorizontal()) {
	          const width = parseFloat(slideStyles.getPropertyValue('width'));
	          const paddingLeft = parseFloat(slideStyles.getPropertyValue('padding-left'));
	          const paddingRight = parseFloat(slideStyles.getPropertyValue('padding-right'));
	          const marginLeft = parseFloat(slideStyles.getPropertyValue('margin-left'));
	          const marginRight = parseFloat(slideStyles.getPropertyValue('margin-right'));
	          const boxSizing = slideStyles.getPropertyValue('box-sizing');
	          if (boxSizing && boxSizing === 'border-box') {
	            slideSize = width + marginLeft + marginRight;
	          } else {
	            slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight;
	          }
	        } else {
	          const height = parseFloat(slideStyles.getPropertyValue('height'));
	          const paddingTop = parseFloat(slideStyles.getPropertyValue('padding-top'));
	          const paddingBottom = parseFloat(slideStyles.getPropertyValue('padding-bottom'));
	          const marginTop = parseFloat(slideStyles.getPropertyValue('margin-top'));
	          const marginBottom = parseFloat(slideStyles.getPropertyValue('margin-bottom'));
	          const boxSizing = slideStyles.getPropertyValue('box-sizing');
	          if (boxSizing && boxSizing === 'border-box') {
	            slideSize = height + marginTop + marginBottom;
	          } else {
	            slideSize = height + paddingTop + paddingBottom + marginTop + marginBottom;
	          }
	        }
	      }
	      if (currentTransform) {
	        slide[0].style.transform = currentTransform;
	      }
	      if (currentWebKitTransform) {
	        slide[0].style.webkitTransform = currentWebKitTransform;
	      }
	      if (params.roundLengths) slideSize = Math.floor(slideSize);
	    } else {
	      slideSize = (swiperSize - ((params.slidesPerView - 1) * spaceBetween)) / params.slidesPerView;
	      if (params.roundLengths) slideSize = Math.floor(slideSize);

	      if (slides[i]) {
	        if (swiper.isHorizontal()) {
	          slides[i].style.width = `${slideSize}px`;
	        } else {
	          slides[i].style.height = `${slideSize}px`;
	        }
	      }
	    }
	    if (slides[i]) {
	      slides[i].swiperSlideSize = slideSize;
	    }
	    slidesSizesGrid.push(slideSize);


	    if (params.centeredSlides) {
	      slidePosition = slidePosition + (slideSize / 2) + (prevSlideSize / 2) + spaceBetween;
	      if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - (swiperSize / 2) - spaceBetween;
	      if (i === 0) slidePosition = slidePosition - (swiperSize / 2) - spaceBetween;
	      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
	      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
	      if ((index) % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
	      slidesGrid.push(slidePosition);
	    } else {
	      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
	      if ((index) % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
	      slidesGrid.push(slidePosition);
	      slidePosition = slidePosition + slideSize + spaceBetween;
	    }

	    swiper.virtualSize += slideSize + spaceBetween;

	    prevSlideSize = slideSize;

	    index += 1;
	  }
	  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
	  let newSlidesGrid;

	  if (
	    rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
	    $wrapperEl.css({ width: `${swiper.virtualSize + params.spaceBetween}px` });
	  }
	  if (params.setWrapperSize) {
	    if (swiper.isHorizontal()) $wrapperEl.css({ width: `${swiper.virtualSize + params.spaceBetween}px` });
	    else $wrapperEl.css({ height: `${swiper.virtualSize + params.spaceBetween}px` });
	  }

	  if (params.slidesPerColumn > 1) {
	    swiper.virtualSize = (slideSize + params.spaceBetween) * slidesNumberEvenToRows;
	    swiper.virtualSize = Math.ceil(swiper.virtualSize / params.slidesPerColumn) - params.spaceBetween;
	    if (swiper.isHorizontal()) $wrapperEl.css({ width: `${swiper.virtualSize + params.spaceBetween}px` });
	    else $wrapperEl.css({ height: `${swiper.virtualSize + params.spaceBetween}px` });
	    if (params.centeredSlides) {
	      newSlidesGrid = [];
	      for (let i = 0; i < snapGrid.length; i += 1) {
	        let slidesGridItem = snapGrid[i];
	        if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
	        if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
	      }
	      snapGrid = newSlidesGrid;
	    }
	  }

	  // Remove last grid elements depending on width
	  if (!params.centeredSlides) {
	    newSlidesGrid = [];
	    for (let i = 0; i < snapGrid.length; i += 1) {
	      let slidesGridItem = snapGrid[i];
	      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
	      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
	        newSlidesGrid.push(slidesGridItem);
	      }
	    }
	    snapGrid = newSlidesGrid;
	    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
	      snapGrid.push(swiper.virtualSize - swiperSize);
	    }
	  }
	  if (snapGrid.length === 0) snapGrid = [0];

	  if (params.spaceBetween !== 0) {
	    if (swiper.isHorizontal()) {
	      if (rtl) slides.filter(slidesForMargin).css({ marginLeft: `${spaceBetween}px` });
	      else slides.filter(slidesForMargin).css({ marginRight: `${spaceBetween}px` });
	    } else slides.filter(slidesForMargin).css({ marginBottom: `${spaceBetween}px` });
	  }

	  if (params.centeredSlides && params.centeredSlidesBounds) {
	    let allSlidesSize = 0;
	    slidesSizesGrid.forEach((slideSizeValue) => {
	      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
	    });
	    allSlidesSize -= params.spaceBetween;
	    const maxSnap = allSlidesSize - swiperSize;
	    snapGrid = snapGrid.map((snap) => {
	      if (snap < 0) return -offsetBefore;
	      if (snap > maxSnap) return maxSnap + offsetAfter;
	      return snap;
	    });
	  }

	  if (params.centerInsufficientSlides) {
	    let allSlidesSize = 0;
	    slidesSizesGrid.forEach((slideSizeValue) => {
	      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
	    });
	    allSlidesSize -= params.spaceBetween;
	    if (allSlidesSize < swiperSize) {
	      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
	      snapGrid.forEach((snap, snapIndex) => {
	        snapGrid[snapIndex] = snap - allSlidesOffset;
	      });
	      slidesGrid.forEach((snap, snapIndex) => {
	        slidesGrid[snapIndex] = snap + allSlidesOffset;
	      });
	    }
	  }

	  Utils.extend(swiper, {
	    slides,
	    snapGrid,
	    slidesGrid,
	    slidesSizesGrid,
	  });

	  if (slidesLength !== previousSlidesLength) {
	    swiper.emit('slidesLengthChange');
	  }
	  if (snapGrid.length !== previousSnapGridLength) {
	    if (swiper.params.watchOverflow) swiper.checkOverflow();
	    swiper.emit('snapGridLengthChange');
	  }
	  if (slidesGrid.length !== previousSlidesGridLength) {
	    swiper.emit('slidesGridLengthChange');
	  }

	  if (params.watchSlidesProgress || params.watchSlidesVisibility) {
	    swiper.updateSlidesOffset();
	  }
	}

	function updateAutoHeight (speed) {
	  const swiper = this;
	  const activeSlides = [];
	  let newHeight = 0;
	  let i;
	  if (typeof speed === 'number') {
	    swiper.setTransition(speed);
	  } else if (speed === true) {
	    swiper.setTransition(swiper.params.speed);
	  }
	  // Find slides currently in view
	  if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
	    for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
	      const index = swiper.activeIndex + i;
	      if (index > swiper.slides.length) break;
	      activeSlides.push(swiper.slides.eq(index)[0]);
	    }
	  } else {
	    activeSlides.push(swiper.slides.eq(swiper.activeIndex)[0]);
	  }

	  // Find new height from highest slide in view
	  for (i = 0; i < activeSlides.length; i += 1) {
	    if (typeof activeSlides[i] !== 'undefined') {
	      const height = activeSlides[i].offsetHeight;
	      newHeight = height > newHeight ? height : newHeight;
	    }
	  }

	  // Update Height
	  if (newHeight) swiper.$wrapperEl.css('height', `${newHeight}px`);
	}

	function updateSlidesOffset () {
	  const swiper = this;
	  const slides = swiper.slides;
	  for (let i = 0; i < slides.length; i += 1) {
	    slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
	  }
	}

	function updateSlidesProgress (translate = (this && this.translate) || 0) {
	  const swiper = this;
	  const params = swiper.params;

	  const { slides, rtlTranslate: rtl } = swiper;

	  if (slides.length === 0) return;
	  if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();

	  let offsetCenter = -translate;
	  if (rtl) offsetCenter = translate;

	  // Visible Slides
	  slides.removeClass(params.slideVisibleClass);

	  swiper.visibleSlidesIndexes = [];
	  swiper.visibleSlides = [];

	  for (let i = 0; i < slides.length; i += 1) {
	    const slide = slides[i];
	    const slideProgress = (
	      (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0)) - slide.swiperSlideOffset
	    ) / (slide.swiperSlideSize + params.spaceBetween);
	    if (params.watchSlidesVisibility) {
	      const slideBefore = -(offsetCenter - slide.swiperSlideOffset);
	      const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
	      const isVisible = (slideBefore >= 0 && slideBefore < swiper.size - 1)
	                || (slideAfter > 1 && slideAfter <= swiper.size)
	                || (slideBefore <= 0 && slideAfter >= swiper.size);
	      if (isVisible) {
	        swiper.visibleSlides.push(slide);
	        swiper.visibleSlidesIndexes.push(i);
	        slides.eq(i).addClass(params.slideVisibleClass);
	      }
	    }
	    slide.progress = rtl ? -slideProgress : slideProgress;
	  }
	  swiper.visibleSlides = $(swiper.visibleSlides);
	}

	function updateProgress (translate) {
	  const swiper = this;
	  if (typeof translate === 'undefined') {
	    const multiplier = swiper.rtlTranslate ? -1 : 1;
	    // eslint-disable-next-line
	    translate = (swiper && swiper.translate && (swiper.translate * multiplier)) || 0;
	  }
	  const params = swiper.params;
	  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
	  let { progress, isBeginning, isEnd } = swiper;
	  const wasBeginning = isBeginning;
	  const wasEnd = isEnd;
	  if (translatesDiff === 0) {
	    progress = 0;
	    isBeginning = true;
	    isEnd = true;
	  } else {
	    progress = (translate - swiper.minTranslate()) / (translatesDiff);
	    isBeginning = progress <= 0;
	    isEnd = progress >= 1;
	  }
	  Utils.extend(swiper, {
	    progress,
	    isBeginning,
	    isEnd,
	  });

	  if (params.watchSlidesProgress || params.watchSlidesVisibility) swiper.updateSlidesProgress(translate);

	  if (isBeginning && !wasBeginning) {
	    swiper.emit('reachBeginning toEdge');
	  }
	  if (isEnd && !wasEnd) {
	    swiper.emit('reachEnd toEdge');
	  }
	  if ((wasBeginning && !isBeginning) || (wasEnd && !isEnd)) {
	    swiper.emit('fromEdge');
	  }

	  swiper.emit('progress', progress);
	}

	function updateSlidesClasses () {
	  const swiper = this;

	  const {
	    slides, params, $wrapperEl, activeIndex, realIndex,
	  } = swiper;
	  const isVirtual = swiper.virtual && params.virtual.enabled;

	  slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);

	  let activeSlide;
	  if (isVirtual) {
	    activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
	  } else {
	    activeSlide = slides.eq(activeIndex);
	  }

	  // Active classes
	  activeSlide.addClass(params.slideActiveClass);

	  if (params.loop) {
	    // Duplicate to all looped slides
	    if (activeSlide.hasClass(params.slideDuplicateClass)) {
	      $wrapperEl
	        .children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`)
	        .addClass(params.slideDuplicateActiveClass);
	    } else {
	      $wrapperEl
	        .children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`)
	        .addClass(params.slideDuplicateActiveClass);
	    }
	  }
	  // Next Slide
	  let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
	  if (params.loop && nextSlide.length === 0) {
	    nextSlide = slides.eq(0);
	    nextSlide.addClass(params.slideNextClass);
	  }
	  // Prev Slide
	  let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
	  if (params.loop && prevSlide.length === 0) {
	    prevSlide = slides.eq(-1);
	    prevSlide.addClass(params.slidePrevClass);
	  }
	  if (params.loop) {
	    // Duplicate to all looped slides
	    if (nextSlide.hasClass(params.slideDuplicateClass)) {
	      $wrapperEl
	        .children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`)
	        .addClass(params.slideDuplicateNextClass);
	    } else {
	      $wrapperEl
	        .children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`)
	        .addClass(params.slideDuplicateNextClass);
	    }
	    if (prevSlide.hasClass(params.slideDuplicateClass)) {
	      $wrapperEl
	        .children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`)
	        .addClass(params.slideDuplicatePrevClass);
	    } else {
	      $wrapperEl
	        .children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`)
	        .addClass(params.slideDuplicatePrevClass);
	    }
	  }
	}

	function updateActiveIndex (newActiveIndex) {
	  const swiper = this;
	  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
	  const {
	    slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex,
	  } = swiper;
	  let activeIndex = newActiveIndex;
	  let snapIndex;
	  if (typeof activeIndex === 'undefined') {
	    for (let i = 0; i < slidesGrid.length; i += 1) {
	      if (typeof slidesGrid[i + 1] !== 'undefined') {
	        if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - ((slidesGrid[i + 1] - slidesGrid[i]) / 2)) {
	          activeIndex = i;
	        } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
	          activeIndex = i + 1;
	        }
	      } else if (translate >= slidesGrid[i]) {
	        activeIndex = i;
	      }
	    }
	    // Normalize slideIndex
	    if (params.normalizeSlideIndex) {
	      if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
	    }
	  }
	  if (snapGrid.indexOf(translate) >= 0) {
	    snapIndex = snapGrid.indexOf(translate);
	  } else {
	    snapIndex = Math.floor(activeIndex / params.slidesPerGroup);
	  }
	  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
	  if (activeIndex === previousIndex) {
	    if (snapIndex !== previousSnapIndex) {
	      swiper.snapIndex = snapIndex;
	      swiper.emit('snapIndexChange');
	    }
	    return;
	  }

	  // Get real index
	  const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);

	  Utils.extend(swiper, {
	    snapIndex,
	    realIndex,
	    previousIndex,
	    activeIndex,
	  });
	  swiper.emit('activeIndexChange');
	  swiper.emit('snapIndexChange');
	  if (previousRealIndex !== realIndex) {
	    swiper.emit('realIndexChange');
	  }
	  if (swiper.initialized || swiper.runCallbacksOnInit) {
	    swiper.emit('slideChange');
	  }
	}

	function updateClickedSlide (e) {
	  const swiper = this;
	  const params = swiper.params;
	  const slide = $(e.target).closest(`.${params.slideClass}`)[0];
	  let slideFound = false;
	  if (slide) {
	    for (let i = 0; i < swiper.slides.length; i += 1) {
	      if (swiper.slides[i] === slide) slideFound = true;
	    }
	  }

	  if (slide && slideFound) {
	    swiper.clickedSlide = slide;
	    if (swiper.virtual && swiper.params.virtual.enabled) {
	      swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
	    } else {
	      swiper.clickedIndex = $(slide).index();
	    }
	  } else {
	    swiper.clickedSlide = undefined;
	    swiper.clickedIndex = undefined;
	    return;
	  }
	  if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
	    swiper.slideToClickedSlide();
	  }
	}

	var update = {
	  updateSize,
	  updateSlides,
	  updateAutoHeight,
	  updateSlidesOffset,
	  updateSlidesProgress,
	  updateProgress,
	  updateSlidesClasses,
	  updateActiveIndex,
	  updateClickedSlide,
	};

	function getTranslate (axis = this.isHorizontal() ? 'x' : 'y') {
	  const swiper = this;

	  const {
	    params, rtlTranslate: rtl, translate, $wrapperEl,
	  } = swiper;

	  if (params.virtualTranslate) {
	    return rtl ? -translate : translate;
	  }
	  if (params.cssMode) {
	    return translate;
	  }

	  let currentTranslate = Utils.getTranslate($wrapperEl[0], axis);
	  if (rtl) currentTranslate = -currentTranslate;

	  return currentTranslate || 0;
	}

	function setTranslate (translate, byController) {
	  const swiper = this;
	  const {
	    rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress,
	  } = swiper;
	  let x = 0;
	  let y = 0;
	  const z = 0;

	  if (swiper.isHorizontal()) {
	    x = rtl ? -translate : translate;
	  } else {
	    y = translate;
	  }

	  if (params.roundLengths) {
	    x = Math.floor(x);
	    y = Math.floor(y);
	  }

	  if (params.cssMode) {
	    wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
	  } else if (!params.virtualTranslate) {
	    $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
	  }
	  swiper.previousTranslate = swiper.translate;
	  swiper.translate = swiper.isHorizontal() ? x : y;

	  // Check if we need to update progress
	  let newProgress;
	  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
	  if (translatesDiff === 0) {
	    newProgress = 0;
	  } else {
	    newProgress = (translate - swiper.minTranslate()) / (translatesDiff);
	  }
	  if (newProgress !== progress) {
	    swiper.updateProgress(translate);
	  }

	  swiper.emit('setTranslate', swiper.translate, byController);
	}

	function minTranslate () {
	  return (-this.snapGrid[0]);
	}

	function maxTranslate () {
	  return (-this.snapGrid[this.snapGrid.length - 1]);
	}

	function translateTo (translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
	  const swiper = this;

	  const {
	    params,
	    wrapperEl,
	  } = swiper;

	  if (swiper.animating && params.preventInteractionOnTransition) {
	    return false;
	  }

	  const minTranslate = swiper.minTranslate();
	  const maxTranslate = swiper.maxTranslate();
	  let newTranslate;
	  if (translateBounds && translate > minTranslate) newTranslate = minTranslate;
	  else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;
	  else newTranslate = translate;

	  // Update progress
	  swiper.updateProgress(newTranslate);

	  if (params.cssMode) {
	    const isH = swiper.isHorizontal();
	    if (speed === 0) {
	      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
	    } else {
	      // eslint-disable-next-line
	      if (wrapperEl.scrollTo) {
	        wrapperEl.scrollTo({
	          [isH ? 'left' : 'top']: -newTranslate,
	          behavior: 'smooth',
	        });
	      } else {
	        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
	      }
	    }
	    return true;
	  }

	  if (speed === 0) {
	    swiper.setTransition(0);
	    swiper.setTranslate(newTranslate);
	    if (runCallbacks) {
	      swiper.emit('beforeTransitionStart', speed, internal);
	      swiper.emit('transitionEnd');
	    }
	  } else {
	    swiper.setTransition(speed);
	    swiper.setTranslate(newTranslate);
	    if (runCallbacks) {
	      swiper.emit('beforeTransitionStart', speed, internal);
	      swiper.emit('transitionStart');
	    }
	    if (!swiper.animating) {
	      swiper.animating = true;
	      if (!swiper.onTranslateToWrapperTransitionEnd) {
	        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
	          if (!swiper || swiper.destroyed) return;
	          if (e.target !== this) return;
	          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
	          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
	          swiper.onTranslateToWrapperTransitionEnd = null;
	          delete swiper.onTranslateToWrapperTransitionEnd;
	          if (runCallbacks) {
	            swiper.emit('transitionEnd');
	          }
	        };
	      }
	      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
	      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
	    }
	  }

	  return true;
	}

	var translate = {
	  getTranslate,
	  setTranslate,
	  minTranslate,
	  maxTranslate,
	  translateTo,
	};

	function setTransition (duration, byController) {
	  const swiper = this;

	  if (!swiper.params.cssMode) {
	    swiper.$wrapperEl.transition(duration);
	  }

	  swiper.emit('setTransition', duration, byController);
	}

	function transitionStart (runCallbacks = true, direction) {
	  const swiper = this;
	  const { activeIndex, params, previousIndex } = swiper;
	  if (params.cssMode) return;
	  if (params.autoHeight) {
	    swiper.updateAutoHeight();
	  }

	  let dir = direction;
	  if (!dir) {
	    if (activeIndex > previousIndex) dir = 'next';
	    else if (activeIndex < previousIndex) dir = 'prev';
	    else dir = 'reset';
	  }

	  swiper.emit('transitionStart');

	  if (runCallbacks && activeIndex !== previousIndex) {
	    if (dir === 'reset') {
	      swiper.emit('slideResetTransitionStart');
	      return;
	    }
	    swiper.emit('slideChangeTransitionStart');
	    if (dir === 'next') {
	      swiper.emit('slideNextTransitionStart');
	    } else {
	      swiper.emit('slidePrevTransitionStart');
	    }
	  }
	}

	function transitionEnd$1 (runCallbacks = true, direction) {
	  const swiper = this;
	  const { activeIndex, previousIndex, params } = swiper;
	  swiper.animating = false;
	  if (params.cssMode) return;
	  swiper.setTransition(0);

	  let dir = direction;
	  if (!dir) {
	    if (activeIndex > previousIndex) dir = 'next';
	    else if (activeIndex < previousIndex) dir = 'prev';
	    else dir = 'reset';
	  }

	  swiper.emit('transitionEnd');

	  if (runCallbacks && activeIndex !== previousIndex) {
	    if (dir === 'reset') {
	      swiper.emit('slideResetTransitionEnd');
	      return;
	    }
	    swiper.emit('slideChangeTransitionEnd');
	    if (dir === 'next') {
	      swiper.emit('slideNextTransitionEnd');
	    } else {
	      swiper.emit('slidePrevTransitionEnd');
	    }
	  }
	}

	var transition$1 = {
	  setTransition,
	  transitionStart,
	  transitionEnd: transitionEnd$1,
	};

	function slideTo (index = 0, speed = this.params.speed, runCallbacks = true, internal) {
	  const swiper = this;
	  let slideIndex = index;
	  if (slideIndex < 0) slideIndex = 0;

	  const {
	    params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl,
	  } = swiper;
	  if (swiper.animating && params.preventInteractionOnTransition) {
	    return false;
	  }

	  let snapIndex = Math.floor(slideIndex / params.slidesPerGroup);
	  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

	  if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
	    swiper.emit('beforeSlideChangeStart');
	  }

	  const translate = -snapGrid[snapIndex];

	  // Update progress
	  swiper.updateProgress(translate);

	  // Normalize slideIndex
	  if (params.normalizeSlideIndex) {
	    for (let i = 0; i < slidesGrid.length; i += 1) {
	      if (-Math.floor(translate * 100) >= Math.floor(slidesGrid[i] * 100)) {
	        slideIndex = i;
	      }
	    }
	  }
	  // Directions locks
	  if (swiper.initialized && slideIndex !== activeIndex) {
	    if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
	      return false;
	    }
	    if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
	      if ((activeIndex || 0) !== slideIndex) return false;
	    }
	  }

	  let direction;
	  if (slideIndex > activeIndex) direction = 'next';
	  else if (slideIndex < activeIndex) direction = 'prev';
	  else direction = 'reset';


	  // Update Index
	  if ((rtl && -translate === swiper.translate) || (!rtl && translate === swiper.translate)) {
	    swiper.updateActiveIndex(slideIndex);
	    // Update Height
	    if (params.autoHeight) {
	      swiper.updateAutoHeight();
	    }
	    swiper.updateSlidesClasses();
	    if (params.effect !== 'slide') {
	      swiper.setTranslate(translate);
	    }
	    if (direction !== 'reset') {
	      swiper.transitionStart(runCallbacks, direction);
	      swiper.transitionEnd(runCallbacks, direction);
	    }
	    return false;
	  }
	  if (params.cssMode) {
	    const isH = swiper.isHorizontal();
	    if (speed === 0) {
	      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -translate;
	    } else {
	      // eslint-disable-next-line
	      if (wrapperEl.scrollTo) {
	        wrapperEl.scrollTo({
	          [isH ? 'left' : 'top']: -translate,
	          behavior: 'smooth',
	        });
	      } else {
	        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -translate;
	      }
	    }
	    return true;
	  }

	  if (speed === 0) {
	    swiper.setTransition(0);
	    swiper.setTranslate(translate);
	    swiper.updateActiveIndex(slideIndex);
	    swiper.updateSlidesClasses();
	    swiper.emit('beforeTransitionStart', speed, internal);
	    swiper.transitionStart(runCallbacks, direction);
	    swiper.transitionEnd(runCallbacks, direction);
	  } else {
	    swiper.setTransition(speed);
	    swiper.setTranslate(translate);
	    swiper.updateActiveIndex(slideIndex);
	    swiper.updateSlidesClasses();
	    swiper.emit('beforeTransitionStart', speed, internal);
	    swiper.transitionStart(runCallbacks, direction);
	    if (!swiper.animating) {
	      swiper.animating = true;
	      if (!swiper.onSlideToWrapperTransitionEnd) {
	        swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
	          if (!swiper || swiper.destroyed) return;
	          if (e.target !== this) return;
	          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
	          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
	          swiper.onSlideToWrapperTransitionEnd = null;
	          delete swiper.onSlideToWrapperTransitionEnd;
	          swiper.transitionEnd(runCallbacks, direction);
	        };
	      }
	      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
	      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
	    }
	  }

	  return true;
	}

	function slideToLoop (index = 0, speed = this.params.speed, runCallbacks = true, internal) {
	  const swiper = this;
	  let newIndex = index;
	  if (swiper.params.loop) {
	    newIndex += swiper.loopedSlides;
	  }

	  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
	}

	/* eslint no-unused-vars: "off" */
	function slideNext (speed = this.params.speed, runCallbacks = true, internal) {
	  const swiper = this;
	  const { params, animating } = swiper;
	  if (params.loop) {
	    if (animating) return false;
	    swiper.loopFix();
	    // eslint-disable-next-line
	    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
	    return swiper.slideTo(swiper.activeIndex + params.slidesPerGroup, speed, runCallbacks, internal);
	  }
	  return swiper.slideTo(swiper.activeIndex + params.slidesPerGroup, speed, runCallbacks, internal);
	}

	/* eslint no-unused-vars: "off" */
	function slidePrev (speed = this.params.speed, runCallbacks = true, internal) {
	  const swiper = this;
	  const {
	    params, animating, snapGrid, slidesGrid, rtlTranslate,
	  } = swiper;

	  if (params.loop) {
	    if (animating) return false;
	    swiper.loopFix();
	    // eslint-disable-next-line
	    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
	  }
	  const translate = rtlTranslate ? swiper.translate : -swiper.translate;
	  function normalize(val) {
	    if (val < 0) return -Math.floor(Math.abs(val));
	    return Math.floor(val);
	  }
	  const normalizedTranslate = normalize(translate);
	  const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
	  const normalizedSlidesGrid = slidesGrid.map((val) => normalize(val));

	  const currentSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate)];
	  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
	  if (typeof prevSnap === 'undefined' && params.cssMode) {
	    snapGrid.forEach((snap) => {
	      if (!prevSnap && normalizedTranslate >= snap) prevSnap = snap;
	    });
	  }
	  let prevIndex;
	  if (typeof prevSnap !== 'undefined') {
	    prevIndex = slidesGrid.indexOf(prevSnap);
	    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
	  }
	  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
	}

	/* eslint no-unused-vars: "off" */
	function slideReset (speed = this.params.speed, runCallbacks = true, internal) {
	  const swiper = this;
	  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
	}

	/* eslint no-unused-vars: "off" */
	function slideToClosest (speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
	  const swiper = this;
	  let index = swiper.activeIndex;
	  const snapIndex = Math.floor(index / swiper.params.slidesPerGroup);

	  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

	  if (translate >= swiper.snapGrid[snapIndex]) {
	    // The current translate is on or after the current snap index, so the choice
	    // is between the current index and the one after it.
	    const currentSnap = swiper.snapGrid[snapIndex];
	    const nextSnap = swiper.snapGrid[snapIndex + 1];
	    if ((translate - currentSnap) > (nextSnap - currentSnap) * threshold) {
	      index += swiper.params.slidesPerGroup;
	    }
	  } else {
	    // The current translate is before the current snap index, so the choice
	    // is between the current index and the one before it.
	    const prevSnap = swiper.snapGrid[snapIndex - 1];
	    const currentSnap = swiper.snapGrid[snapIndex];
	    if ((translate - prevSnap) <= (currentSnap - prevSnap) * threshold) {
	      index -= swiper.params.slidesPerGroup;
	    }
	  }
	  index = Math.max(index, 0);
	  index = Math.min(index, swiper.snapGrid.length - 1);

	  return swiper.slideTo(index, speed, runCallbacks, internal);
	}

	function slideToClickedSlide () {
	  const swiper = this;
	  const { params, $wrapperEl } = swiper;

	  const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
	  let slideToIndex = swiper.clickedIndex;
	  let realIndex;
	  if (params.loop) {
	    if (swiper.animating) return;
	    realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);
	    if (params.centeredSlides) {
	      if (
	        (slideToIndex < swiper.loopedSlides - (slidesPerView / 2))
	        || (slideToIndex > (swiper.slides.length - swiper.loopedSlides) + (slidesPerView / 2))
	      ) {
	        swiper.loopFix();
	        slideToIndex = $wrapperEl
	          .children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`)
	          .eq(0)
	          .index();

	        Utils.nextTick(() => {
	          swiper.slideTo(slideToIndex);
	        });
	      } else {
	        swiper.slideTo(slideToIndex);
	      }
	    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
	      swiper.loopFix();
	      slideToIndex = $wrapperEl
	        .children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`)
	        .eq(0)
	        .index();

	      Utils.nextTick(() => {
	        swiper.slideTo(slideToIndex);
	      });
	    } else {
	      swiper.slideTo(slideToIndex);
	    }
	  } else {
	    swiper.slideTo(slideToIndex);
	  }
	}

	var slide = {
	  slideTo,
	  slideToLoop,
	  slideNext,
	  slidePrev,
	  slideReset,
	  slideToClosest,
	  slideToClickedSlide,
	};

	function loopCreate () {
	  const swiper = this;
	  const { params, $wrapperEl } = swiper;
	  // Remove duplicated slides
	  $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();

	  let slides = $wrapperEl.children(`.${params.slideClass}`);

	  if (params.loopFillGroupWithBlank) {
	    const blankSlidesNum = params.slidesPerGroup - (slides.length % params.slidesPerGroup);
	    if (blankSlidesNum !== params.slidesPerGroup) {
	      for (let i = 0; i < blankSlidesNum; i += 1) {
	        const blankNode = $(doc.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
	        $wrapperEl.append(blankNode);
	      }
	      slides = $wrapperEl.children(`.${params.slideClass}`);
	    }
	  }

	  if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;

	  swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
	  swiper.loopedSlides += params.loopAdditionalSlides;
	  if (swiper.loopedSlides > slides.length) {
	    swiper.loopedSlides = slides.length;
	  }

	  const prependSlides = [];
	  const appendSlides = [];
	  slides.each((index, el) => {
	    const slide = $(el);
	    if (index < swiper.loopedSlides) appendSlides.push(el);
	    if (index < slides.length && index >= slides.length - swiper.loopedSlides) prependSlides.push(el);
	    slide.attr('data-swiper-slide-index', index);
	  });
	  for (let i = 0; i < appendSlides.length; i += 1) {
	    $wrapperEl.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
	  }
	  for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
	    $wrapperEl.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
	  }
	}

	function loopFix () {
	  const swiper = this;

	  swiper.emit('beforeLoopFix');

	  const {
	    activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl,
	  } = swiper;
	  let newIndex;
	  swiper.allowSlidePrev = true;
	  swiper.allowSlideNext = true;

	  const snapTranslate = -snapGrid[activeIndex];
	  const diff = snapTranslate - swiper.getTranslate();

	  // Fix For Negative Oversliding
	  if (activeIndex < loopedSlides) {
	    newIndex = (slides.length - (loopedSlides * 3)) + activeIndex;
	    newIndex += loopedSlides;
	    const slideChanged = swiper.slideTo(newIndex, 0, false, true);
	    if (slideChanged && diff !== 0) {
	      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
	    }
	  } else if (activeIndex >= slides.length - loopedSlides) {
	    // Fix For Positive Oversliding
	    newIndex = -slides.length + activeIndex + loopedSlides;
	    newIndex += loopedSlides;
	    const slideChanged = swiper.slideTo(newIndex, 0, false, true);
	    if (slideChanged && diff !== 0) {
	      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
	    }
	  }
	  swiper.allowSlidePrev = allowSlidePrev;
	  swiper.allowSlideNext = allowSlideNext;

	  swiper.emit('loopFix');
	}

	function loopDestroy () {
	  const swiper = this;
	  const { $wrapperEl, params, slides } = swiper;
	  $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
	  slides.removeAttr('data-swiper-slide-index');
	}

	var loop = {
	  loopCreate,
	  loopFix,
	  loopDestroy,
	};

	function setGrabCursor (moving) {
	  const swiper = this;
	  if (Support.touch || !swiper.params.simulateTouch || (swiper.params.watchOverflow && swiper.isLocked) || swiper.params.cssMode) return;
	  const el = swiper.el;
	  el.style.cursor = 'move';
	  el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
	  el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
	  el.style.cursor = moving ? 'grabbing' : 'grab';
	}

	function unsetGrabCursor () {
	  const swiper = this;
	  if (Support.touch || (swiper.params.watchOverflow && swiper.isLocked) || swiper.params.cssMode) return;
	  swiper.el.style.cursor = '';
	}

	var grabCursor = {
	  setGrabCursor,
	  unsetGrabCursor,
	};

	function appendSlide (slides) {
	  const swiper = this;
	  const { $wrapperEl, params } = swiper;
	  if (params.loop) {
	    swiper.loopDestroy();
	  }
	  if (typeof slides === 'object' && 'length' in slides) {
	    for (let i = 0; i < slides.length; i += 1) {
	      if (slides[i]) $wrapperEl.append(slides[i]);
	    }
	  } else {
	    $wrapperEl.append(slides);
	  }
	  if (params.loop) {
	    swiper.loopCreate();
	  }
	  if (!(params.observer && Support.observer)) {
	    swiper.update();
	  }
	}

	function prependSlide (slides) {
	  const swiper = this;
	  const { params, $wrapperEl, activeIndex } = swiper;

	  if (params.loop) {
	    swiper.loopDestroy();
	  }
	  let newActiveIndex = activeIndex + 1;
	  if (typeof slides === 'object' && 'length' in slides) {
	    for (let i = 0; i < slides.length; i += 1) {
	      if (slides[i]) $wrapperEl.prepend(slides[i]);
	    }
	    newActiveIndex = activeIndex + slides.length;
	  } else {
	    $wrapperEl.prepend(slides);
	  }
	  if (params.loop) {
	    swiper.loopCreate();
	  }
	  if (!(params.observer && Support.observer)) {
	    swiper.update();
	  }
	  swiper.slideTo(newActiveIndex, 0, false);
	}

	function addSlide (index, slides) {
	  const swiper = this;
	  const { $wrapperEl, params, activeIndex } = swiper;
	  let activeIndexBuffer = activeIndex;
	  if (params.loop) {
	    activeIndexBuffer -= swiper.loopedSlides;
	    swiper.loopDestroy();
	    swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
	  }
	  const baseLength = swiper.slides.length;
	  if (index <= 0) {
	    swiper.prependSlide(slides);
	    return;
	  }
	  if (index >= baseLength) {
	    swiper.appendSlide(slides);
	    return;
	  }
	  let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;

	  const slidesBuffer = [];
	  for (let i = baseLength - 1; i >= index; i -= 1) {
	    const currentSlide = swiper.slides.eq(i);
	    currentSlide.remove();
	    slidesBuffer.unshift(currentSlide);
	  }

	  if (typeof slides === 'object' && 'length' in slides) {
	    for (let i = 0; i < slides.length; i += 1) {
	      if (slides[i]) $wrapperEl.append(slides[i]);
	    }
	    newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
	  } else {
	    $wrapperEl.append(slides);
	  }

	  for (let i = 0; i < slidesBuffer.length; i += 1) {
	    $wrapperEl.append(slidesBuffer[i]);
	  }

	  if (params.loop) {
	    swiper.loopCreate();
	  }
	  if (!(params.observer && Support.observer)) {
	    swiper.update();
	  }
	  if (params.loop) {
	    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
	  } else {
	    swiper.slideTo(newActiveIndex, 0, false);
	  }
	}

	function removeSlide (slidesIndexes) {
	  const swiper = this;
	  const { params, $wrapperEl, activeIndex } = swiper;

	  let activeIndexBuffer = activeIndex;
	  if (params.loop) {
	    activeIndexBuffer -= swiper.loopedSlides;
	    swiper.loopDestroy();
	    swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
	  }
	  let newActiveIndex = activeIndexBuffer;
	  let indexToRemove;

	  if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
	    for (let i = 0; i < slidesIndexes.length; i += 1) {
	      indexToRemove = slidesIndexes[i];
	      if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
	      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
	    }
	    newActiveIndex = Math.max(newActiveIndex, 0);
	  } else {
	    indexToRemove = slidesIndexes;
	    if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
	    if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
	    newActiveIndex = Math.max(newActiveIndex, 0);
	  }

	  if (params.loop) {
	    swiper.loopCreate();
	  }

	  if (!(params.observer && Support.observer)) {
	    swiper.update();
	  }
	  if (params.loop) {
	    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
	  } else {
	    swiper.slideTo(newActiveIndex, 0, false);
	  }
	}

	function removeAllSlides () {
	  const swiper = this;

	  const slidesIndexes = [];
	  for (let i = 0; i < swiper.slides.length; i += 1) {
	    slidesIndexes.push(i);
	  }
	  swiper.removeSlide(slidesIndexes);
	}

	var manipulation = {
	  appendSlide,
	  prependSlide,
	  addSlide,
	  removeSlide,
	  removeAllSlides,
	};

	const Device = (function Device() {
	  const platform = win.navigator.platform;
	  const ua = win.navigator.userAgent;

	  const device = {
	    ios: false,
	    android: false,
	    androidChrome: false,
	    desktop: false,
	    iphone: false,
	    ipod: false,
	    ipad: false,
	    edge: false,
	    ie: false,
	    firefox: false,
	    macos: false,
	    windows: false,
	    cordova: !!(win.cordova || win.phonegap),
	    phonegap: !!(win.cordova || win.phonegap),
	    electron: false,
	  };

	  const screenWidth = win.screen.width;
	  const screenHeight = win.screen.height;

	  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
	  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
	  const ie = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
	  const edge = ua.indexOf('Edge/') >= 0;
	  const firefox = ua.indexOf('Gecko/') >= 0 && ua.indexOf('Firefox/') >= 0;
	  const windows = platform === 'Win32';
	  const electron = ua.toLowerCase().indexOf('electron') >= 0;
	  let macos = platform === 'MacIntel';

	  // iPadOs 13 fix
	  if (!ipad
	    && macos
	    && Support.touch
	    && (
	      (screenWidth === 1024 && screenHeight === 1366) // Pro 12.9
	      || (screenWidth === 834 && screenHeight === 1194) // Pro 11
	      || (screenWidth === 834 && screenHeight === 1112) // Pro 10.5
	      || (screenWidth === 768 && screenHeight === 1024) // other
	    )
	  ) {
	    ipad = ua.match(/(Version)\/([\d.]+)/);
	    macos = false;
	  }

	  device.ie = ie;
	  device.edge = edge;
	  device.firefox = firefox;

	  // Android
	  if (android && !windows) {
	    device.os = 'android';
	    device.osVersion = android[2];
	    device.android = true;
	    device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
	  }
	  if (ipad || iphone || ipod) {
	    device.os = 'ios';
	    device.ios = true;
	  }
	  // iOS
	  if (iphone && !ipod) {
	    device.osVersion = iphone[2].replace(/_/g, '.');
	    device.iphone = true;
	  }
	  if (ipad) {
	    device.osVersion = ipad[2].replace(/_/g, '.');
	    device.ipad = true;
	  }
	  if (ipod) {
	    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	    device.ipod = true;
	  }
	  // iOS 8+ changed UA
	  if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
	    if (device.osVersion.split('.')[0] === '10') {
	      device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
	    }
	  }

	  // Webview
	  device.webView = !!((iphone || ipad || ipod) && (ua.match(/.*AppleWebKit(?!.*Safari)/i) || win.navigator.standalone))
	    || (win.matchMedia && win.matchMedia('(display-mode: standalone)').matches);
	  device.webview = device.webView;
	  device.standalone = device.webView;

	  // Desktop
	  device.desktop = !(device.ios || device.android) || electron;
	  if (device.desktop) {
	    device.electron = electron;
	    device.macos = macos;
	    device.windows = windows;
	    if (device.macos) {
	      device.os = 'macos';
	    }
	    if (device.windows) {
	      device.os = 'windows';
	    }
	  }

	  // Pixel Ratio
	  device.pixelRatio = win.devicePixelRatio || 1;

	  // Export object
	  return device;
	}());

	function onTouchStart (event) {
	  const swiper = this;
	  const data = swiper.touchEventsData;
	  const { params, touches } = swiper;

	  if (swiper.animating && params.preventInteractionOnTransition) {
	    return;
	  }
	  let e = event;
	  if (e.originalEvent) e = e.originalEvent;
	  const $targetEl = $(e.target);

	  if (params.touchEventsTarget === 'wrapper') {
	    if (!$targetEl.closest(swiper.wrapperEl).length) return;
	  }
	  data.isTouchEvent = e.type === 'touchstart';
	  if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
	  if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
	  if (data.isTouched && data.isMoved) return;
	  if (params.noSwiping && $targetEl.closest(params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`)[0]) {
	    swiper.allowClick = true;
	    return;
	  }
	  if (params.swipeHandler) {
	    if (!$targetEl.closest(params.swipeHandler)[0]) return;
	  }

	  touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
	  touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
	  const startX = touches.currentX;
	  const startY = touches.currentY;

	  // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore

	  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
	  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
	  if (
	    edgeSwipeDetection
	    && ((startX <= edgeSwipeThreshold)
	    || (startX >= win.screen.width - edgeSwipeThreshold))
	  ) {
	    return;
	  }

	  Utils.extend(data, {
	    isTouched: true,
	    isMoved: false,
	    allowTouchCallbacks: true,
	    isScrolling: undefined,
	    startMoving: undefined,
	  });

	  touches.startX = startX;
	  touches.startY = startY;
	  data.touchStartTime = Utils.now();
	  swiper.allowClick = true;
	  swiper.updateSize();
	  swiper.swipeDirection = undefined;
	  if (params.threshold > 0) data.allowThresholdMove = false;
	  if (e.type !== 'touchstart') {
	    let preventDefault = true;
	    if ($targetEl.is(data.formElements)) preventDefault = false;
	    if (
	      doc.activeElement
	      && $(doc.activeElement).is(data.formElements)
	      && doc.activeElement !== $targetEl[0]
	    ) {
	      doc.activeElement.blur();
	    }

	    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
	    if (params.touchStartForcePreventDefault || shouldPreventDefault) {
	      e.preventDefault();
	    }
	  }
	  swiper.emit('touchStart', e);
	}

	function onTouchMove (event) {
	  const swiper = this;
	  const data = swiper.touchEventsData;
	  const { params, touches, rtlTranslate: rtl } = swiper;
	  let e = event;
	  if (e.originalEvent) e = e.originalEvent;
	  if (!data.isTouched) {
	    if (data.startMoving && data.isScrolling) {
	      swiper.emit('touchMoveOpposite', e);
	    }
	    return;
	  }
	  if (data.isTouchEvent && e.type === 'mousemove') return;
	  const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
	  const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
	  const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;
	  if (e.preventedByNestedSwiper) {
	    touches.startX = pageX;
	    touches.startY = pageY;
	    return;
	  }
	  if (!swiper.allowTouchMove) {
	    // isMoved = true;
	    swiper.allowClick = false;
	    if (data.isTouched) {
	      Utils.extend(touches, {
	        startX: pageX,
	        startY: pageY,
	        currentX: pageX,
	        currentY: pageY,
	      });
	      data.touchStartTime = Utils.now();
	    }
	    return;
	  }
	  if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
	    if (swiper.isVertical()) {
	      // Vertical
	      if (
	        (pageY < touches.startY && swiper.translate <= swiper.maxTranslate())
	        || (pageY > touches.startY && swiper.translate >= swiper.minTranslate())
	      ) {
	        data.isTouched = false;
	        data.isMoved = false;
	        return;
	      }
	    } else if (
	      (pageX < touches.startX && swiper.translate <= swiper.maxTranslate())
	      || (pageX > touches.startX && swiper.translate >= swiper.minTranslate())
	    ) {
	      return;
	    }
	  }
	  if (data.isTouchEvent && doc.activeElement) {
	    if (e.target === doc.activeElement && $(e.target).is(data.formElements)) {
	      data.isMoved = true;
	      swiper.allowClick = false;
	      return;
	    }
	  }
	  if (data.allowTouchCallbacks) {
	    swiper.emit('touchMove', e);
	  }
	  if (e.targetTouches && e.targetTouches.length > 1) return;

	  touches.currentX = pageX;
	  touches.currentY = pageY;

	  const diffX = touches.currentX - touches.startX;
	  const diffY = touches.currentY - touches.startY;
	  if (swiper.params.threshold && Math.sqrt((diffX ** 2) + (diffY ** 2)) < swiper.params.threshold) return;

	  if (typeof data.isScrolling === 'undefined') {
	    let touchAngle;
	    if ((swiper.isHorizontal() && touches.currentY === touches.startY) || (swiper.isVertical() && touches.currentX === touches.startX)) {
	      data.isScrolling = false;
	    } else {
	      // eslint-disable-next-line
	      if ((diffX * diffX) + (diffY * diffY) >= 25) {
	        touchAngle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
	        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : (90 - touchAngle > params.touchAngle);
	      }
	    }
	  }
	  if (data.isScrolling) {
	    swiper.emit('touchMoveOpposite', e);
	  }
	  if (typeof data.startMoving === 'undefined') {
	    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
	      data.startMoving = true;
	    }
	  }
	  if (data.isScrolling) {
	    data.isTouched = false;
	    return;
	  }
	  if (!data.startMoving) {
	    return;
	  }
	  swiper.allowClick = false;
	  if (!params.cssMode) {
	    e.preventDefault();
	  }
	  if (params.touchMoveStopPropagation && !params.nested) {
	    e.stopPropagation();
	  }

	  if (!data.isMoved) {
	    if (params.loop) {
	      swiper.loopFix();
	    }
	    data.startTranslate = swiper.getTranslate();
	    swiper.setTransition(0);
	    if (swiper.animating) {
	      swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
	    }
	    data.allowMomentumBounce = false;
	    // Grab Cursor
	    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
	      swiper.setGrabCursor(true);
	    }
	    swiper.emit('sliderFirstMove', e);
	  }
	  swiper.emit('sliderMove', e);
	  data.isMoved = true;

	  let diff = swiper.isHorizontal() ? diffX : diffY;
	  touches.diff = diff;

	  diff *= params.touchRatio;
	  if (rtl) diff = -diff;

	  swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
	  data.currentTranslate = diff + data.startTranslate;

	  let disableParentSwiper = true;
	  let resistanceRatio = params.resistanceRatio;
	  if (params.touchReleaseOnEdges) {
	    resistanceRatio = 0;
	  }
	  if ((diff > 0 && data.currentTranslate > swiper.minTranslate())) {
	    disableParentSwiper = false;
	    if (params.resistance) data.currentTranslate = (swiper.minTranslate() - 1) + ((-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio);
	  } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
	    disableParentSwiper = false;
	    if (params.resistance) data.currentTranslate = (swiper.maxTranslate() + 1) - ((swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio);
	  }

	  if (disableParentSwiper) {
	    e.preventedByNestedSwiper = true;
	  }

	  // Directions locks
	  if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
	    data.currentTranslate = data.startTranslate;
	  }
	  if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
	    data.currentTranslate = data.startTranslate;
	  }


	  // Threshold
	  if (params.threshold > 0) {
	    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
	      if (!data.allowThresholdMove) {
	        data.allowThresholdMove = true;
	        touches.startX = touches.currentX;
	        touches.startY = touches.currentY;
	        data.currentTranslate = data.startTranslate;
	        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
	        return;
	      }
	    } else {
	      data.currentTranslate = data.startTranslate;
	      return;
	    }
	  }

	  if (!params.followFinger || params.cssMode) return;

	  // Update active index in free mode
	  if (params.freeMode || params.watchSlidesProgress || params.watchSlidesVisibility) {
	    swiper.updateActiveIndex();
	    swiper.updateSlidesClasses();
	  }
	  if (params.freeMode) {
	    // Velocity
	    if (data.velocities.length === 0) {
	      data.velocities.push({
	        position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
	        time: data.touchStartTime,
	      });
	    }
	    data.velocities.push({
	      position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
	      time: Utils.now(),
	    });
	  }
	  // Update progress
	  swiper.updateProgress(data.currentTranslate);
	  // Update translate
	  swiper.setTranslate(data.currentTranslate);
	}

	function onTouchEnd (event) {
	  const swiper = this;
	  const data = swiper.touchEventsData;

	  const {
	    params, touches, rtlTranslate: rtl, $wrapperEl, slidesGrid, snapGrid,
	  } = swiper;
	  let e = event;
	  if (e.originalEvent) e = e.originalEvent;
	  if (data.allowTouchCallbacks) {
	    swiper.emit('touchEnd', e);
	  }
	  data.allowTouchCallbacks = false;
	  if (!data.isTouched) {
	    if (data.isMoved && params.grabCursor) {
	      swiper.setGrabCursor(false);
	    }
	    data.isMoved = false;
	    data.startMoving = false;
	    return;
	  }
	  // Return Grab Cursor
	  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
	    swiper.setGrabCursor(false);
	  }

	  // Time diff
	  const touchEndTime = Utils.now();
	  const timeDiff = touchEndTime - data.touchStartTime;

	  // Tap, doubleTap, Click
	  if (swiper.allowClick) {
	    swiper.updateClickedSlide(e);
	    swiper.emit('tap click', e);
	    if (timeDiff < 300 && (touchEndTime - data.lastClickTime) < 300) {
	      swiper.emit('doubleTap doubleClick', e);
	    }
	  }

	  data.lastClickTime = Utils.now();
	  Utils.nextTick(() => {
	    if (!swiper.destroyed) swiper.allowClick = true;
	  });

	  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
	    data.isTouched = false;
	    data.isMoved = false;
	    data.startMoving = false;
	    return;
	  }
	  data.isTouched = false;
	  data.isMoved = false;
	  data.startMoving = false;

	  let currentPos;
	  if (params.followFinger) {
	    currentPos = rtl ? swiper.translate : -swiper.translate;
	  } else {
	    currentPos = -data.currentTranslate;
	  }

	  if (params.cssMode) {
	    return;
	  }

	  if (params.freeMode) {
	    if (currentPos < -swiper.minTranslate()) {
	      swiper.slideTo(swiper.activeIndex);
	      return;
	    }
	    if (currentPos > -swiper.maxTranslate()) {
	      if (swiper.slides.length < snapGrid.length) {
	        swiper.slideTo(snapGrid.length - 1);
	      } else {
	        swiper.slideTo(swiper.slides.length - 1);
	      }
	      return;
	    }

	    if (params.freeModeMomentum) {
	      if (data.velocities.length > 1) {
	        const lastMoveEvent = data.velocities.pop();
	        const velocityEvent = data.velocities.pop();

	        const distance = lastMoveEvent.position - velocityEvent.position;
	        const time = lastMoveEvent.time - velocityEvent.time;
	        swiper.velocity = distance / time;
	        swiper.velocity /= 2;
	        if (Math.abs(swiper.velocity) < params.freeModeMinimumVelocity) {
	          swiper.velocity = 0;
	        }
	        // this implies that the user stopped moving a finger then released.
	        // There would be no events with distance zero, so the last event is stale.
	        if (time > 150 || (Utils.now() - lastMoveEvent.time) > 300) {
	          swiper.velocity = 0;
	        }
	      } else {
	        swiper.velocity = 0;
	      }
	      swiper.velocity *= params.freeModeMomentumVelocityRatio;

	      data.velocities.length = 0;
	      let momentumDuration = 1000 * params.freeModeMomentumRatio;
	      const momentumDistance = swiper.velocity * momentumDuration;

	      let newPosition = swiper.translate + momentumDistance;
	      if (rtl) newPosition = -newPosition;

	      let doBounce = false;
	      let afterBouncePosition;
	      const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeModeMomentumBounceRatio;
	      let needsLoopFix;
	      if (newPosition < swiper.maxTranslate()) {
	        if (params.freeModeMomentumBounce) {
	          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
	            newPosition = swiper.maxTranslate() - bounceAmount;
	          }
	          afterBouncePosition = swiper.maxTranslate();
	          doBounce = true;
	          data.allowMomentumBounce = true;
	        } else {
	          newPosition = swiper.maxTranslate();
	        }
	        if (params.loop && params.centeredSlides) needsLoopFix = true;
	      } else if (newPosition > swiper.minTranslate()) {
	        if (params.freeModeMomentumBounce) {
	          if (newPosition - swiper.minTranslate() > bounceAmount) {
	            newPosition = swiper.minTranslate() + bounceAmount;
	          }
	          afterBouncePosition = swiper.minTranslate();
	          doBounce = true;
	          data.allowMomentumBounce = true;
	        } else {
	          newPosition = swiper.minTranslate();
	        }
	        if (params.loop && params.centeredSlides) needsLoopFix = true;
	      } else if (params.freeModeSticky) {
	        let nextSlide;
	        for (let j = 0; j < snapGrid.length; j += 1) {
	          if (snapGrid[j] > -newPosition) {
	            nextSlide = j;
	            break;
	          }
	        }

	        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
	          newPosition = snapGrid[nextSlide];
	        } else {
	          newPosition = snapGrid[nextSlide - 1];
	        }
	        newPosition = -newPosition;
	      }
	      if (needsLoopFix) {
	        swiper.once('transitionEnd', () => {
	          swiper.loopFix();
	        });
	      }
	      // Fix duration
	      if (swiper.velocity !== 0) {
	        if (rtl) {
	          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
	        } else {
	          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
	        }
	        if (params.freeModeSticky) {
	          // If freeModeSticky is active and the user ends a swipe with a slow-velocity
	          // event, then durations can be 20+ seconds to slide one (or zero!) slides.
	          // It's easy to see this when simulating touch with mouse events. To fix this,
	          // limit single-slide swipes to the default slide duration. This also has the
	          // nice side effect of matching slide speed if the user stopped moving before
	          // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
	          // For faster swipes, also apply limits (albeit higher ones).
	          const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
	          const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
	          if (moveDistance < currentSlideSize) {
	            momentumDuration = params.speed;
	          } else if (moveDistance < 2 * currentSlideSize) {
	            momentumDuration = params.speed * 1.5;
	          } else {
	            momentumDuration = params.speed * 2.5;
	          }
	        }
	      } else if (params.freeModeSticky) {
	        swiper.slideToClosest();
	        return;
	      }

	      if (params.freeModeMomentumBounce && doBounce) {
	        swiper.updateProgress(afterBouncePosition);
	        swiper.setTransition(momentumDuration);
	        swiper.setTranslate(newPosition);
	        swiper.transitionStart(true, swiper.swipeDirection);
	        swiper.animating = true;
	        $wrapperEl.transitionEnd(() => {
	          if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
	          swiper.emit('momentumBounce');

	          swiper.setTransition(params.speed);
	          swiper.setTranslate(afterBouncePosition);
	          $wrapperEl.transitionEnd(() => {
	            if (!swiper || swiper.destroyed) return;
	            swiper.transitionEnd();
	          });
	        });
	      } else if (swiper.velocity) {
	        swiper.updateProgress(newPosition);
	        swiper.setTransition(momentumDuration);
	        swiper.setTranslate(newPosition);
	        swiper.transitionStart(true, swiper.swipeDirection);
	        if (!swiper.animating) {
	          swiper.animating = true;
	          $wrapperEl.transitionEnd(() => {
	            if (!swiper || swiper.destroyed) return;
	            swiper.transitionEnd();
	          });
	        }
	      } else {
	        swiper.updateProgress(newPosition);
	      }

	      swiper.updateActiveIndex();
	      swiper.updateSlidesClasses();
	    } else if (params.freeModeSticky) {
	      swiper.slideToClosest();
	      return;
	    }

	    if (!params.freeModeMomentum || timeDiff >= params.longSwipesMs) {
	      swiper.updateProgress();
	      swiper.updateActiveIndex();
	      swiper.updateSlidesClasses();
	    }
	    return;
	  }

	  // Find current slide
	  let stopIndex = 0;
	  let groupSize = swiper.slidesSizesGrid[0];
	  for (let i = 0; i < slidesGrid.length; i += params.slidesPerGroup) {
	    if (typeof slidesGrid[i + params.slidesPerGroup] !== 'undefined') {
	      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + params.slidesPerGroup]) {
	        stopIndex = i;
	        groupSize = slidesGrid[i + params.slidesPerGroup] - slidesGrid[i];
	      }
	    } else if (currentPos >= slidesGrid[i]) {
	      stopIndex = i;
	      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
	    }
	  }

	  // Find current slide size
	  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;

	  if (timeDiff > params.longSwipesMs) {
	    // Long touches
	    if (!params.longSwipes) {
	      swiper.slideTo(swiper.activeIndex);
	      return;
	    }
	    if (swiper.swipeDirection === 'next') {
	      if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + params.slidesPerGroup);
	      else swiper.slideTo(stopIndex);
	    }
	    if (swiper.swipeDirection === 'prev') {
	      if (ratio > (1 - params.longSwipesRatio)) swiper.slideTo(stopIndex + params.slidesPerGroup);
	      else swiper.slideTo(stopIndex);
	    }
	  } else {
	    // Short swipes
	    if (!params.shortSwipes) {
	      swiper.slideTo(swiper.activeIndex);
	      return;
	    }
	    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
	    if (!isNavButtonTarget) {
	      if (swiper.swipeDirection === 'next') {
	        swiper.slideTo(stopIndex + params.slidesPerGroup);
	      }
	      if (swiper.swipeDirection === 'prev') {
	        swiper.slideTo(stopIndex);
	      }
	    } else if (e.target === swiper.navigation.nextEl) {
	      swiper.slideTo(stopIndex + params.slidesPerGroup);
	    } else {
	      swiper.slideTo(stopIndex);
	    }
	  }
	}

	function onResize () {
	  const swiper = this;

	  const { params, el } = swiper;

	  if (el && el.offsetWidth === 0) return;

	  // Breakpoints
	  if (params.breakpoints) {
	    swiper.setBreakpoint();
	  }

	  // Save locks
	  const { allowSlideNext, allowSlidePrev, snapGrid } = swiper;

	  // Disable locks on resize
	  swiper.allowSlideNext = true;
	  swiper.allowSlidePrev = true;

	  swiper.updateSize();
	  swiper.updateSlides();

	  swiper.updateSlidesClasses();
	  if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
	    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
	  } else {
	    swiper.slideTo(swiper.activeIndex, 0, false, true);
	  }

	  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
	    swiper.autoplay.run();
	  }
	  // Return locks after resize
	  swiper.allowSlidePrev = allowSlidePrev;
	  swiper.allowSlideNext = allowSlideNext;

	  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
	    swiper.checkOverflow();
	  }
	}

	function onClick (e) {
	  const swiper = this;
	  if (!swiper.allowClick) {
	    if (swiper.params.preventClicks) e.preventDefault();
	    if (swiper.params.preventClicksPropagation && swiper.animating) {
	      e.stopPropagation();
	      e.stopImmediatePropagation();
	    }
	  }
	}

	function onScroll () {
	  const swiper = this;
	  const { wrapperEl } = swiper;
	  swiper.previousTranslate = swiper.translate;
	  swiper.translate = swiper.isHorizontal() ? -wrapperEl.scrollLeft : -wrapperEl.scrollTop;
	  // eslint-disable-next-line
	  if (swiper.translate === -0) swiper.translate = 0;

	  swiper.updateActiveIndex();
	  swiper.updateSlidesClasses();

	  let newProgress;
	  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
	  if (translatesDiff === 0) {
	    newProgress = 0;
	  } else {
	    newProgress = (swiper.translate - swiper.minTranslate()) / (translatesDiff);
	  }
	  if (newProgress !== swiper.progress) {
	    swiper.updateProgress(swiper.translate);
	  }

	  swiper.emit('setTranslate', swiper.translate, false);
	}

	let dummyEventAttached = false;
	function dummyEventListener() {}

	function attachEvents() {
	  const swiper = this;
	  const {
	    params, touchEvents, el, wrapperEl,
	  } = swiper;

	  swiper.onTouchStart = onTouchStart.bind(swiper);
	  swiper.onTouchMove = onTouchMove.bind(swiper);
	  swiper.onTouchEnd = onTouchEnd.bind(swiper);
	  if (params.cssMode) {
	    swiper.onScroll = onScroll.bind(swiper);
	  }

	  swiper.onClick = onClick.bind(swiper);

	  const capture = !!params.nested;

	  // Touch Events
	  if (!Support.touch && Support.pointerEvents) {
	    el.addEventListener(touchEvents.start, swiper.onTouchStart, false);
	    doc.addEventListener(touchEvents.move, swiper.onTouchMove, capture);
	    doc.addEventListener(touchEvents.end, swiper.onTouchEnd, false);
	  } else {
	    if (Support.touch) {
	      const passiveListener = touchEvents.start === 'touchstart' && Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
	      el.addEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
	      el.addEventListener(touchEvents.move, swiper.onTouchMove, Support.passiveListener ? { passive: false, capture } : capture);
	      el.addEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
	      if (touchEvents.cancel) {
	        el.addEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
	      }
	      if (!dummyEventAttached) {
	        doc.addEventListener('touchstart', dummyEventListener);
	        dummyEventAttached = true;
	      }
	    }
	    if ((params.simulateTouch && !Device.ios && !Device.android) || (params.simulateTouch && !Support.touch && Device.ios)) {
	      el.addEventListener('mousedown', swiper.onTouchStart, false);
	      doc.addEventListener('mousemove', swiper.onTouchMove, capture);
	      doc.addEventListener('mouseup', swiper.onTouchEnd, false);
	    }
	  }
	  // Prevent Links Clicks
	  if (params.preventClicks || params.preventClicksPropagation) {
	    el.addEventListener('click', swiper.onClick, true);
	  }
	  if (params.cssMode) {
	    wrapperEl.addEventListener('scroll', swiper.onScroll);
	  }

	  // Resize handler
	  if (params.updateOnWindowResize) {
	    swiper.on((Device.ios || Device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate'), onResize, true);
	  } else {
	    swiper.on('observerUpdate', onResize, true);
	  }
	}

	function detachEvents() {
	  const swiper = this;

	  const {
	    params, touchEvents, el, wrapperEl,
	  } = swiper;

	  const capture = !!params.nested;

	  // Touch Events
	  if (!Support.touch && Support.pointerEvents) {
	    el.removeEventListener(touchEvents.start, swiper.onTouchStart, false);
	    doc.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
	    doc.removeEventListener(touchEvents.end, swiper.onTouchEnd, false);
	  } else {
	    if (Support.touch) {
	      const passiveListener = touchEvents.start === 'onTouchStart' && Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
	      el.removeEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
	      el.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
	      el.removeEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
	      if (touchEvents.cancel) {
	        el.removeEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
	      }
	    }
	    if ((params.simulateTouch && !Device.ios && !Device.android) || (params.simulateTouch && !Support.touch && Device.ios)) {
	      el.removeEventListener('mousedown', swiper.onTouchStart, false);
	      doc.removeEventListener('mousemove', swiper.onTouchMove, capture);
	      doc.removeEventListener('mouseup', swiper.onTouchEnd, false);
	    }
	  }
	  // Prevent Links Clicks
	  if (params.preventClicks || params.preventClicksPropagation) {
	    el.removeEventListener('click', swiper.onClick, true);
	  }

	  if (params.cssMode) {
	    wrapperEl.removeEventListener('scroll', swiper.onScroll);
	  }

	  // Resize handler
	  swiper.off((Device.ios || Device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate'), onResize);
	}

	var events = {
	  attachEvents,
	  detachEvents,
	};

	function setBreakpoint () {
	  const swiper = this;
	  const {
	    activeIndex, initialized, loopedSlides = 0, params, $el,
	  } = swiper;
	  const breakpoints = params.breakpoints;
	  if (!breakpoints || (breakpoints && Object.keys(breakpoints).length === 0)) return;

	  // Get breakpoint for window width and update parameters
	  const breakpoint = swiper.getBreakpoint(breakpoints);

	  if (breakpoint && swiper.currentBreakpoint !== breakpoint) {
	    const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
	    if (breakpointOnlyParams) {
	      ['slidesPerView', 'spaceBetween', 'slidesPerGroup', 'slidesPerColumn'].forEach((param) => {
	        const paramValue = breakpointOnlyParams[param];
	        if (typeof paramValue === 'undefined') return;
	        if (param === 'slidesPerView' && (paramValue === 'AUTO' || paramValue === 'auto')) {
	          breakpointOnlyParams[param] = 'auto';
	        } else if (param === 'slidesPerView') {
	          breakpointOnlyParams[param] = parseFloat(paramValue);
	        } else {
	          breakpointOnlyParams[param] = parseInt(paramValue, 10);
	        }
	      });
	    }

	    const breakpointParams = breakpointOnlyParams || swiper.originalParams;
	    const wasMultiRow = params.slidesPerColumn > 1;
	    const isMultiRow = breakpointParams.slidesPerColumn > 1;
	    if (wasMultiRow && !isMultiRow) {
	      $el.removeClass(`${params.containerModifierClass}multirow ${params.containerModifierClass}multirow-column`);
	    } else if (!wasMultiRow && isMultiRow) {
	      $el.addClass(`${params.containerModifierClass}multirow`);
	      if (breakpointParams.slidesPerColumnFill === 'column') {
	        $el.addClass(`${params.containerModifierClass}multirow-column`);
	      }
	    }

	    const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
	    const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

	    if (directionChanged && initialized) {
	      swiper.changeDirection();
	    }

	    Utils.extend(swiper.params, breakpointParams);

	    Utils.extend(swiper, {
	      allowTouchMove: swiper.params.allowTouchMove,
	      allowSlideNext: swiper.params.allowSlideNext,
	      allowSlidePrev: swiper.params.allowSlidePrev,
	    });

	    swiper.currentBreakpoint = breakpoint;

	    if (needsReLoop && initialized) {
	      swiper.loopDestroy();
	      swiper.loopCreate();
	      swiper.updateSlides();
	      swiper.slideTo((activeIndex - loopedSlides) + swiper.loopedSlides, 0, false);
	    }

	    swiper.emit('breakpoint', breakpointParams);
	  }
	}

	function getBreakpoint (breakpoints) {
	  // Get breakpoint for window width
	  if (!breakpoints) return undefined;
	  let breakpoint = false;
	  const points = [];
	  Object.keys(breakpoints).forEach((point) => {
	    points.push(point);
	  });
	  points.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
	  for (let i = 0; i < points.length; i += 1) {
	    const point = points[i];
	    if (point <= win.innerWidth) {
	      breakpoint = point;
	    }
	  }
	  return breakpoint || 'max';
	}

	var breakpoints = { setBreakpoint, getBreakpoint };

	function addClasses () {
	  const swiper = this;
	  const {
	    classNames, params, rtl, $el,
	  } = swiper;
	  const suffixes = [];

	  suffixes.push('initialized');
	  suffixes.push(params.direction);

	  if (params.freeMode) {
	    suffixes.push('free-mode');
	  }
	  if (params.autoHeight) {
	    suffixes.push('autoheight');
	  }
	  if (rtl) {
	    suffixes.push('rtl');
	  }
	  if (params.slidesPerColumn > 1) {
	    suffixes.push('multirow');
	    if (params.slidesPerColumnFill === 'column') {
	      suffixes.push('multirow-column');
	    }
	  }
	  if (Device.android) {
	    suffixes.push('android');
	  }
	  if (Device.ios) {
	    suffixes.push('ios');
	  }

	  if (params.cssMode) {
	    suffixes.push('css-mode');
	  }

	  suffixes.forEach((suffix) => {
	    classNames.push(params.containerModifierClass + suffix);
	  });

	  $el.addClass(classNames.join(' '));
	}

	function removeClasses () {
	  const swiper = this;
	  const { $el, classNames } = swiper;

	  $el.removeClass(classNames.join(' '));
	}

	var classes = { addClasses, removeClasses };

	function loadImage (imageEl, src, srcset, sizes, checkForComplete, callback) {
	  let image;
	  function onReady() {
	    if (callback) callback();
	  }
	  if (!imageEl.complete || !checkForComplete) {
	    if (src) {
	      image = new win.Image();
	      image.onload = onReady;
	      image.onerror = onReady;
	      if (sizes) {
	        image.sizes = sizes;
	      }
	      if (srcset) {
	        image.srcset = srcset;
	      }
	      if (src) {
	        image.src = src;
	      }
	    } else {
	      onReady();
	    }
	  } else {
	    // image already loaded...
	    onReady();
	  }
	}

	function preloadImages () {
	  const swiper = this;
	  swiper.imagesToLoad = swiper.$el.find('img');
	  function onReady() {
	    if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
	    if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;
	    if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
	      if (swiper.params.updateOnImagesReady) swiper.update();
	      swiper.emit('imagesReady');
	    }
	  }
	  for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
	    const imageEl = swiper.imagesToLoad[i];
	    swiper.loadImage(
	      imageEl,
	      imageEl.currentSrc || imageEl.getAttribute('src'),
	      imageEl.srcset || imageEl.getAttribute('srcset'),
	      imageEl.sizes || imageEl.getAttribute('sizes'),
	      true,
	      onReady
	    );
	  }
	}

	var images = {
	  loadImage,
	  preloadImages,
	};

	function checkOverflow() {
	  const swiper = this;
	  const params = swiper.params;
	  const wasLocked = swiper.isLocked;
	  const lastSlidePosition = swiper.slides.length > 0 && (params.slidesOffsetBefore + (params.spaceBetween * (swiper.slides.length - 1)) + ((swiper.slides[0]).offsetWidth) * swiper.slides.length);

	  if (params.slidesOffsetBefore && params.slidesOffsetAfter && lastSlidePosition) {
	    swiper.isLocked = lastSlidePosition <= swiper.size;
	  } else {
	    swiper.isLocked = swiper.snapGrid.length === 1;
	  }

	  swiper.allowSlideNext = !swiper.isLocked;
	  swiper.allowSlidePrev = !swiper.isLocked;

	  // events
	  if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? 'lock' : 'unlock');

	  if (wasLocked && wasLocked !== swiper.isLocked) {
	    swiper.isEnd = false;
	    swiper.navigation.update();
	  }
	}

	var checkOverflow$1 = { checkOverflow };

	var defaults = {
	  init: true,
	  direction: 'horizontal',
	  touchEventsTarget: 'container',
	  initialSlide: 0,
	  speed: 300,
	  cssMode: false,
	  updateOnWindowResize: true,
	  //
	  preventInteractionOnTransition: false,

	  // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
	  edgeSwipeDetection: false,
	  edgeSwipeThreshold: 20,

	  // Free mode
	  freeMode: false,
	  freeModeMomentum: true,
	  freeModeMomentumRatio: 1,
	  freeModeMomentumBounce: true,
	  freeModeMomentumBounceRatio: 1,
	  freeModeMomentumVelocityRatio: 1,
	  freeModeSticky: false,
	  freeModeMinimumVelocity: 0.02,

	  // Autoheight
	  autoHeight: false,

	  // Set wrapper width
	  setWrapperSize: false,

	  // Virtual Translate
	  virtualTranslate: false,

	  // Effects
	  effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'

	  // Breakpoints
	  breakpoints: undefined,

	  // Slides grid
	  spaceBetween: 0,
	  slidesPerView: 1,
	  slidesPerColumn: 1,
	  slidesPerColumnFill: 'column',
	  slidesPerGroup: 1,
	  centeredSlides: false,
	  centeredSlidesBounds: false,
	  slidesOffsetBefore: 0, // in px
	  slidesOffsetAfter: 0, // in px
	  normalizeSlideIndex: true,
	  centerInsufficientSlides: false,

	  // Disable swiper and hide navigation when container not overflow
	  watchOverflow: false,

	  // Round length
	  roundLengths: false,

	  // Touches
	  touchRatio: 1,
	  touchAngle: 45,
	  simulateTouch: true,
	  shortSwipes: true,
	  longSwipes: true,
	  longSwipesRatio: 0.5,
	  longSwipesMs: 300,
	  followFinger: true,
	  allowTouchMove: true,
	  threshold: 0,
	  touchMoveStopPropagation: false,
	  touchStartPreventDefault: true,
	  touchStartForcePreventDefault: false,
	  touchReleaseOnEdges: false,

	  // Unique Navigation Elements
	  uniqueNavElements: true,

	  // Resistance
	  resistance: true,
	  resistanceRatio: 0.85,

	  // Progress
	  watchSlidesProgress: false,
	  watchSlidesVisibility: false,

	  // Cursor
	  grabCursor: false,

	  // Clicks
	  preventClicks: true,
	  preventClicksPropagation: true,
	  slideToClickedSlide: false,

	  // Images
	  preloadImages: true,
	  updateOnImagesReady: true,

	  // loop
	  loop: false,
	  loopAdditionalSlides: 0,
	  loopedSlides: null,
	  loopFillGroupWithBlank: false,

	  // Swiping/no swiping
	  allowSlidePrev: true,
	  allowSlideNext: true,
	  swipeHandler: null, // '.swipe-handler',
	  noSwiping: true,
	  noSwipingClass: 'swiper-no-swiping',
	  noSwipingSelector: null,

	  // Passive Listeners
	  passiveListeners: true,

	  // NS
	  containerModifierClass: 'swiper-container-', // NEW
	  slideClass: 'swiper-slide',
	  slideBlankClass: 'swiper-slide-invisible-blank',
	  slideActiveClass: 'swiper-slide-active',
	  slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
	  slideVisibleClass: 'swiper-slide-visible',
	  slideDuplicateClass: 'swiper-slide-duplicate',
	  slideNextClass: 'swiper-slide-next',
	  slideDuplicateNextClass: 'swiper-slide-duplicate-next',
	  slidePrevClass: 'swiper-slide-prev',
	  slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
	  wrapperClass: 'swiper-wrapper',

	  // Callbacks
	  runCallbacksOnInit: true,
	};

	/* eslint no-param-reassign: "off" */

	const prototypes = {
	  update,
	  translate,
	  transition: transition$1,
	  slide,
	  loop,
	  grabCursor,
	  manipulation,
	  events,
	  breakpoints,
	  checkOverflow: checkOverflow$1,
	  classes,
	  images,
	};

	const extendedDefaults = {};

	class Swiper extends SwiperClass {
	  constructor(...args) {
	    let el;
	    let params;
	    if (args.length === 1 && args[0].constructor && args[0].constructor === Object) {
	      params = args[0];
	    } else {
	      [el, params] = args;
	    }
	    if (!params) params = {};

	    params = Utils.extend({}, params);
	    if (el && !params.el) params.el = el;

	    super(params);

	    Object.keys(prototypes).forEach((prototypeGroup) => {
	      Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
	        if (!Swiper.prototype[protoMethod]) {
	          Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
	        }
	      });
	    });

	    // Swiper Instance
	    const swiper = this;
	    if (typeof swiper.modules === 'undefined') {
	      swiper.modules = {};
	    }
	    Object.keys(swiper.modules).forEach((moduleName) => {
	      const module = swiper.modules[moduleName];
	      if (module.params) {
	        const moduleParamName = Object.keys(module.params)[0];
	        const moduleParams = module.params[moduleParamName];
	        if (typeof moduleParams !== 'object' || moduleParams === null) return;
	        if (!(moduleParamName in params && 'enabled' in moduleParams)) return;
	        if (params[moduleParamName] === true) {
	          params[moduleParamName] = { enabled: true };
	        }
	        if (
	          typeof params[moduleParamName] === 'object'
	          && !('enabled' in params[moduleParamName])
	        ) {
	          params[moduleParamName].enabled = true;
	        }
	        if (!params[moduleParamName]) params[moduleParamName] = { enabled: false };
	      }
	    });

	    // Extend defaults with modules params
	    const swiperParams = Utils.extend({}, defaults);
	    swiper.useModulesParams(swiperParams);

	    // Extend defaults with passed params
	    swiper.params = Utils.extend({}, swiperParams, extendedDefaults, params);
	    swiper.originalParams = Utils.extend({}, swiper.params);
	    swiper.passedParams = Utils.extend({}, params);

	    // Save Dom lib
	    swiper.$ = $;

	    // Find el
	    const $el = $(swiper.params.el);
	    el = $el[0];

	    if (!el) {
	      return undefined;
	    }

	    if ($el.length > 1) {
	      const swipers = [];
	      $el.each((index, containerEl) => {
	        const newParams = Utils.extend({}, params, { el: containerEl });
	        swipers.push(new Swiper(newParams));
	      });
	      return swipers;
	    }

	    el.swiper = swiper;
	    $el.data('swiper', swiper);

	    // Find Wrapper
	    let $wrapperEl;
	    if (el && el.shadowRoot && el.shadowRoot.querySelector) {
	      $wrapperEl = $(el.shadowRoot.querySelector(`.${swiper.params.wrapperClass}`));
	      // Children needs to return slot items
	      $wrapperEl.children = (options) => $el.children(options);
	    } else {
	      $wrapperEl = $el.children(`.${swiper.params.wrapperClass}`);
	    }
	    // Extend Swiper
	    Utils.extend(swiper, {
	      $el,
	      el,
	      $wrapperEl,
	      wrapperEl: $wrapperEl[0],

	      // Classes
	      classNames: [],

	      // Slides
	      slides: $(),
	      slidesGrid: [],
	      snapGrid: [],
	      slidesSizesGrid: [],

	      // isDirection
	      isHorizontal() {
	        return swiper.params.direction === 'horizontal';
	      },
	      isVertical() {
	        return swiper.params.direction === 'vertical';
	      },
	      // RTL
	      rtl: (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
	      rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
	      wrongRTL: $wrapperEl.css('display') === '-webkit-box',

	      // Indexes
	      activeIndex: 0,
	      realIndex: 0,

	      //
	      isBeginning: true,
	      isEnd: false,

	      // Props
	      translate: 0,
	      previousTranslate: 0,
	      progress: 0,
	      velocity: 0,
	      animating: false,

	      // Locks
	      allowSlideNext: swiper.params.allowSlideNext,
	      allowSlidePrev: swiper.params.allowSlidePrev,

	      // Touch Events
	      touchEvents: (function touchEvents() {
	        const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
	        let desktop = ['mousedown', 'mousemove', 'mouseup'];
	        if (Support.pointerEvents) {
	          desktop = ['pointerdown', 'pointermove', 'pointerup'];
	        }
	        swiper.touchEventsTouch = {
	          start: touch[0],
	          move: touch[1],
	          end: touch[2],
	          cancel: touch[3],
	        };
	        swiper.touchEventsDesktop = {
	          start: desktop[0],
	          move: desktop[1],
	          end: desktop[2],
	        };
	        return Support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
	      }()),
	      touchEventsData: {
	        isTouched: undefined,
	        isMoved: undefined,
	        allowTouchCallbacks: undefined,
	        touchStartTime: undefined,
	        isScrolling: undefined,
	        currentTranslate: undefined,
	        startTranslate: undefined,
	        allowThresholdMove: undefined,
	        // Form elements to match
	        formElements: 'input, select, option, textarea, button, video',
	        // Last click time
	        lastClickTime: Utils.now(),
	        clickTimeout: undefined,
	        // Velocities
	        velocities: [],
	        allowMomentumBounce: undefined,
	        isTouchEvent: undefined,
	        startMoving: undefined,
	      },

	      // Clicks
	      allowClick: true,

	      // Touches
	      allowTouchMove: swiper.params.allowTouchMove,

	      touches: {
	        startX: 0,
	        startY: 0,
	        currentX: 0,
	        currentY: 0,
	        diff: 0,
	      },

	      // Images
	      imagesToLoad: [],
	      imagesLoaded: 0,

	    });

	    // Install Modules
	    swiper.useModules();

	    // Init
	    if (swiper.params.init) {
	      swiper.init();
	    }

	    // Return app instance
	    return swiper;
	  }

	  slidesPerViewDynamic() {
	    const swiper = this;
	    const {
	      params, slides, slidesGrid, size: swiperSize, activeIndex,
	    } = swiper;
	    let spv = 1;
	    if (params.centeredSlides) {
	      let slideSize = slides[activeIndex].swiperSlideSize;
	      let breakLoop;
	      for (let i = activeIndex + 1; i < slides.length; i += 1) {
	        if (slides[i] && !breakLoop) {
	          slideSize += slides[i].swiperSlideSize;
	          spv += 1;
	          if (slideSize > swiperSize) breakLoop = true;
	        }
	      }
	      for (let i = activeIndex - 1; i >= 0; i -= 1) {
	        if (slides[i] && !breakLoop) {
	          slideSize += slides[i].swiperSlideSize;
	          spv += 1;
	          if (slideSize > swiperSize) breakLoop = true;
	        }
	      }
	    } else {
	      for (let i = activeIndex + 1; i < slides.length; i += 1) {
	        if (slidesGrid[i] - slidesGrid[activeIndex] < swiperSize) {
	          spv += 1;
	        }
	      }
	    }
	    return spv;
	  }

	  update() {
	    const swiper = this;
	    if (!swiper || swiper.destroyed) return;
	    const { snapGrid, params } = swiper;
	    // Breakpoints
	    if (params.breakpoints) {
	      swiper.setBreakpoint();
	    }
	    swiper.updateSize();
	    swiper.updateSlides();
	    swiper.updateProgress();
	    swiper.updateSlidesClasses();

	    function setTranslate() {
	      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
	      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
	      swiper.setTranslate(newTranslate);
	      swiper.updateActiveIndex();
	      swiper.updateSlidesClasses();
	    }
	    let translated;
	    if (swiper.params.freeMode) {
	      setTranslate();
	      if (swiper.params.autoHeight) {
	        swiper.updateAutoHeight();
	      }
	    } else {
	      if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
	        translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
	      } else {
	        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
	      }
	      if (!translated) {
	        setTranslate();
	      }
	    }
	    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
	      swiper.checkOverflow();
	    }
	    swiper.emit('update');
	  }

	  changeDirection(newDirection, needUpdate = true) {
	    const swiper = this;
	    const currentDirection = swiper.params.direction;
	    if (!newDirection) {
	      // eslint-disable-next-line
	      newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
	    }
	    if ((newDirection === currentDirection) || (newDirection !== 'horizontal' && newDirection !== 'vertical')) {
	      return swiper;
	    }

	    swiper.$el
	      .removeClass(`${swiper.params.containerModifierClass}${currentDirection}`)
	      .addClass(`${swiper.params.containerModifierClass}${newDirection}`);

	    swiper.params.direction = newDirection;

	    swiper.slides.each((slideIndex, slideEl) => {
	      if (newDirection === 'vertical') {
	        slideEl.style.width = '';
	      } else {
	        slideEl.style.height = '';
	      }
	    });

	    swiper.emit('changeDirection');
	    if (needUpdate) swiper.update();

	    return swiper;
	  }

	  init() {
	    const swiper = this;
	    if (swiper.initialized) return;

	    swiper.emit('beforeInit');

	    // Set breakpoint
	    if (swiper.params.breakpoints) {
	      swiper.setBreakpoint();
	    }

	    // Add Classes
	    swiper.addClasses();

	    // Create loop
	    if (swiper.params.loop) {
	      swiper.loopCreate();
	    }

	    // Update size
	    swiper.updateSize();

	    // Update slides
	    swiper.updateSlides();

	    if (swiper.params.watchOverflow) {
	      swiper.checkOverflow();
	    }

	    // Set Grab Cursor
	    if (swiper.params.grabCursor) {
	      swiper.setGrabCursor();
	    }

	    if (swiper.params.preloadImages) {
	      swiper.preloadImages();
	    }

	    // Slide To Initial Slide
	    if (swiper.params.loop) {
	      swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit);
	    } else {
	      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit);
	    }

	    // Attach events
	    swiper.attachEvents();

	    // Init Flag
	    swiper.initialized = true;

	    // Emit
	    swiper.emit('init');
	  }

	  destroy(deleteInstance = true, cleanStyles = true) {
	    const swiper = this;
	    const {
	      params, $el, $wrapperEl, slides,
	    } = swiper;

	    if (typeof swiper.params === 'undefined' || swiper.destroyed) {
	      return null;
	    }

	    swiper.emit('beforeDestroy');

	    // Init Flag
	    swiper.initialized = false;

	    // Detach events
	    swiper.detachEvents();

	    // Destroy loop
	    if (params.loop) {
	      swiper.loopDestroy();
	    }

	    // Cleanup styles
	    if (cleanStyles) {
	      swiper.removeClasses();
	      $el.removeAttr('style');
	      $wrapperEl.removeAttr('style');
	      if (slides && slides.length) {
	        slides
	          .removeClass([
	            params.slideVisibleClass,
	            params.slideActiveClass,
	            params.slideNextClass,
	            params.slidePrevClass,
	          ].join(' '))
	          .removeAttr('style')
	          .removeAttr('data-swiper-slide-index');
	      }
	    }

	    swiper.emit('destroy');

	    // Detach emitter events
	    Object.keys(swiper.eventsListeners).forEach((eventName) => {
	      swiper.off(eventName);
	    });

	    if (deleteInstance !== false) {
	      swiper.$el[0].swiper = null;
	      swiper.$el.data('swiper', null);
	      Utils.deleteProps(swiper);
	    }
	    swiper.destroyed = true;

	    return null;
	  }

	  static extendDefaults(newDefaults) {
	    Utils.extend(extendedDefaults, newDefaults);
	  }

	  static get extendedDefaults() {
	    return extendedDefaults;
	  }

	  static get defaults() {
	    return defaults;
	  }

	  static get Class() {
	    return SwiperClass;
	  }

	  static get $() {
	    return $;
	  }
	}

	var Device$1 = {
	  name: 'device',
	  proto: {
	    device: Device,
	  },
	  static: {
	    device: Device,
	  },
	};

	var Support$1 = {
	  name: 'support',
	  proto: {
	    support: Support,
	  },
	  static: {
	    support: Support,
	  },
	};

	const Browser = (function Browser() {
	  function isSafari() {
	    const ua = win.navigator.userAgent.toLowerCase();
	    return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
	  }
	  return {
	    isEdge: !!win.navigator.userAgent.match(/Edge/g),
	    isSafari: isSafari(),
	    isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(win.navigator.userAgent),
	  };
	}());

	var Browser$1 = {
	  name: 'browser',
	  proto: {
	    browser: Browser,
	  },
	  static: {
	    browser: Browser,
	  },
	};

	var Resize = {
	  name: 'resize',
	  create() {
	    const swiper = this;
	    Utils.extend(swiper, {
	      resize: {
	        resizeHandler() {
	          if (!swiper || swiper.destroyed || !swiper.initialized) return;
	          swiper.emit('beforeResize');
	          swiper.emit('resize');
	        },
	        orientationChangeHandler() {
	          if (!swiper || swiper.destroyed || !swiper.initialized) return;
	          swiper.emit('orientationchange');
	        },
	      },
	    });
	  },
	  on: {
	    init() {
	      const swiper = this;
	      // Emit resize
	      win.addEventListener('resize', swiper.resize.resizeHandler);

	      // Emit orientationchange
	      win.addEventListener('orientationchange', swiper.resize.orientationChangeHandler);
	    },
	    destroy() {
	      const swiper = this;
	      win.removeEventListener('resize', swiper.resize.resizeHandler);
	      win.removeEventListener('orientationchange', swiper.resize.orientationChangeHandler);
	    },
	  },
	};

	const Observer = {
	  func: win.MutationObserver || win.WebkitMutationObserver,
	  attach(target, options = {}) {
	    const swiper = this;

	    const ObserverFunc = Observer.func;
	    const observer = new ObserverFunc((mutations) => {
	      // The observerUpdate event should only be triggered
	      // once despite the number of mutations.  Additional
	      // triggers are redundant and are very costly
	      if (mutations.length === 1) {
	        swiper.emit('observerUpdate', mutations[0]);
	        return;
	      }
	      const observerUpdate = function observerUpdate() {
	        swiper.emit('observerUpdate', mutations[0]);
	      };

	      if (win.requestAnimationFrame) {
	        win.requestAnimationFrame(observerUpdate);
	      } else {
	        win.setTimeout(observerUpdate, 0);
	      }
	    });

	    observer.observe(target, {
	      attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
	      childList: typeof options.childList === 'undefined' ? true : options.childList,
	      characterData: typeof options.characterData === 'undefined' ? true : options.characterData,
	    });

	    swiper.observer.observers.push(observer);
	  },
	  init() {
	    const swiper = this;
	    if (!Support.observer || !swiper.params.observer) return;
	    if (swiper.params.observeParents) {
	      const containerParents = swiper.$el.parents();
	      for (let i = 0; i < containerParents.length; i += 1) {
	        swiper.observer.attach(containerParents[i]);
	      }
	    }
	    // Observe container
	    swiper.observer.attach(swiper.$el[0], { childList: swiper.params.observeSlideChildren });

	    // Observe wrapper
	    swiper.observer.attach(swiper.$wrapperEl[0], { attributes: false });
	  },
	  destroy() {
	    const swiper = this;
	    swiper.observer.observers.forEach((observer) => {
	      observer.disconnect();
	    });
	    swiper.observer.observers = [];
	  },
	};

	var Observer$1 = {
	  name: 'observer',
	  params: {
	    observer: false,
	    observeParents: false,
	    observeSlideChildren: false,
	  },
	  create() {
	    const swiper = this;
	    Utils.extend(swiper, {
	      observer: {
	        init: Observer.init.bind(swiper),
	        attach: Observer.attach.bind(swiper),
	        destroy: Observer.destroy.bind(swiper),
	        observers: [],
	      },
	    });
	  },
	  on: {
	    init() {
	      const swiper = this;
	      swiper.observer.init();
	    },
	    destroy() {
	      const swiper = this;
	      swiper.observer.destroy();
	    },
	  },
	};

	const Keyboard = {
	  handle(event) {
	    const swiper = this;
	    const { rtlTranslate: rtl } = swiper;
	    let e = event;
	    if (e.originalEvent) e = e.originalEvent; // jquery fix
	    const kc = e.keyCode || e.charCode;
	    // Directions locks
	    if (!swiper.allowSlideNext && ((swiper.isHorizontal() && kc === 39) || (swiper.isVertical() && kc === 40) || kc === 34)) {
	      return false;
	    }
	    if (!swiper.allowSlidePrev && ((swiper.isHorizontal() && kc === 37) || (swiper.isVertical() && kc === 38) || kc === 33)) {
	      return false;
	    }
	    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
	      return undefined;
	    }
	    if (doc.activeElement && doc.activeElement.nodeName && (doc.activeElement.nodeName.toLowerCase() === 'input' || doc.activeElement.nodeName.toLowerCase() === 'textarea')) {
	      return undefined;
	    }
	    if (swiper.params.keyboard.onlyInViewport && (kc === 33 || kc === 34 || kc === 37 || kc === 39 || kc === 38 || kc === 40)) {
	      let inView = false;
	      // Check that swiper should be inside of visible area of window
	      if (swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 && swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length === 0) {
	        return undefined;
	      }
	      const windowWidth = win.innerWidth;
	      const windowHeight = win.innerHeight;
	      const swiperOffset = swiper.$el.offset();
	      if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
	      const swiperCoord = [
	        [swiperOffset.left, swiperOffset.top],
	        [swiperOffset.left + swiper.width, swiperOffset.top],
	        [swiperOffset.left, swiperOffset.top + swiper.height],
	        [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height],
	      ];
	      for (let i = 0; i < swiperCoord.length; i += 1) {
	        const point = swiperCoord[i];
	        if (
	          point[0] >= 0 && point[0] <= windowWidth
	          && point[1] >= 0 && point[1] <= windowHeight
	        ) {
	          inView = true;
	        }
	      }
	      if (!inView) return undefined;
	    }
	    if (swiper.isHorizontal()) {
	      if (kc === 33 || kc === 34 || kc === 37 || kc === 39) {
	        if (e.preventDefault) e.preventDefault();
	        else e.returnValue = false;
	      }
	      if (((kc === 34 || kc === 39) && !rtl) || ((kc === 33 || kc === 37) && rtl)) swiper.slideNext();
	      if (((kc === 33 || kc === 37) && !rtl) || ((kc === 34 || kc === 39) && rtl)) swiper.slidePrev();
	    } else {
	      if (kc === 33 || kc === 34 || kc === 38 || kc === 40) {
	        if (e.preventDefault) e.preventDefault();
	        else e.returnValue = false;
	      }
	      if (kc === 34 || kc === 40) swiper.slideNext();
	      if (kc === 33 || kc === 38) swiper.slidePrev();
	    }
	    swiper.emit('keyPress', kc);
	    return undefined;
	  },
	  enable() {
	    const swiper = this;
	    if (swiper.keyboard.enabled) return;
	    $(doc).on('keydown', swiper.keyboard.handle);
	    swiper.keyboard.enabled = true;
	  },
	  disable() {
	    const swiper = this;
	    if (!swiper.keyboard.enabled) return;
	    $(doc).off('keydown', swiper.keyboard.handle);
	    swiper.keyboard.enabled = false;
	  },
	};

	var keyboard = {
	  name: 'keyboard',
	  params: {
	    keyboard: {
	      enabled: false,
	      onlyInViewport: true,
	    },
	  },
	  create() {
	    const swiper = this;
	    Utils.extend(swiper, {
	      keyboard: {
	        enabled: false,
	        enable: Keyboard.enable.bind(swiper),
	        disable: Keyboard.disable.bind(swiper),
	        handle: Keyboard.handle.bind(swiper),
	      },
	    });
	  },
	  on: {
	    init() {
	      const swiper = this;
	      if (swiper.params.keyboard.enabled) {
	        swiper.keyboard.enable();
	      }
	    },
	    destroy() {
	      const swiper = this;
	      if (swiper.keyboard.enabled) {
	        swiper.keyboard.disable();
	      }
	    },
	  },
	};

	const Pagination = {
	  update() {
	    // Render || Update Pagination bullets/items
	    const swiper = this;
	    const rtl = swiper.rtl;
	    const params = swiper.params.pagination;
	    if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
	    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
	    const $el = swiper.pagination.$el;
	    // Current/Total
	    let current;
	    const total = swiper.params.loop ? Math.ceil((slidesLength - (swiper.loopedSlides * 2)) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
	    if (swiper.params.loop) {
	      current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
	      if (current > slidesLength - 1 - (swiper.loopedSlides * 2)) {
	        current -= (slidesLength - (swiper.loopedSlides * 2));
	      }
	      if (current > total - 1) current -= total;
	      if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
	    } else if (typeof swiper.snapIndex !== 'undefined') {
	      current = swiper.snapIndex;
	    } else {
	      current = swiper.activeIndex || 0;
	    }
	    // Types
	    if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
	      const bullets = swiper.pagination.bullets;
	      let firstIndex;
	      let lastIndex;
	      let midIndex;
	      if (params.dynamicBullets) {
	        swiper.pagination.bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
	        $el.css(swiper.isHorizontal() ? 'width' : 'height', `${swiper.pagination.bulletSize * (params.dynamicMainBullets + 4)}px`);
	        if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
	          swiper.pagination.dynamicBulletIndex += (current - swiper.previousIndex);
	          if (swiper.pagination.dynamicBulletIndex > (params.dynamicMainBullets - 1)) {
	            swiper.pagination.dynamicBulletIndex = params.dynamicMainBullets - 1;
	          } else if (swiper.pagination.dynamicBulletIndex < 0) {
	            swiper.pagination.dynamicBulletIndex = 0;
	          }
	        }
	        firstIndex = current - swiper.pagination.dynamicBulletIndex;
	        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
	        midIndex = (lastIndex + firstIndex) / 2;
	      }
	      bullets.removeClass(`${params.bulletActiveClass} ${params.bulletActiveClass}-next ${params.bulletActiveClass}-next-next ${params.bulletActiveClass}-prev ${params.bulletActiveClass}-prev-prev ${params.bulletActiveClass}-main`);
	      if ($el.length > 1) {
	        bullets.each((index, bullet) => {
	          const $bullet = $(bullet);
	          const bulletIndex = $bullet.index();
	          if (bulletIndex === current) {
	            $bullet.addClass(params.bulletActiveClass);
	          }
	          if (params.dynamicBullets) {
	            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
	              $bullet.addClass(`${params.bulletActiveClass}-main`);
	            }
	            if (bulletIndex === firstIndex) {
	              $bullet
	                .prev()
	                .addClass(`${params.bulletActiveClass}-prev`)
	                .prev()
	                .addClass(`${params.bulletActiveClass}-prev-prev`);
	            }
	            if (bulletIndex === lastIndex) {
	              $bullet
	                .next()
	                .addClass(`${params.bulletActiveClass}-next`)
	                .next()
	                .addClass(`${params.bulletActiveClass}-next-next`);
	            }
	          }
	        });
	      } else {
	        const $bullet = bullets.eq(current);
	        const bulletIndex = $bullet.index();
	        $bullet.addClass(params.bulletActiveClass);
	        if (params.dynamicBullets) {
	          const $firstDisplayedBullet = bullets.eq(firstIndex);
	          const $lastDisplayedBullet = bullets.eq(lastIndex);
	          for (let i = firstIndex; i <= lastIndex; i += 1) {
	            bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
	          }
	          if (swiper.params.loop) {
	            if (bulletIndex >= bullets.length - params.dynamicMainBullets) {
	              for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
	                bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
	              }
	              bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
	            } else {
	              $firstDisplayedBullet
	                .prev()
	                .addClass(`${params.bulletActiveClass}-prev`)
	                .prev()
	                .addClass(`${params.bulletActiveClass}-prev-prev`);
	              $lastDisplayedBullet
	                .next()
	                .addClass(`${params.bulletActiveClass}-next`)
	                .next()
	                .addClass(`${params.bulletActiveClass}-next-next`);
	            }
	          } else {
	            $firstDisplayedBullet
	              .prev()
	              .addClass(`${params.bulletActiveClass}-prev`)
	              .prev()
	              .addClass(`${params.bulletActiveClass}-prev-prev`);
	            $lastDisplayedBullet
	              .next()
	              .addClass(`${params.bulletActiveClass}-next`)
	              .next()
	              .addClass(`${params.bulletActiveClass}-next-next`);
	          }
	        }
	      }
	      if (params.dynamicBullets) {
	        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
	        const bulletsOffset = (((swiper.pagination.bulletSize * dynamicBulletsLength) - (swiper.pagination.bulletSize)) / 2) - (midIndex * swiper.pagination.bulletSize);
	        const offsetProp = rtl ? 'right' : 'left';
	        bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
	      }
	    }
	    if (params.type === 'fraction') {
	      $el.find(`.${params.currentClass}`).text(params.formatFractionCurrent(current + 1));
	      $el.find(`.${params.totalClass}`).text(params.formatFractionTotal(total));
	    }
	    if (params.type === 'progressbar') {
	      let progressbarDirection;
	      if (params.progressbarOpposite) {
	        progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
	      } else {
	        progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
	      }
	      const scale = (current + 1) / total;
	      let scaleX = 1;
	      let scaleY = 1;
	      if (progressbarDirection === 'horizontal') {
	        scaleX = scale;
	      } else {
	        scaleY = scale;
	      }
	      $el.find(`.${params.progressbarFillClass}`).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
	    }
	    if (params.type === 'custom' && params.renderCustom) {
	      $el.html(params.renderCustom(swiper, current + 1, total));
	      swiper.emit('paginationRender', swiper, $el[0]);
	    } else {
	      swiper.emit('paginationUpdate', swiper, $el[0]);
	    }
	    $el[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
	  },
	  render() {
	    // Render Container
	    const swiper = this;
	    const params = swiper.params.pagination;
	    if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
	    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;

	    const $el = swiper.pagination.$el;
	    let paginationHTML = '';
	    if (params.type === 'bullets') {
	      const numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - (swiper.loopedSlides * 2)) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
	      for (let i = 0; i < numberOfBullets; i += 1) {
	        if (params.renderBullet) {
	          paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
	        } else {
	          paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
	        }
	      }
	      $el.html(paginationHTML);
	      swiper.pagination.bullets = $el.find(`.${params.bulletClass}`);
	    }
	    if (params.type === 'fraction') {
	      if (params.renderFraction) {
	        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
	      } else {
	        paginationHTML = `<span class="${params.currentClass}"></span>`
	        + ' / '
	        + `<span class="${params.totalClass}"></span>`;
	      }
	      $el.html(paginationHTML);
	    }
	    if (params.type === 'progressbar') {
	      if (params.renderProgressbar) {
	        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
	      } else {
	        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
	      }
	      $el.html(paginationHTML);
	    }
	    if (params.type !== 'custom') {
	      swiper.emit('paginationRender', swiper.pagination.$el[0]);
	    }
	  },
	  init() {
	    const swiper = this;
	    const params = swiper.params.pagination;
	    if (!params.el) return;

	    let $el = $(params.el);
	    if ($el.length === 0) return;

	    if (
	      swiper.params.uniqueNavElements
	      && typeof params.el === 'string'
	      && $el.length > 1
	      && swiper.$el.find(params.el).length === 1
	    ) {
	      $el = swiper.$el.find(params.el);
	    }

	    if (params.type === 'bullets' && params.clickable) {
	      $el.addClass(params.clickableClass);
	    }

	    $el.addClass(params.modifierClass + params.type);

	    if (params.type === 'bullets' && params.dynamicBullets) {
	      $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
	      swiper.pagination.dynamicBulletIndex = 0;
	      if (params.dynamicMainBullets < 1) {
	        params.dynamicMainBullets = 1;
	      }
	    }
	    if (params.type === 'progressbar' && params.progressbarOpposite) {
	      $el.addClass(params.progressbarOppositeClass);
	    }

	    if (params.clickable) {
	      $el.on('click', `.${params.bulletClass}`, function onClick(e) {
	        e.preventDefault();
	        let index = $(this).index() * swiper.params.slidesPerGroup;
	        if (swiper.params.loop) index += swiper.loopedSlides;
	        swiper.slideTo(index);
	      });
	    }

	    Utils.extend(swiper.pagination, {
	      $el,
	      el: $el[0],
	    });
	  },
	  destroy() {
	    const swiper = this;
	    const params = swiper.params.pagination;
	    if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
	    const $el = swiper.pagination.$el;

	    $el.removeClass(params.hiddenClass);
	    $el.removeClass(params.modifierClass + params.type);
	    if (swiper.pagination.bullets) swiper.pagination.bullets.removeClass(params.bulletActiveClass);
	    if (params.clickable) {
	      $el.off('click', `.${params.bulletClass}`);
	    }
	  },
	};

	var pagination = {
	  name: 'pagination',
	  params: {
	    pagination: {
	      el: null,
	      bulletElement: 'span',
	      clickable: false,
	      hideOnClick: false,
	      renderBullet: null,
	      renderProgressbar: null,
	      renderFraction: null,
	      renderCustom: null,
	      progressbarOpposite: false,
	      type: 'bullets', // 'bullets' or 'progressbar' or 'fraction' or 'custom'
	      dynamicBullets: false,
	      dynamicMainBullets: 1,
	      formatFractionCurrent: (number) => number,
	      formatFractionTotal: (number) => number,
	      bulletClass: 'swiper-pagination-bullet',
	      bulletActiveClass: 'swiper-pagination-bullet-active',
	      modifierClass: 'swiper-pagination-', // NEW
	      currentClass: 'swiper-pagination-current',
	      totalClass: 'swiper-pagination-total',
	      hiddenClass: 'swiper-pagination-hidden',
	      progressbarFillClass: 'swiper-pagination-progressbar-fill',
	      progressbarOppositeClass: 'swiper-pagination-progressbar-opposite',
	      clickableClass: 'swiper-pagination-clickable', // NEW
	      lockClass: 'swiper-pagination-lock',
	    },
	  },
	  create() {
	    const swiper = this;
	    Utils.extend(swiper, {
	      pagination: {
	        init: Pagination.init.bind(swiper),
	        render: Pagination.render.bind(swiper),
	        update: Pagination.update.bind(swiper),
	        destroy: Pagination.destroy.bind(swiper),
	        dynamicBulletIndex: 0,
	      },
	    });
	  },
	  on: {
	    init() {
	      const swiper = this;
	      swiper.pagination.init();
	      swiper.pagination.render();
	      swiper.pagination.update();
	    },
	    activeIndexChange() {
	      const swiper = this;
	      if (swiper.params.loop) {
	        swiper.pagination.update();
	      } else if (typeof swiper.snapIndex === 'undefined') {
	        swiper.pagination.update();
	      }
	    },
	    snapIndexChange() {
	      const swiper = this;
	      if (!swiper.params.loop) {
	        swiper.pagination.update();
	      }
	    },
	    slidesLengthChange() {
	      const swiper = this;
	      if (swiper.params.loop) {
	        swiper.pagination.render();
	        swiper.pagination.update();
	      }
	    },
	    snapGridLengthChange() {
	      const swiper = this;
	      if (!swiper.params.loop) {
	        swiper.pagination.render();
	        swiper.pagination.update();
	      }
	    },
	    destroy() {
	      const swiper = this;
	      swiper.pagination.destroy();
	    },
	    click(e) {
	      const swiper = this;
	      if (
	        swiper.params.pagination.el
	        && swiper.params.pagination.hideOnClick
	        && swiper.pagination.$el.length > 0
	        && !$(e.target).hasClass(swiper.params.pagination.bulletClass)
	      ) {
	        const isHidden = swiper.pagination.$el.hasClass(swiper.params.pagination.hiddenClass);
	        if (isHidden === true) {
	          swiper.emit('paginationShow', swiper);
	        } else {
	          swiper.emit('paginationHide', swiper);
	        }
	        swiper.pagination.$el.toggleClass(swiper.params.pagination.hiddenClass);
	      }
	    },
	  },
	};

	const Lazy = {
	  loadInSlide(index, loadInDuplicate = true) {
	    const swiper = this;
	    const params = swiper.params.lazy;
	    if (typeof index === 'undefined') return;
	    if (swiper.slides.length === 0) return;
	    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

	    const $slideEl = isVirtual
	      ? swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`)
	      : swiper.slides.eq(index);

	    let $images = $slideEl.find(`.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`);
	    if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
	      $images = $images.add($slideEl[0]);
	    }
	    if ($images.length === 0) return;

	    $images.each((imageIndex, imageEl) => {
	      const $imageEl = $(imageEl);
	      $imageEl.addClass(params.loadingClass);

	      const background = $imageEl.attr('data-background');
	      const src = $imageEl.attr('data-src');
	      const srcset = $imageEl.attr('data-srcset');
	      const sizes = $imageEl.attr('data-sizes');

	      swiper.loadImage($imageEl[0], (src || background), srcset, sizes, false, () => {
	        if (typeof swiper === 'undefined' || swiper === null || !swiper || (swiper && !swiper.params) || swiper.destroyed) return;
	        if (background) {
	          $imageEl.css('background-image', `url("${background}")`);
	          $imageEl.removeAttr('data-background');
	        } else {
	          if (srcset) {
	            $imageEl.attr('srcset', srcset);
	            $imageEl.removeAttr('data-srcset');
	          }
	          if (sizes) {
	            $imageEl.attr('sizes', sizes);
	            $imageEl.removeAttr('data-sizes');
	          }
	          if (src) {
	            $imageEl.attr('src', src);
	            $imageEl.removeAttr('data-src');
	          }
	        }

	        $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
	        $slideEl.find(`.${params.preloaderClass}`).remove();
	        if (swiper.params.loop && loadInDuplicate) {
	          const slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');
	          if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
	            const originalSlide = swiper.$wrapperEl.children(`[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`);
	            swiper.lazy.loadInSlide(originalSlide.index(), false);
	          } else {
	            const duplicatedSlide = swiper.$wrapperEl.children(`.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`);
	            swiper.lazy.loadInSlide(duplicatedSlide.index(), false);
	          }
	        }
	        swiper.emit('lazyImageReady', $slideEl[0], $imageEl[0]);
	      });

	      swiper.emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
	    });
	  },
	  load() {
	    const swiper = this;
	    const {
	      $wrapperEl, params: swiperParams, slides, activeIndex,
	    } = swiper;
	    const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
	    const params = swiperParams.lazy;

	    let slidesPerView = swiperParams.slidesPerView;
	    if (slidesPerView === 'auto') {
	      slidesPerView = 0;
	    }

	    function slideExist(index) {
	      if (isVirtual) {
	        if ($wrapperEl.children(`.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`).length) {
	          return true;
	        }
	      } else if (slides[index]) return true;
	      return false;
	    }
	    function slideIndex(slideEl) {
	      if (isVirtual) {
	        return $(slideEl).attr('data-swiper-slide-index');
	      }
	      return $(slideEl).index();
	    }

	    if (!swiper.lazy.initialImageLoaded) swiper.lazy.initialImageLoaded = true;
	    if (swiper.params.watchSlidesVisibility) {
	      $wrapperEl.children(`.${swiperParams.slideVisibleClass}`).each((elIndex, slideEl) => {
	        const index = isVirtual ? $(slideEl).attr('data-swiper-slide-index') : $(slideEl).index();
	        swiper.lazy.loadInSlide(index);
	      });
	    } else if (slidesPerView > 1) {
	      for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
	        if (slideExist(i)) swiper.lazy.loadInSlide(i);
	      }
	    } else {
	      swiper.lazy.loadInSlide(activeIndex);
	    }
	    if (params.loadPrevNext) {
	      if (slidesPerView > 1 || (params.loadPrevNextAmount && params.loadPrevNextAmount > 1)) {
	        const amount = params.loadPrevNextAmount;
	        const spv = slidesPerView;
	        const maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
	        const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0);
	        // Next Slides
	        for (let i = activeIndex + slidesPerView; i < maxIndex; i += 1) {
	          if (slideExist(i)) swiper.lazy.loadInSlide(i);
	        }
	        // Prev Slides
	        for (let i = minIndex; i < activeIndex; i += 1) {
	          if (slideExist(i)) swiper.lazy.loadInSlide(i);
	        }
	      } else {
	        const nextSlide = $wrapperEl.children(`.${swiperParams.slideNextClass}`);
	        if (nextSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(nextSlide));

	        const prevSlide = $wrapperEl.children(`.${swiperParams.slidePrevClass}`);
	        if (prevSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(prevSlide));
	      }
	    }
	  },
	};

	var lazy = {
	  name: 'lazy',
	  params: {
	    lazy: {
	      enabled: false,
	      loadPrevNext: false,
	      loadPrevNextAmount: 1,
	      loadOnTransitionStart: false,

	      elementClass: 'swiper-lazy',
	      loadingClass: 'swiper-lazy-loading',
	      loadedClass: 'swiper-lazy-loaded',
	      preloaderClass: 'swiper-lazy-preloader',
	    },
	  },
	  create() {
	    const swiper = this;
	    Utils.extend(swiper, {
	      lazy: {
	        initialImageLoaded: false,
	        load: Lazy.load.bind(swiper),
	        loadInSlide: Lazy.loadInSlide.bind(swiper),
	      },
	    });
	  },
	  on: {
	    beforeInit() {
	      const swiper = this;
	      if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
	        swiper.params.preloadImages = false;
	      }
	    },
	    init() {
	      const swiper = this;
	      if (swiper.params.lazy.enabled && !swiper.params.loop && swiper.params.initialSlide === 0) {
	        swiper.lazy.load();
	      }
	    },
	    scroll() {
	      const swiper = this;
	      if (swiper.params.freeMode && !swiper.params.freeModeSticky) {
	        swiper.lazy.load();
	      }
	    },
	    resize() {
	      const swiper = this;
	      if (swiper.params.lazy.enabled) {
	        swiper.lazy.load();
	      }
	    },
	    scrollbarDragMove() {
	      const swiper = this;
	      if (swiper.params.lazy.enabled) {
	        swiper.lazy.load();
	      }
	    },
	    transitionStart() {
	      const swiper = this;
	      if (swiper.params.lazy.enabled) {
	        if (swiper.params.lazy.loadOnTransitionStart || (!swiper.params.lazy.loadOnTransitionStart && !swiper.lazy.initialImageLoaded)) {
	          swiper.lazy.load();
	        }
	      }
	    },
	    transitionEnd() {
	      const swiper = this;
	      if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
	        swiper.lazy.load();
	      }
	    },
	    slideChange() {
	      const swiper = this;
	      if (swiper.params.lazy.enabled && swiper.params.cssMode) {
	        swiper.lazy.load();
	      }
	    },
	  },
	};

	// Swiper Class

	const components = [
	  Device$1,
	  Support$1,
	  Browser$1,
	  Resize,
	  Observer$1,
	  
	];

	if (typeof Swiper.use === 'undefined') {
	  Swiper.use = Swiper.Class.use;
	  Swiper.installModule = Swiper.Class.installModule;
	}

	Swiper.use(components);

	Swiper.use([keyboard, pagination, lazy]);
	class LaymicSlider {
	    constructor(el, builder, states) {
	        // 現在のviewType文字列
	        this.viewType = "horizontal2p";
	        this.el = el;
	        this.builder = builder;
	        this.state = states;
	        // 強制2p表示する条件が揃っていれば2p表示で初期化する
	        const conf = (this.state.isDoubleSlideHorizView)
	            ? this.swiper2pHorizViewConf
	            : this.swiper1pHorizViewConf;
	        this.swiper = new Swiper(this.el.swiperEl, conf);
	    }
	    get activeIdx() {
	        return this.swiper.activeIndex;
	    }
	    get swiper1pHorizViewConf() {
	        return {
	            direction: "horizontal",
	            speed: 200,
	            slidesPerView: 1,
	            slidesPerGroup: 1,
	            spaceBetween: this.state.horizPageMargin,
	            pagination: {
	                el: ".swiper-pagination",
	                type: "progressbar",
	            },
	            keyboard: true,
	            preloadImages: false,
	            lazy: {
	                loadPrevNext: true,
	                loadPrevNextAmount: 4,
	            },
	        };
	    }
	    get swiper2pHorizViewConf() {
	        const conf = this.swiper1pHorizViewConf;
	        const patch = {
	            slidesPerView: 2,
	            slidesPerGroup: 2
	        };
	        return Object.assign(conf, patch);
	    }
	    get swiperVertViewConf() {
	        const conf = this.swiper1pHorizViewConf;
	        const patch = {
	            direction: "vertical",
	            spaceBetween: this.state.vertPageMargin,
	            freeMode: true,
	            freeModeMomentumRatio: 0.36,
	            freeModeMomentumVelocityRatio: 1,
	            freeModeMinimumVelocity: 0.02,
	        };
	        return Object.assign(conf, patch);
	    }
	    toggleVerticalView() {
	        if (!this.state.isVertView) {
	            this.enableVerticalView();
	        }
	        else {
	            this.disableVerticalView();
	        }
	        // 縦読みトグル時にはビューワーUIを隠す
	        this.hideViewerUI();
	    }
	    /**
	     * 縦読み表示へと切り替える
	     * @param isViewerOpened ビューワーが開かれているか否かの状態を指定。falseならば一部処理を呼び出さない
	     */
	    enableVerticalView(isViewerOpened = true) {
	        const vertView = this.builder.stateNames.vertView;
	        this.state.isVertView = true;
	        this.el.rootEl.classList.add(vertView);
	        const isFirstSlideEmpty = this.state.isFirstSlideEmpty;
	        // 横読み2p解像度、またはモバイル横表示か否かのbool
	        const isDS = this.state.isDoubleSlideWidth || this.state.isMobile2pView;
	        const activeIdx = this.swiper.activeIndex;
	        // 横読み2p表示を行う解像度であり、
	        // 一番目に空要素を入れる設定が有効な場合はindex数値を1減らす
	        const idx = (isDS && isFirstSlideEmpty)
	            ? activeIdx - 1
	            : activeIdx;
	        this.switchSingleSlideState(false);
	        // 読み進めたページ数を引き継ぎつつ再初期化
	        this.reinitSwiperInstance(this.swiperVertViewConf, idx, isViewerOpened).then(() => {
	            // そのままだと半端なスクロール状態になるので
	            // 再度スクロールをかけておく
	            this.slideTo(idx, 0);
	        });
	    }
	    /**
	     * 横読み表示へと切り替える
	     */
	    disableVerticalView() {
	        const vertView = this.builder.stateNames.vertView;
	        this.state.isVertView = false;
	        this.el.rootEl.classList.remove(vertView);
	        const { isFirstSlideEmpty, isDoubleSlideHorizView: isDSHV, } = this.state;
	        // emptySlideを追加する前にactiveIndexを取得しておく
	        const activeIdx = this.swiper.activeIndex;
	        this.switchSingleSlideState(false);
	        // 横読み2p表示を行う状態であり、
	        // 一番目に空要素を入れる設定が有効な場合はindex数値を1増やす
	        const idx = (isDSHV && isFirstSlideEmpty)
	            ? activeIdx + 1
	            : activeIdx;
	        // 読み進めたページ数を引き継ぎつつ再初期化
	        // スマホ横持ち対策を暫定的に行っておく
	        const conf = (isDSHV)
	            ? this.swiper2pHorizViewConf
	            : this.swiper1pHorizViewConf;
	        this.reinitSwiperInstance(conf, idx).then(() => {
	            this.swiper.slideTo(idx, 0);
	        });
	    }
	    /**
	     * swiper instanceを再初期化する
	     * async関数なので戻り値のpromiseから「swiper最初期化後の処理」を行える
	     *
	     * @param  swiperConf     初期化時に指定するswiperOption
	     * @param  idx            初期化時に指定するindex数値
	     * @param  isViewerOpened ビューワーが開いているか否か
	     */
	    async reinitSwiperInstance(swiperConf, idx, isViewerOpened = true) {
	        // デフォルトではswiper現在インデックス数値か0を指定する
	        let initIdx = (this.swiper) ? this.swiper.activeIndex : 0;
	        // 引数idxが入力されていれば上書き
	        if (idx)
	            initIdx = idx;
	        const conf = Object.assign(swiperConf, {
	            initialSlide: initIdx
	        });
	        // swiperインスタンスを一旦破棄してからre-init
	        this.swiper.destroy(true, true);
	        this.swiper = new Swiper(this.el.swiperEl, conf);
	        // viewTypeの更新
	        this.updateViewType();
	        // ビューワーが開かれている際にのみ動かす処理
	        if (isViewerOpened) {
	            // イベントを登録
	            this.attachSwiperEvents();
	            // lazyload指定
	            if (this.swiper.lazy)
	                this.swiper.lazy.load();
	            // 表示調整イベント発火
	            this.dispatchViewUpdate();
	        }
	    }
	    /**
	     * 横読みビューワーでの2p/1p表示切り替えを行う
	     */
	    switchHorizViewSize() {
	        const { isVertView, isFirstSlideEmpty, isDoubleSlideHorizView: isDSHV } = this.state;
	        // すでに表示切り替え済みの場合はスキップ
	        const isSkip = isDSHV && this.viewType === "horizontal2p" || !isDSHV && this.viewType === "horizontal1p";
	        // 縦読みモード、
	        // またはスキップ条件を満たしている場合は早期リターン
	        if (isVertView || isSkip)
	            return;
	        let idx = this.activeIdx;
	        if (isDSHV && isFirstSlideEmpty) {
	            idx += 1;
	        }
	        else if (isFirstSlideEmpty && idx > 0) {
	            idx -= 1;
	        }
	        this.switchSingleSlideState(false);
	        const conf = (isDSHV)
	            ? this.swiper2pHorizViewConf
	            : this.swiper1pHorizViewConf;
	        this.reinitSwiperInstance(conf, idx).then(() => {
	            this.dispatchViewUpdate();
	        });
	    }
	    /**
	     * 画面幅に応じて、横読み時の
	     * 「1p表示 <-> 2p表示」を切り替える
	     * @param isUpdateSwiper swiper.update()を行うか否か
	     */
	    switchSingleSlideState(isUpdateSwiper = true) {
	        // swiperが初期化されていないなら早期リターン
	        if (!this.swiper)
	            return;
	        const rootEl = this.el.rootEl;
	        const stateName = this.builder.stateNames.singleSlide;
	        if (this.state.isDoubleSlideHorizView) {
	            // 横読み時2p表示
	            this.addEmptySlide();
	            rootEl.classList.remove(stateName);
	        }
	        else {
	            // 横読み時1p表示
	            this.removeEmptySlide();
	            rootEl.classList.add(stateName);
	        }
	        if (isUpdateSwiper)
	            this.swiper.update();
	    }
	    /**
	     * mangaViewer画面をクリックした際のイベントハンドラ
	     *
	     * クリック判定基準についてはgetClickPoint()を参照のこと
	     *
	     * @param  e  mouse event
	     */
	    slideClickHandler(e) {
	        const [isNextClick, isPrevClick] = this.getClickPoint(e);
	        if (isNextClick && !this.swiper.isEnd) {
	            // 進めるページがある状態で進む側をクリックした際の処理
	            this.slideNext();
	            this.hideViewerUI();
	        }
	        else if (isPrevClick && !this.swiper.isBeginning) {
	            // 戻れるページがある状態で戻る側をクリックした際の処理
	            this.slidePrev();
	            this.hideViewerUI();
	        }
	        else {
	            this.toggleViewerUI();
	        }
	    }
	    /**
	     * クリックポイント上にマウス座標が重なっていたならマウスホバー処理を行う
	     * @param  e  mouse event
	     */
	    slideMouseHoverHandler(e) {
	        const [isNextClick, isPrevClick] = this.getClickPoint(e);
	        const { nextPage, prevPage } = this.el.buttons;
	        const active = this.builder.stateNames.active;
	        const { controllerEl, swiperEl } = this.el;
	        /**
	         * swiperElとcontrollerElにおける
	         * カーソル状態を一括設定する
	         * @param isPointer trueならばポインターが乗っかっている状態とみなす
	         */
	        const setCursorStyle = (isPointer) => {
	            const cursor = (isPointer) ? "pointer" : "";
	            controllerEl.style.cursor = cursor;
	            swiperEl.style.cursor = cursor;
	        };
	        let isCursorPointer = true;
	        if (isNextClick && !this.swiper.isEnd) {
	            // 進めるページがある状態で進む側クリックポイントと重なった際の処理
	            nextPage.classList.add(active);
	        }
	        else if (isPrevClick && !this.swiper.isBeginning) {
	            // 戻れるページがある状態で戻る側クリックポイントと重なった際の処理
	            prevPage.classList.add(active);
	        }
	        else {
	            // どちらでもない場合の処理
	            nextPage.classList.remove(active);
	            prevPage.classList.remove(active);
	            isCursorPointer = false;
	        }
	        setCursorStyle(isCursorPointer);
	    }
	    /**
	     * swiper各種イベントを無効化する
	     */
	    detachSwiperEvents() {
	        const detachEvents = [
	            "resize",
	            "reachBeginning",
	            "slideChange"
	        ];
	        detachEvents.forEach(evName => this.swiper.off(evName));
	        // キーボード操作を止める
	        this.disableSwiperKeyboardEvent();
	    }
	    /**
	     * swiper各種イベントを有効化する
	     */
	    attachSwiperEvents() {
	        const attachEvents = [
	            {
	                name: "resize",
	                handler: this.swiperResizeHandler
	            },
	            {
	                name: "reachBeginning",
	                handler: this.swiperReachBeginningHandler,
	            },
	            {
	                name: "slideChange",
	                handler: this.swiperSlideChangeHandler,
	            }
	        ];
	        // イベント受け付けを再開させる
	        attachEvents.forEach(ev => this.swiper.on(ev.name, ev.handler.bind(this)));
	        // キーボード操作が止まっている場合はキーボード操作を再開させる
	        this.enableSwiperKeyboardEvent();
	    }
	    /**
	     * ビューワー操作UIをトグルさせる
	     */
	    toggleViewerUI() {
	        this.el.rootEl.classList.toggle(this.builder.stateNames.visibleUI);
	    }
	    /**
	     * ビューワー操作UIを非表示化する
	     */
	    hideViewerUI() {
	        const stateName = this.builder.stateNames.visibleUI;
	        if (this.el.rootEl.classList.contains(stateName)) {
	            this.el.rootEl.classList.remove(stateName);
	        }
	    }
	    loadLazyImg() {
	        if (this.swiper.lazy) {
	            this.swiper.lazy.load();
	        }
	    }
	    /**
	     * orientationcange eventに登録する処理
	     */
	    orientationChange() {
	        const { isVertView, isMobile } = this.state;
	        // PC、または縦読みモード、
	        // または強制2p表示が無効化されている場合は早期リターン
	        if (!isMobile || isVertView)
	            return;
	        this.switchHorizViewSize();
	    }
	    slideTo(idx, speed) {
	        this.swiper.slideTo(idx, speed);
	    }
	    /**
	     * 一つ前のスライドを表示する
	     * swiper.slidePrev()には
	     * 特定状況下で0番スライドに巻き戻る不具合が
	     * 存在するようなので、slideTo()を用いて手動で動かしている
	     *
	     * @param  speed アニメーション速度
	     */
	    slidePrev(speed) {
	        const idx = this.activeIdx;
	        const prevIdx = (idx > 0) ? idx - 1 : 0;
	        this.swiper.slideTo(prevIdx, speed);
	    }
	    slideNext(speed) {
	        this.swiper.slideNext(speed);
	    }
	    /**
	    * viewType文字列を更新する。
	    * 更新タイミングを手動で操作して、viewer状態評価を遅延させる
	    */
	    updateViewType() {
	        const { isDoubleSlideHorizView: isDSHV, isVertView } = this.state;
	        let viewType = (isDSHV)
	            ? "horizontal2p"
	            : "horizontal1p";
	        if (isVertView)
	            viewType = "vertical";
	        this.viewType = viewType;
	    }
	    /**
	     * viewUpdate()を呼び出すイベントを発火させる
	     */
	    dispatchViewUpdate() {
	        const ev = new CustomEvent("LaymicViewUpdate");
	        this.el.rootEl.dispatchEvent(ev);
	    }
	    /**
	     * statesの値に応じて空白スライドを追加する
	     * isFirstSlideEmpty有効時: 0番空白スライドを追加
	     * isAppendEmptySlide有効時: 最終空白スライドを追加
	     */
	    addEmptySlide() {
	        const { isFirstSlideEmpty, isAppendEmptySlide } = this.state;
	        if (this.swiper.slides.length === 0 || !isFirstSlideEmpty && !isAppendEmptySlide)
	            return;
	        const emptySlide = this.builder.classNames.emptySlide;
	        let isPrependSlide = false;
	        let isAppendSlide = false;
	        if (isFirstSlideEmpty) {
	            const firstSlide = this.swiper.slides[0];
	            const hasFirstEmptySlide = firstSlide.classList.contains(emptySlide);
	            if (!hasFirstEmptySlide) {
	                isPrependSlide = true;
	            }
	        }
	        const lastIdx = this.swiper.slides.length - 1;
	        if (isAppendEmptySlide) {
	            const lastSlide = this.swiper.slides[lastIdx];
	            const hasLastEmptySlide = lastSlide.classList.contains(emptySlide);
	            if (!hasLastEmptySlide) {
	                isAppendSlide = true;
	            }
	        }
	        if (isPrependSlide) {
	            this.swiper.prependSlide(this.builder.createEmptySlideEl());
	        }
	        if (isAppendSlide) {
	            this.swiper.appendSlide(this.builder.createEmptySlideEl());
	        }
	    }
	    /**
	     * statesの値に応じて空白スライドを消去する
	     * isFirstSlideEmpty有効時: 0番空白スライドを消去
	     * isAppendEmptySlide有効時: 最終空白スライドを消去
	     */
	    removeEmptySlide() {
	        const { isFirstSlideEmpty, isAppendEmptySlide } = this.state;
	        if (this.swiper.slides.length === 0 || !isFirstSlideEmpty && !isAppendEmptySlide)
	            return;
	        const removeIdxs = [];
	        const emptySlide = this.builder.classNames.emptySlide;
	        if (isFirstSlideEmpty) {
	            const firstSlide = this.swiper.slides[0];
	            const hasFirstEmptySlide = firstSlide.classList.contains(emptySlide);
	            if (hasFirstEmptySlide)
	                removeIdxs.push(0);
	        }
	        if (isAppendEmptySlide) {
	            const lastIdx = this.swiper.slides.length - 1;
	            const lastSlide = this.swiper.slides[lastIdx];
	            const hasLastEmptySlide = lastSlide.classList.contains(emptySlide);
	            if (hasLastEmptySlide)
	                removeIdxs.push(lastIdx);
	        }
	        if (removeIdxs.length > 0) {
	            this.swiper.removeSlide(removeIdxs);
	        }
	    }
	    /**
	     * 入力したMouseEventが
	     * mangaViewer画面のクリックポイントに重なっているかを返す
	     *
	     * 横読み時   : 左側クリックで進む、右側クリックで戻る
	     * 横読みLTR時: 右側クリックで進む、左側クリックで戻る
	     * 縦読み時   : 下側クリックで進む、上側クリックで戻る
	     *
	     * @param  e mouse event
	     * @return   [次に進むクリックポイントに重なっているか, 前に戻るクリックポイントに重なっているか]
	     */
	    getClickPoint(e) {
	        const { l, t, w, h } = this.state.rootRect;
	        const [x, y] = [e.clientX - l, e.clientY - t];
	        let [isNextClick, isPrevClick] = [false, false];
	        if (this.state.isVertView) {
	            // 縦読み時処理
	            isNextClick = y > h * 0.80;
	            isPrevClick = y < h * 0.20;
	        }
	        else if (this.state.isLTR) {
	            // 横読みLTR時処理
	            isNextClick = x > w * 0.80;
	            isPrevClick = x < w * 0.20;
	        }
	        else {
	            // 通常横読み時処理
	            isNextClick = x < w * 0.20;
	            isPrevClick = x > w * 0.80;
	        }
	        return [isNextClick, isPrevClick];
	    }
	    /**
	     * swiper側リサイズイベントに登録するハンドラ
	     * open(), close()のタイミングで切り替えるために分離
	     */
	    swiperResizeHandler() {
	        if (!this.state.isVertView) {
	            this.switchHorizViewSize();
	        }
	        this.dispatchViewUpdate();
	    }
	    /**
	     * swiper側reachBeginningイベントに登録するハンドラ
	     */
	    swiperReachBeginningHandler() {
	        this.changePaginationVisibility();
	    }
	    /**
	     * swiper側slideChangeイベントに登録するハンドラ
	     */
	    swiperSlideChangeHandler() {
	        this.hideViewerUI();
	        this.changePaginationVisibility();
	    }
	    /**
	     * ページ送りボタンの表示/非表示設定を切り替えるハンドラ
	     *
	     * disablePagination()で強制非表示化がなされている場合は
	     * どうあがいても非表示となる
	     */
	    changePaginationVisibility() {
	        const hidden = this.builder.stateNames.hidden;
	        const { prevPage, nextPage } = this.el.buttons;
	        const { isBeginning, isEnd } = this.swiper;
	        if (isBeginning) {
	            prevPage.classList.add(hidden);
	        }
	        else {
	            prevPage.classList.remove(hidden);
	        }
	        if (isEnd) {
	            nextPage.classList.add(hidden);
	        }
	        else {
	            nextPage.classList.remove(hidden);
	        }
	    }
	    enableSwiperKeyboardEvent() {
	        if (this.swiper.keyboard && !this.swiper.keyboard.enabled) {
	            this.swiper.keyboard.enable();
	        }
	    }
	    disableSwiperKeyboardEvent() {
	        if (this.swiper.keyboard) {
	            this.swiper.keyboard.disable();
	        }
	    }
	}

	class Laymic {
	    constructor(laymicPages, options = {}) {
	        // mangaViewer内部で用いるステートまとめ
	        this.state = new LaymicStates();
	        // 初期化引数を保管
	        this.initOptions = options;
	        const builder = new DOMBuilder(options.icons, options.classNames, options.stateNames);
	        const rootEl = builder.createDiv();
	        const { stateNames, classNames } = builder;
	        this.builder = builder;
	        const [pages, thumbPages] = (isLaymicPages(laymicPages))
	            ? [laymicPages.pages, laymicPages.thumbs || []]
	            : [laymicPages, []];
	        // 一つのページにつき一度だけの処理
	        if (this.state.viewerIdx === 0) {
	            // svgコンテナは一度だけ追加する
	            const svgCtn = builder.createSVGIcons();
	            document.body.appendChild(svgCtn);
	            // 向き変更イベント自体は一度のみ登録する
	            window.addEventListener("orientationchange", () => orientationChangeHandler());
	        }
	        if (options.pageWidth && options.pageHeight) {
	            // ページサイズ数値が指定されていた場合の処理
	            const [pw, ph] = [options.pageWidth, options.pageHeight];
	            this.state.setPageSize(pw, ph);
	        }
	        this.preference = new LaymicPreference(builder, rootEl);
	        // NOTE: isDisabledForceHorizViewだけ先んじて適用
	        const preferenceData = this.preference.loadPreferenceData();
	        this.state.isDisabledForceHorizView = preferenceData.isDisabledForceHorizView;
	        // 省略表記だとバグが起きそうなので
	        // undefinedでないかだけ確認する
	        if (options.isLTR !== void 0)
	            this.state.isLTR = options.isLTR;
	        if (options.vertPageMargin !== void 0)
	            this.state.vertPageMargin = options.vertPageMargin;
	        if (options.horizPageMargin !== void 0)
	            this.state.horizPageMargin = options.horizPageMargin;
	        if (options.isFirstSlideEmpty !== void 0)
	            this.state.isFirstSlideEmpty = options.isFirstSlideEmpty;
	        if (options.viewerPadding !== void 0)
	            this.state.viewerPadding = options.viewerPadding;
	        if (options.isInstantOpen !== void 0)
	            this.state.isInstantOpen = options.isInstantOpen;
	        // ここからは省略表記で存在確認
	        if (options.viewerId)
	            this.state.viewerId = options.viewerId;
	        // 開始スライドへの空白追加設定の場合はページ数+1で数える
	        const pagesLen = (this.state.isFirstSlideEmpty)
	            ? pages.length + 1
	            : pages.length;
	        if (options.isAppendEmptySlide === false || !(pagesLen % 2)) {
	            // 最終スライドへの空白追加
	            // 強制的にオフ設定がなされているか
	            // 合計ページ数が偶数の場合はスライドを追加しない
	            this.state.isAppendEmptySlide = false;
	        }
	        this.thumbs = new LaymicThumbnails(builder, rootEl, pages, thumbPages, this.state);
	        this.help = new LaymicHelp(builder, rootEl);
	        this.zoom = new LaymicZoom(builder, rootEl, this.preference);
	        // 画像読み込みなどを防ぐため初期状態ではdisplay: noneにしておく
	        rootEl.style.display = "none";
	        rootEl.classList.add(classNames.root, stateNames.visibleUI);
	        if (this.state.isLTR)
	            rootEl.classList.add(stateNames.ltr);
	        if (this.state.isMobile)
	            rootEl.classList.add(stateNames.mobile);
	        // fullscreen非対応なら全画面ボタンを非表示化する
	        if (!screenfull.isEnabled)
	            rootEl.classList.add(stateNames.unsupportedFullscreen);
	        const [controllerEl, uiButtons] = builder.createViewerController();
	        const swiperEl = builder.createSwiperContainer(pages, this.state.isLTR, this.state.isFirstSlideEmpty, this.state.isAppendEmptySlide);
	        [
	            controllerEl,
	            swiperEl,
	            this.thumbs.el,
	            this.preference.el,
	            this.help.el,
	        ].forEach(el => this.zoom.wrapper.appendChild(el));
	        rootEl.appendChild(this.zoom.wrapper);
	        controllerEl.appendChild(this.zoom.controller);
	        this.el = {
	            rootEl,
	            swiperEl,
	            controllerEl,
	            buttons: uiButtons,
	        };
	        this.cssVar = new LaymicCSSVariables(this.el, this.state);
	        // 各種css変数の更新
	        this.cssVar.initCSSVars();
	        // 一旦DOMから外していたroot要素を再度放り込む
	        document.body.appendChild(this.el.rootEl);
	        // swiper管理クラスの追加
	        this.slider = new LaymicSlider(this.el, this.builder, this.state);
	        // ビューワー方向の初期値が縦読みの場合はそれを表示
	        if (options.viewerDirection === "vertical")
	            this.slider.enableVerticalView(false);
	        // 各種イベントの登録
	        this.applyEventListeners();
	        // location.hashにmangaViewerIdと同値が指定されている場合は
	        // 即座に開く
	        if (this.state.isInstantOpen && location.hash === "#" + this.state.viewerId) {
	            this.open(true);
	        }
	    }
	    /**
	     * オーバーレイ表示を展開させる
	     * @param  isDisabledFullscreen trueならば全画面化処理を無効化する
	     */
	    open(isDisabledFullscreen = false) {
	        const isFullscreen = !isDisabledFullscreen && this.preference.isAutoFullscreen;
	        // ページ読み込み後一度目の展開時にのみtrue
	        const isInitialOpen = this.el.rootEl.style.display === "none";
	        // display:none状態の場合でだけ動く部分
	        if (isInitialOpen) {
	            this.el.rootEl.style.display = "";
	            sleep(5).then(() => {
	                // slideが追加された後に処理を行う必要があるため
	                // sleepを噛ませて非同期処理とする
	                this.slider.switchSingleSlideState();
	            });
	        }
	        // preferenceかinitOptionの値を適用する
	        this.preference.applyPreferenceValues();
	        this.slider.attachSwiperEvents();
	        // 全画面化条件を満たしているなら全画面化
	        if (isFullscreen) {
	            // 全画面化ハンドラ内部で呼び出されているので
	            // this.viewUpdate()は不要
	            this.toggleFullscreen();
	        }
	        else {
	            // 全画面化しない場合は表示更新のみ行う
	            this.viewUpdate();
	        }
	        // オーバーレイ要素の表示
	        this.showRootEl();
	        // オーバーレイ下要素のスクロール停止
	        this.disableBodyScroll();
	        // swiperのfreeModeには
	        // 「lazyloadとfreeModeを併用した際初期画像の読み込みが行われない」
	        // 不具合があるようなので手動で画像読み込み
	        if (this.state.isVertView && this.slider.activeIdx === 0) {
	            this.slider.loadLazyImg();
	        }
	        // 履歴を追加せずにhash値を書き換える
	        if (this.state.isInstantOpen) {
	            const newUrl = excludeHashLocation() + "#" + this.state.viewerId;
	            window.location.replace(newUrl);
	        }
	        // アクティブ状態に変更
	        this.state.isActive = true;
	    }
	    /**
	     * オーバーレイ表示を閉じる
	     */
	    close() {
	        this.hideRootEl();
	        // 非表示時はイベントを受付させない
	        this.slider.detachSwiperEvents();
	        // フルスクリーン状態にあるならそれを解除
	        if (document.fullscreenElement) {
	            this.toggleFullscreen();
	        }
	        // オーバーレイ下要素のスクロール再開
	        this.enableBodyScroll();
	        if (this.state.isInstantOpen
	            && location.hash) {
	            // 履歴を残さずhashを削除する
	            const newUrl = excludeHashLocation() + "#";
	            window.location.replace(newUrl);
	        }
	        // 非アクティブ状態に変更
	        this.state.isActive = false;
	    }
	    laymicPreferenceUpdateHandler(e) {
	        if (e.detail === "progressBarWidth") {
	            // progressBarWidth数値を取得する
	            const w = this.preference.getBarWidth(this.preference.progressBarWidth);
	            this.state.progressBarWidth = w;
	            // 設定した値を画面に適用する
	            this.cssVar.updateProgressBarWidth();
	            this.viewUpdate();
	        }
	        else if (e.detail === "paginationVisibility") {
	            // ページ送り表示設定
	            // pagination visibility
	            const pv = this.preference.paginationVisibility;
	            // isVisiblePagination
	            const isVP = this.initOptions.isVisiblePagination;
	            const isVisible = pv === "visible" || pv !== "hidden" && isVP;
	            const vpClass = this.builder.stateNames.visiblePagination;
	            if (isVisible) {
	                this.el.rootEl.classList.add(vpClass);
	            }
	            else {
	                this.el.rootEl.classList.remove(vpClass);
	            }
	        }
	        else if (e.detail === "isDisabledTapSlidePage") {
	            // タップでのページ送りを停止する設定
	            if (this.state.isMobile && this.preference.isDisabledTapSlidePage) {
	                // モバイル環境で設定値がtrueの際にのみ動作
	                this.disablePagination();
	            }
	            else {
	                this.enablePagination();
	            }
	        }
	        else if (e.detail === "isDisabledForceHorizView") {
	            // LaymicStateの値を書き換え
	            this.state.isDisabledForceHorizView = this.preference.isDisabledForceHorizView;
	            this.slider.orientationChange();
	        }
	    }
	    /**
	     * 各種イベントの登録
	     * インスタンス生成時に一度だけ呼び出されることを想定
	     */
	    applyEventListeners() {
	        this.el.buttons.help.addEventListener("click", () => {
	            this.help.show();
	            this.slider.hideViewerUI();
	        });
	        // 縦読み/横読み切り替えボタン
	        this.el.buttons.direction.addEventListener("click", () => {
	            this.slider.toggleVerticalView();
	        });
	        // サムネイル表示ボタン
	        this.el.buttons.thumbs.addEventListener("click", () => {
	            this.thumbs.show();
	            this.slider.hideViewerUI();
	        });
	        // サムネイルのクリックイベント
	        // 各サムネイルとswiper各スライドとを紐づける
	        this.thumbs.thumbEls.forEach((el, i) => el.addEventListener("click", () => {
	            this.thumbs.hide();
	            this.slider.slideTo(i);
	        }));
	        // ズームボタンのクリックイベント
	        this.el.buttons.zoom.addEventListener("click", () => {
	            if (this.zoom.isZoomed) {
	                // ズーム時
	                this.zoom.disable();
	            }
	            else {
	                // 非ズーム時
	                const ratio = this.preference.zoomButtonRatio;
	                this.zoom.enable(ratio);
	            }
	            this.slider.hideViewerUI();
	        });
	        // 全画面化ボタンのクリックイベント
	        this.el.buttons.fullscreen.addEventListener("click", () => {
	            this.toggleFullscreen();
	        });
	        // 設定ボタンのクリックイベント
	        this.el.buttons.preference.addEventListener("click", () => {
	            this.preference.show();
	            // UIを閉じておく
	            this.slider.hideViewerUI();
	        });
	        // オーバーレイ終了ボタンのクリックイベント
	        this.el.buttons.close.addEventListener("click", () => {
	            this.close();
	        });
	        this.el.buttons.nextPage.addEventListener("click", () => {
	            this.slider.slideNext();
	        });
	        this.el.buttons.prevPage.addEventListener("click", () => {
	            this.slider.slidePrev();
	        });
	        // swiperElと周囲余白にあたるcontrollerElへの各種イベント登録
	        [
	            this.el.swiperEl,
	            this.el.controllerEl
	        ].forEach(el => {
	            // クリック時のイベント
	            el.addEventListener("click", e => {
	                if (this.state.isMobile && this.preference.isDisabledTapSlidePage) {
	                    // モバイルブラウザでのタップページ送り無効化設定時は
	                    // viewerUIのトグルだけ行う
	                    this.slider.toggleViewerUI();
	                }
	                else {
	                    this.slider.slideClickHandler(e);
	                }
	            });
	            // マウス操作時のイベント
	            el.addEventListener("mousemove", rafThrottle(e => {
	                this.slider.slideMouseHoverHandler(e);
	            }));
	            // マウスホイールでのイベント
	            // swiper純正のマウスホイール処理は動作がすっとろいので自作
	            el.addEventListener("wheel", rafThrottle(e => {
	                // 上下ホイール判定
	                // || RTL時の左右ホイール判定
	                // || LTR時の左右ホイール判定
	                const isNext = e.deltaY > 0
	                    || !this.state.isLTR && e.deltaX < 0
	                    || this.state.isLTR && e.deltaX > 0;
	                const isPrev = e.deltaY < 0
	                    || !this.state.isLTR && e.deltaX > 0
	                    || this.state.isLTR && e.deltaX < 0;
	                if (isNext) {
	                    // 進む
	                    this.slider.slideNext();
	                }
	                else if (isPrev) {
	                    // 戻る
	                    this.slider.slidePrev();
	                }
	            }));
	            if (this.state.isMobile) {
	                el.addEventListener("touchstart", e => {
	                    this.zoom.updatePastDistance(e);
	                });
	                el.addEventListener("touchmove", rafThrottle(e => {
	                    // マルチタッチでない場合と全画面状態でない場合は早期リターン
	                    if (!isMultiTouch(e))
	                        return;
	                    // フルスクリーン時は自前でのズームを行い、
	                    // そうでない際は内部のscale値だけ加算させる
	                    this.zoom.pinchZoom(e);
	                }));
	                el.addEventListener("touchend", () => {
	                    // 自前ズームかデバイス側ズームがなされている場合
	                    // zoomControllerを表出させる
	                    if (this.zoom.isZoomed) {
	                        this.zoom.enableController();
	                        this.slider.hideViewerUI();
	                    }
	                });
	            }
	        });
	        this.el.rootEl.addEventListener("fullscreenchange", () => this.fullscreenChange());
	        // ユーザビリティのため「クリックしても何も起きない」
	        // 場所ではイベント伝播を停止させる
	        Array.from(this.el.controllerEl.children).forEach(el => el.addEventListener("click", e => e.stopPropagation()));
	        // カスタムイベント登録
	        this.el.rootEl.addEventListener("LaymicPreferenceUpdate", ((e) => this.laymicPreferenceUpdateHandler(e)));
	        this.el.rootEl.addEventListener("LaymicViewUpdate", rafThrottle(() => {
	            // "LaymicViewUpdate" eventが発火した際には
	            // viewUpdate()関数を呼び出す
	            this.viewUpdate();
	        }));
	        // orientationchangeイベント登録
	        orientationChangeFuncs.push(this.slider.orientationChange.bind(this.slider));
	    }
	    /**
	     * mangaViewer表示を更新する
	     * 主にswiperの表示を更新するための関数
	     */
	    viewUpdate() {
	        if (this.el)
	            this.updateRootElRect();
	        if (this.cssVar) {
	            // フルスクリーン時にjsVhの再計算をしないと
	            // rootElのheight値がズレる
	            this.cssVar.updateJsVh();
	            this.cssVar.updatePageSize();
	            this.cssVar.updatePageScaleRatio();
	        }
	        if (this.thumbs)
	            this.thumbs.cssThumbsWrapperWidthUpdate(this.el.rootEl);
	        if (this.zoom)
	            this.zoom.updateZoomRect();
	        if (this.slider.swiper)
	            this.slider.swiper.update();
	    }
	    /**
	     * 全画面化ボタンのイベントハンドラ
	     *
	     * 非全画面状態ならば全画面化させて、
	     * 全画面状態であるならそれを解除する
	     */
	    toggleFullscreen() {
	        // フルスクリーン切り替え後に呼び出される関数
	        const postToggleFullscreen = () => {
	            this.slider.slideTo(this.slider.activeIdx);
	            this.viewUpdate();
	        };
	        if (screenfull.isEnabled) {
	            screenfull.toggle(this.el.rootEl)
	                // フルスクリーン切り替え後処理
	                .then(() => postToggleFullscreen());
	        }
	    }
	    /**
	     * mangaViewerと紐付いたrootElを表示する
	     */
	    showRootEl() {
	        this.el.rootEl.style.opacity = "1";
	        this.el.rootEl.style.visibility = "visible";
	    }
	    /**
	     * mangaViewerと紐付いたrootElを非表示にする
	     */
	    hideRootEl() {
	        this.el.rootEl.style.opacity = "";
	        this.el.rootEl.style.visibility = "";
	    }
	    /**
	     * body要素のスクロールを停止させる
	     */
	    disableBodyScroll() {
	        const docEl = document.documentElement;
	        this.state.bodyScrollTop = docEl.scrollTop;
	        docEl.style.overflowY = "hidden";
	        document.body.style.overflowY = "hidden";
	    }
	    /**
	     * body要素のスクロールを再開させる
	     */
	    enableBodyScroll() {
	        const docEl = document.documentElement;
	        docEl.style.overflowY = "";
	        document.body.style.overflowY = "";
	        sleep(1).then(() => {
	            // 次のプロセスへと移してから
	            // スクロール状況を復帰させる
	            docEl.scrollTop = this.state.bodyScrollTop;
	        });
	    }
	    /**
	     * ページ送りボタンを強制的非表示化する
	     * ステート状態をいじるのはバグの元なので直書きで非表示化する
	     */
	    disablePagination() {
	        const { prevPage, nextPage } = this.el.buttons;
	        prevPage.style.display = "none";
	        nextPage.style.display = "none";
	    }
	    /**
	     * ページ送りボタン強制的非表示化を解除する
	     * 直書きでのstyle付与を無くす
	     */
	    enablePagination() {
	        const { prevPage, nextPage } = this.el.buttons;
	        prevPage.style.display = "";
	        nextPage.style.display = "";
	    }
	    /**
	     * fullscreenchangeイベントに登録する処理
	     * もしscreenfullのapiを通さず全画面状態が解除されても、
	     * 最低限の見た目だけは整えるために分離
	     */
	    fullscreenChange() {
	        const fsClass = this.builder.stateNames.fullscreen;
	        if (document.fullscreenElement) {
	            // 全画面有効時
	            this.el.rootEl.classList.add(fsClass);
	        }
	        else {
	            // 通常時
	            this.el.rootEl.classList.remove(fsClass);
	        }
	    }
	    /**
	     * state内のrootElの要素サイズを更新する
	     */
	    updateRootElRect() {
	        const { height: h, width: w, left: l, top: t, } = this.el.rootEl.getBoundingClientRect();
	        this.state.rootRect = {
	            w,
	            h,
	            l,
	            t
	        };
	    }
	}

	// 複数ビューワーを一括登録したり、
	// html側から情報を読み取ってビューワー登録したりするためのclass
	class LaymicApplicator {
	    constructor(selector = ".laymic_template", laymicOptions = {}) {
	        // laymic instanceを格納するMap object
	        this.laymicMap = new Map();
	        const applicatorOptions = (typeof selector === "string")
	            ? Object.assign(this.defaultLaymicApplicatorOptions, { templateSelector: selector })
	            : Object.assign(this.defaultLaymicApplicatorOptions, selector);
	        // laymic templateの配列
	        const elements = Array.from(document.querySelectorAll(applicatorOptions.templateSelector) || []);
	        // laymic展開イベントを登録するopener配列
	        const openers = Array.from(document.querySelectorAll(applicatorOptions.openerSelector) || []);
	        // templateになるhtml要素から必要な情報を抜き出す
	        elements.forEach(el => this.applyLaymicInstance(el, laymicOptions));
	        // openerのdata-for属性がlaymic viewerIdと紐付いている場合
	        // クリック時に当該viewerを展開するイベントを登録する
	        openers.forEach(el => {
	            if (!(el instanceof HTMLElement))
	                return;
	            const dataFor = el.dataset.for || "laymic";
	            if (!this.laymicMap.has(dataFor))
	                return;
	            el.addEventListener("click", () => {
	                this.open(dataFor);
	            });
	        });
	    }
	    get defaultLaymicApplicatorOptions() {
	        return {
	            templateSelector: ".laymic_template",
	            openerSelector: ".laymic_opener",
	            defaultViewerId: "laymic",
	        };
	    }
	    applyLaymicInstance(el, initOptions) {
	        if (!(el instanceof HTMLElement))
	            return;
	        const viewerId = el.dataset.viewerId;
	        const progressBarWidth = (isBarWidth(el.dataset.progressBarWidth))
	            ? el.dataset.progressBarWidth
	            : undefined;
	        const viewerDirection = (el.dataset.viewerDirection === "vertical") ? "vertical" : undefined;
	        const isVisiblePagination = compareString(el.dataset.isVisiblePagination || "", "true", true);
	        const isFirstSlideEmpty = compareString(el.dataset.isFirstSlideEmpty || "", "false", false);
	        const isInstantOpen = compareString(el.dataset.isInstantOpen || "", "false", false);
	        const isLTR = compareString(el.dir, "ltr", true);
	        const options = {
	            viewerId,
	            progressBarWidth,
	            viewerDirection,
	            isFirstSlideEmpty,
	            isInstantOpen,
	            isVisiblePagination,
	            isLTR,
	        };
	        {
	            // わかりやすくスコープを分けておく
	            const pageWidth = parseInt(el.dataset.pageWidth || "", 10);
	            const pageHeight = parseInt(el.dataset.pageHeight || "", 10);
	            const vertPageMargin = parseInt(el.dataset.vertPageMargin || "", 10);
	            const horizPageMargin = parseInt(el.dataset.horizPageMargin || "", 10);
	            const viewerPadding = parseInt(el.dataset.viewerPadding || "", 10);
	            if (isFinite(pageWidth))
	                options.pageWidth = pageWidth;
	            if (isFinite(pageHeight))
	                options.pageHeight = pageHeight;
	            if (isFinite(vertPageMargin))
	                options.vertPageMargin = vertPageMargin;
	            if (isFinite(horizPageMargin))
	                options.horizPageMargin = horizPageMargin;
	            if (isFinite(viewerPadding))
	                options.viewerPadding = viewerPadding;
	        }
	        const pageEls = Array.from(el.children).filter(el => el.tagName.toLowerCase() !== "br");
	        const pages = pageEls.map(childEl => {
	            let result = childEl;
	            if (childEl instanceof HTMLImageElement) {
	                const src = childEl.dataset.src || childEl.src || "";
	                result = src;
	            }
	            return result;
	        });
	        const thumbs = pageEls.map(childEl => {
	            return (childEl instanceof HTMLElement)
	                ? childEl.dataset.thumbSrc || ""
	                : "";
	        });
	        const laymicPages = {
	            pages,
	            thumbs
	        };
	        // JSON.stringifyを経由させてundefined部分を抹消する
	        const opts = Object.assign({}, initOptions, JSON.parse(JSON.stringify(options)));
	        this.laymicMap.set(viewerId || "laymic", new Laymic(laymicPages, opts));
	    }
	    open(viewerId) {
	        const laymic = this.laymicMap.get(viewerId);
	        if (laymic) {
	            laymic.open();
	        }
	        else {
	            console.warn(`LaymicApplicator: ${viewerId} と紐づくlaymic instanceが存在しない`);
	        }
	    }
	    close(viewerId) {
	        const laymic = this.laymicMap.get(viewerId);
	        if (laymic) {
	            laymic.close();
	        }
	        else {
	            console.warn(`LaymicApplicator: ${viewerId} と紐づくlaymic instanceが存在しない`);
	        }
	    }
	}

	exports.Laymic = Laymic;
	exports.LaymicApplicator = LaymicApplicator;

	return exports;

}({}));
