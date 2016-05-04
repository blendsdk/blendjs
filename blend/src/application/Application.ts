/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../mvc/Context.ts" />
/// <reference path="../ui/View.ts" />

namespace Blend.application {

    /**
     * Base class for implementing an Application component
     */
    export abstract class Application extends Blend.ui.View {

        protected config: ApplicationInterface;
        protected isStarted: boolean;
        protected isResizing: boolean;
        protected mainView: Blend.ui.View;
        protected mqTriggers: DictionaryInterface;

        public constructor(config: ApplicationInterface = {}) {
            super(config);
            var me = this;
            me.isStarted = false;
            me.isResizing = false;
            me.cssClass = "application";
            me.config.mainView = config.mainView || null;
            me.config.theme = config.theme || 'default';
            me.config.style = {}; // remove use provided styles
            me.addLayoutTriggerEvent('applicationResized');
            me.setContext(new Blend.mvc.Context());
            me.createMainView();
        }

        /**
         * Used to fire an event when the browser is resized
         */
        protected notifyApplicationResized(evt: Event) {
            var me = this;
            me.fireEvent('applicationResized', evt);
        }

        protected notifyResponsiveChanged(model: string) {
            var me = this;
            me.fireEvent('responsiveChanged', model);
        }

        /**
         * Handle the resize notification correctly
         */
        protected onWindowResize() {
            var me = this;
            if (!me.isResizing) {
                me.isResizing = true;
                me.notifyApplicationResized.apply(me, arguments);
                me.isResizing = false;
            }
        }

        /**
         * Install an event listeners to detect common Media Query changes
          */
        protected setupResponsiveListeners() {
            var me = this;
            if (window && window.matchMedia) {
                Blend.forEach(me.mqTriggers, function(size: string, model: string) {
                    window.matchMedia(size).addListener(function() {
                        me.notifyResponsiveChanged(model);
                    });
                });
            }
        }

        /**
         * Install an event listener on the window
         */
        protected setupWindowListeners() {
            var me = this, tm = -1,
                counts = 0,
                curSize = -1;
            Blend.Runtime.addEventListener(window, 'resize', function(evt: Event) {
                curSize = window.innerWidth + window.innerHeight;
                clearInterval(tm);
                tm = setInterval(function() {
                    if (counts >= 3) {
                        if (curSize === (window.innerWidth + innerHeight)) {
                            clearInterval(tm);
                            me.onWindowResize.apply(me, [evt]);
                        } else {
                            counts = 0;
                        }
                    } else {
                        counts++;
                    }
                }, 50);
            });
        }

        /**
         * Fires when the application is ready for user interaction
         */
        protected notifyApplicationReady() {
            var me = this;
            me.fireEvent('applicationReady');
        }

        protected performInitialMediaQuery() {
            Blend.Runtime.triggerMediaQueryCheck();
        }

        protected asyncRun() {
            var me = this,
                body: Blend.dom.Element = wrapEl(document.body);
            if (!me.isStarted) {
                body.clearElement();
                body.addCssClass(me.config.theme, false);
                body.append(me.getElement());
                me.setupWindowListeners();
                me.setupResponsiveListeners();
                me.performLayout();
                me.performInitialMediaQuery();
                me.notifyApplicationReady();
                me.isStarted = true;
            }
        }

        protected layoutView() {
            var me = this;
            if (!me.isStarted) {
                // first time cleanup, We could have implemented this using the initialize cycle
                // Then then every extend from the applucation needs to call the super.initialize()!!
                me.mainView.setBounds({ top: null, left: null, width: null, height: null });
                me.mainView.setStyle({ display: null });
            }
            me.mainView.performLayout();
        }

        /**
         * Creates the main view of this application
         * */
        protected createMainView() {
            var me = this;
            if (me.config.mainView) {
                me.mainView = Blend.createComponent<Blend.ui.View>(me.config.mainView, {
                    parent: me
                });
                if (Blend.isInstanceOf(me.mainView, Blend.ui.View)) {
                    me.setContext(me.context);
                    me.mainView.addCssClass('mainview', true);
                    if (me.mainView.getProperty('useParentController', true) === true) {
                        me.mainView.addController(me.controllers);
                    }
                } else {
                    throw new Error('The provide mainView is not a valid View instance!');
                }
            } else {
                throw new Error('Missing or invalid mainView!');
            }
        }

        protected renderMainView(): Blend.dom.Element {
            return this.mainView.getElement();
        }

        protected render(): Blend.dom.Element {
            var me = this;
            return Blend.dom.Element.create({
                children: [me.renderMainView()]
            });
        }

        /**
         * Entry point of a Blend application
         */
        run() {
            var me = this;
            if (!me.isStarted) {
                Blend.Runtime.ready(function() {
                    me.asyncRun.apply(me, arguments);
                }, me);
                Blend.Runtime.kickStart();
            }
        }
    }
}