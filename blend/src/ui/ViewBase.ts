/// <reference path="../mvc/View.ts" />
/// <reference path="../dom/Element.ts" />


namespace Blend.ui {

    /**
     * Abstract base class for a View
     */
    export abstract class ViewBase extends Blend.mvc.View {

        protected parent: Blend.ui.ViewBase;
        protected element: Blend.dom.Element;
        protected isRendered: boolean;
        protected visible: boolean;
        protected config: UIViewInterface;
        protected cssClass: string;
        protected useParentControllers: boolean;
        protected isInitialized: boolean;

        public constructor(config: UIViewInterface = {}) {
            super(config);
            var me = this;
            me.isInitialized = false;
            me.parent = config.parent || null;
            me.useParentControllers = config.useParentController || false;
            me.isRendered = false;
            me.visible = true;
            me.cssClass = null;
            me.config = {
                css: [],
                style: {},
                visible: true,
                top: null,
                left: null,
                width: null,
                height: null,
                grid: config.grid || null,
            };
            me.addCssClass(config.css || []);
            me.setStyle(config.style || {});
            me.setVisible(Blend.isBoolean(config.visible) ? config.visible : true);
            me.setBounds({
                top: config.top || null,
                left: config.left || null,
                width: config.width || null,
                height: config.height || null
            });
        }

        public getProperty<T>(name: string, defaultValue: any = null): T {
            var me: any = this;
            if (name.indexOf('config.', 0) === 0) {
                name = name.replace('config.', '').trim();
                return (me.config[name] === undefined ? defaultValue : me.config[name]);
            } else {
                return super.getProperty<T>(name, defaultValue);
            }
        }

        protected assignElementByOID(el: Blend.dom.Element, oid: string) {
            var me: any = this;
            if (me[oid] === null) {
                me[oid] = el;
            }
        }

        protected render(): Blend.dom.Element {
            return Blend.dom.Element.create({});
        }

        /**
         * Sends a viewInitialized notification
         */
        protected notifyViewInitialized() {
            var me = this
            me.fireEvent('viewInitialized', me);
        }

        /**
         * Check if events can be fired on this View
         */
        public canFireEvents(): boolean {
            var me = this, state: boolean;
            if (super.canFireEvents()) {
                if (me.parent !== null) {
                    state = me.parent.canFireEvents();
                } else {
                    state = true;
                }
            } else {
                state = false;
            }
            if (state === false && me.currentEventName === 'viewInitialized') {
                return true;
            } else {
                return state;
            }
        }

        /////////////////////////////////////////////////////////////////////////
        // BOUNDS
        /////////////////////////////////////////////////////////////////////////

        /**
         * Returns the bounds of this View based on the ViewBoundsInterface interface
         */
        getBounds(): ElementBoundsInterface {
            var me = this;
            if (me.isRendered) {
                return me.element.getBounds();
            } else {
                return null;
            }
        }

        /**
         * Sets the bounds of this View based on the ViewBoundsInterface interface
         */
        setBounds(bounds: ElementBoundsInterface): Blend.ui.ViewBase {
            var me = this, nullBounds: StyleInterface = { top: null, left: null, width: null, height: null };
            if (me.isRendered) {
                me.setStyle(bounds === null ? nullBounds : <StyleInterface>bounds);
            } else {
                Blend.apply(me.config, bounds === null ? nullBounds : bounds);
            }
            me.notifyBoundsChanged();
            return this;
        }

        /**
         * Sends boundsChanged notification
         */
        notifyBoundsChanged() {
            var me = this;
            if (me.isRendered) {
                me.fireEvent('boundsChanged', me.getBounds());
            }
        }


        /////////////////////////////////////////////////////////////////////////
        // VISIBILITY
        //////////////////////////////////////////////////////////////////////////

        /**
         * Sets the visibility state for this View
         */
        setVisible(visible: boolean = true): Blend.ui.ViewBase {
            var me = this
            me.visible = visible === true ? true : false;
            if (me.isRendered) {
                me.element.setData('visible', me.visible);
            } else {
                me.config.visible = me.visible;
            }
            me.notifyVisibilityChanged();
            return this;
        }

        /**
         * gets the visibility state of this View
         */
        public isVisible() {
            var me = this;
            return me.visible;
        }

        /**
         * Sends a visibilityChanged notification
         */
        protected notifyVisibilityChanged() {
            var me = this;
            me.fireEvent('visibilityChanged', me.visible);
        }

        /////////////////////////////////////////////////////////////////////////
        // STYLE and CSS
        //////////////////////////////////////////////////////////////////////////

        /**
         * Sets the Styles for this View
         * */
        public setStyle(style: StyleInterface) {
            var me = this;
            if (me.isRendered) {
                me.element.setStyle(style);
            } else {
                Blend.apply(me.config.style, style, false, true);
            }
            me.notifyStyleOrCSSChanged();
        }

        /**
         * Adds one or more CSS classes to this View
         */
        public addCssClass(css: string | Array<string>) {
            var me = this;
            if (me.isRendered) {
                me.element.addCssClass(css);
            } else {
                Blend.wrapInArray(css).forEach(function(itm: string) {
                    (<Array<string>>me.config.css).push(itm)
                });
            }
            me.notifyStyleOrCSSChanged();
        }

        /**
         * Sends a visibilityChanged notification
         */
        protected notifyStyleOrCSSChanged() {
            var me = this;
            me.fireEvent('styleChanged', me.visible);
        }

        /**
         *Helps configuring the thsi View before the rendering cycle is complete
         */
        protected finalizeRender() {
            var me = this;
            me.addCssClass(me.cssClass);
            me.addCssClass(me.config.css);
            me.setBounds({
                top: me.config.top,
                left: me.config.left,
                width: me.config.width,
                height: me.config.height
            });
            me.setStyle(me.config.style);
            if (!me.visible) {
                // should be set only when not visible
                me.setVisible(false);
            }
        }

        /**
        * Retrives the HTMLElement for this View
        */
        public getElement(): Blend.dom.Element {
            var me = this;
            if (!me.isRendered) {
                me.disableEvents();
                me.element = me.render();
                me.isRendered = true;
                me.finalizeRender();
                me.enableEvents();
            }
            return me.element;
        }

        /**
         * Destroys this View by setting the properties to null,
         * deleting them and removing its HTMLElement
         */
        public destroy() {
            var me = this;
            me.element.remove();
            Blend.forEach(me, function(value: any, key: string) {
                (<any>me)[key] = null;
                delete ((<any>me)[key]);
            });
        }

    }
}