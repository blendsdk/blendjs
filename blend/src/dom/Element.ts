/// <reference path="../common/Interfaces.ts" />
/// <reference path="ClassList.ts" />
/// <reference path="StyleList.ts" />
/// <reference path="../Blend.ts" />

namespace Blend.dom {

    /**
     * Wraps an HTMLElement into a utility class for easier  manipulation
     * and hadling
     */
    export class Element {

        private el: HTMLElement;
        private pixelRe = /px$/;
        private UNIT: string = 'px';
        private unitPropertyRe: RegExp = /(width$|height$|size$|radius$|padding|margin$|top$|bottom$|right$|left$)/;
        private unitTypeRe: RegExp = /(em$|\%$|auto|^calc)/;
        public classList: Blend.dom.ClassList;
        public styleList: Blend.dom.StyleList;

        constructor(el: HTMLElement) {
            this.el = el;
            this.classList = new Blend.dom.ClassList(this.el);
            this.styleList = new Blend.dom.StyleList(this.el);
        }

        /**
         * Get the list of files for from this Element
          */
        public getFiles(): FileList {
            var me = this, fel: HTMLInputElement = <HTMLInputElement>me.el;
            if (fel.files) {
                return fel.files;
            } else {
                return new FileList(); // return an empty one
            }
        }

        /**
         * Adds an EventListener to an EventTarget
         */
        public addEventListener(eventName: string, eventHandler: EventListener): void {
            Blend.Runtime.addEventListener(this.el, eventName, eventHandler);
        }

        /**
         * Removes an EventListener from an EventTarget
         */
        public removeEventListener(eventName: string, eventHandler: EventListener): void {
            Blend.Runtime.removeEventListener(this.el, eventName, eventHandler);
        }


        /**
         * Retuns the computed bounds
         */
        public getBounds(): ElementBoundsInterface {
            var bounds: ElementBoundsInterface = this.getStyle(['top', 'left', 'width', 'height', 'visible']),
                borderSize: StyleInterface;

            if (Blend.Runtime.IE && Blend.Runtime.IEVersion < 12) {
                borderSize = this.getStyle(['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width']);
                bounds.width += <any>borderSize['border-left-width'] + <any>borderSize['border-right-width'];
                bounds.height += <any>borderSize['border-top-width'] + <any>borderSize['border-bottom-width'];
                return bounds;
            } else {
                return bounds;
            }
        }

        /**
         * Sets the style of this element
         */
        public setStyle(styles: StyleInterface): Blend.dom.Element {
            var me = this;
            if (styles) {
                Blend.forEach(styles, function(v: any, k: string) {
                    if (v === null || (<string>v) === 'auto') {
                        me.styleList.unset(k);
                    } else {
                        me.styleList.set(k, v);
                    }
                });
                me.styleList.serializeTo(me.el);
            }
            return this;
        }

        /**
         * Gets the computed styles of en element
         */
        public getStyle(styles: string | Array<string>): StyleInterface {
            return this.styleList.getComputed(this.el,
                Blend.wrapInArray<string>(styles));
        }

        /**
         * Gets the CSS classes from this element if possible
         * @return string|string[]
         */
        public getCssClass(asArray: boolean = false): (string | Array<string>) {
            return asArray === true ? this.classList.toArray() : this.classList.toString();
        }

        /**
         * Checks whether this element has a given CSS class
         */
        public hasCssClass(name: string): boolean {
            return this.classList.has(name);
        }

        /**
         * Adds a new css class an element if it already does not exist
         * The replace flag will replace the existsing css class value
         */
        public addCssClass(css: string | string[], replace: boolean = false): Blend.dom.Element {
            var me = this, t: Array<string> = [];
            if (replace === true) {
                this.classList.clear();
            }
            me.classList.add(<Array<string>>Blend.wrapInArray(css));
            me.classList.serializeTo(me.el);
            return this;
        }

        /**
         * Removes one of more CSS classes from this element
         */
        public removeCssClass(css: string | string[]): Blend.dom.Element {
            var me = this, t: Array<string> = [];;
            me.classList.remove(<Array<string>>Blend.wrapInArray(css));
            me.classList.serializeTo(me.el);
            return this;
        }

        /**
         * Removes one or more CSS classes from this element by checking if the
         * CSS names start with the given request
         */
        public removeCssClassLike(css: string | string[]): Blend.dom.Element {
            var me = this, t: Array<string> = [];;
            me.classList.removeLike(<Array<string>>Blend.wrapInArray(css));
            me.classList.serializeTo(me.el);
            return this;
        }

        /**
         * Clears the value of the class attribute of this element
         */
        public clearCssClass(): Blend.dom.Element {
            this.classList.clear();
            return this;
        }

        /**
         * Removes the child elements from this Element
         */
        clearElement() {
            var me = this;
            if (me.el) {
                while (me.el.firstChild) {
                    me.el.removeChild(me.el.firstChild);
                }
            }
        }

        /**
         * Sets the data-* attribute for this element
         */
        public setData(name: string, value: any): Blend.dom.Element {
            this.el.setAttribute('data-' + name, value);
            return this;
        }

        /**
         * Gets a data attribute or returns a default value if the attribute does
         * not exist
         */
        public getData(name: string, defaultValue: any = null): any {
            var me = this,
                attr: string = 'data-' + name;
            return me.el.hasAttribute(attr) ? me.el.getAttribute(attr) : defaultValue;
        }

        /**
         * Set the Scroll state for this Element
         */
        public scrollState(state: Blend.eScrollState): Blend.dom.Element {
            var me = this;
            me.setData('scroll', Blend.eScrollState[<number>state]);
            return this;
        }

        /**
         * Enables/Disables the text select state of this element
         */
        public selectable(state: boolean) {
            this.setData('selectable', state === true ? 'on' : 'off');
        }

        /**
         * Gets the native HTMLElement
         */
        public getEl(): HTMLElement {
            return this.el;
        }

        /**
         * Appends a child Element to this Element
         */
        public append(child: Blend.dom.Element) {
            this.el.appendChild((child.getEl()));
        }

        /**
         * Removes this element from its parent
         */
        public remove() {
            var me = this,
                pNode: Node,
                cNode: Node;
            cNode = me.el;
            pNode = cNode.parentNode || null;
            if (pNode) {
                pNode.removeChild(cNode);
            }
        }

        /**
         * Sets the inner HTML of this element
         */
        public setHtml(html: string): Blend.dom.Element {
            this.el.innerHTML = html;
            return this;
        }

        public setPadding(value: number | UIPaddingInterface): Blend.dom.Element {
            var me = this, padding: UIPaddingInterface = {};
            if (Blend.isNumeric(value)) {
                me.setStyle({ padding: <number>value });
            } else {
                me.setStyle({
                    'padding-top': (<UIPaddingInterface>value).top || null,
                    'padding-right': (<UIPaddingInterface>value).right || null,
                    'padding-bottom': (<UIPaddingInterface>value).bottom || null,
                    "padding-left": (<UIPaddingInterface>value).left || null
                });
            }
            return this;
        }

        /**
         * Gets the inner HTML of this element
         */
        public getHtml(): string {
            return this.el.innerHTML;
        }

        /**
         * Created an Element based on CreateElementInterface
         */
        public static create(conf: CreateElementInterface | Blend.dom.ElementConfigBuilder, elCallback?: Function, elCallbackScope?: any): Blend.dom.Element {
            var me = this, config: CreateElementInterface;
            if (Blend.isInstanceOf(conf, Blend.dom.ElementConfigBuilder)) {
                config = (<Blend.dom.ElementConfigBuilder>conf).getConfig()
            } else {
                config = <CreateElementInterface>conf;
            }
            if (Blend.isObject(config)) {
                var el: HTMLElement = document.createElement(config.tag || 'div');
                for (var cfg in config) {
                    var val: any = (<any>config)[cfg];
                    if (cfg !== 'tag' && cfg !== 'scope' && cfg !== 'oid') {
                        if (cfg === 'cls') {
                            cfg = 'class';
                            if (Blend.isArray(val)) {
                                val = <Array<string>>val.join(' ');
                            }
                        } else if (cfg === 'innerHTML') {
                            cfg = null;
                            el.innerHTML = val;
                        } else if (cfg === 'text') {
                            cfg = null;
                            var textNd = document.createTextNode(val);
                            el.appendChild(textNd);
                        } else if (cfg === 'listeners' && Blend.isObject(val)) {
                            cfg = null;
                            for (var e in val) {
                                var handler = val[e];
                                Blend.Runtime.addEventListener(el, e, function() {
                                    handler.apply(config.scope || window, arguments);
                                });
                            }
                        } else if (cfg === 'children') {
                            if (!Blend.isArray(val)) {
                                val = [val];
                            }
                            val.forEach(function(child: HTMLElement | CreateElementInterface | Blend.dom.Element | Blend.dom.ElementConfigBuilder) {
                                if (child instanceof HTMLElement) {
                                    el.appendChild(<HTMLElement>child);
                                } else if (child instanceof Blend.dom.Element) {
                                    el.appendChild((<Blend.dom.Element>child).getEl());
                                } else if (child instanceof Blend.dom.ElementConfigBuilder) {
                                    el.appendChild(Blend.dom.Element.create((<Blend.dom.ElementConfigBuilder>child), elCallback, elCallbackScope).getEl());
                                } else {
                                    el.appendChild(Blend.dom.Element.create(<CreateElementInterface>child, elCallback, elCallbackScope).getEl());
                                }
                            });
                            cfg = null;
                        } else if (cfg === 'data') {
                            Blend.forEach(val, function(v: any, k: string) {
                                el.setAttribute('data-' + k, v);
                            });
                            cfg = null;
                        } else if (cfg === 'style') {
                            cfg = null;
                            Blend.getElement(el).setStyle(<StyleInterface>val);
                        } else if (cfg == 'selectable') {
                            if (val === false) {
                                Blend.getElement(el).selectable(false);
                            }
                            cfg = null;
                        }
                        if (cfg) {
                            el.setAttribute(cfg, val);
                        }
                    }
                }
                var wEl = new Blend.dom.Element(el)
                if (elCallback && config.oid) {
                    elCallback.apply(elCallbackScope || window, [wEl, config.oid]);
                }
                return wEl;
            } else {
                return Blend.createElement({});
            }
        }
    }
}

namespace Blend {

    /**
     * Wrapper for Blend.dom.Element.create
     */
    export var createElement = Blend.dom.Element.create;

    /**
     * Wrapper for document.querySelector
     */
    export function selectElement(query: string): Blend.dom.Element {
        var els = Blend.selectElements(query);
        return els[0] || null;
    }

    /**
     * Wrapper for document.querySelectorAll
     */
    export function selectElements(query: string): Array<Blend.dom.Element> {
        var els: Array<Blend.dom.Element> = [];
        Blend.forEach(document.querySelectorAll(query), function(el: HTMLElement) {
            els.push(new Blend.dom.Element(el));
        });
        return els;
    }

    /**
     * Wrapper for document.getElementById
      */
    export function getElement(el: string | HTMLElement): Blend.dom.Element {
        if (Blend.isString(el)) {
            return new Blend.dom.Element(document.getElementById(<string>el));
        } else {
            return new Blend.dom.Element(<HTMLElement>el);
        }
    }
}