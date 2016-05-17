/// <reference path="../common/Interfaces.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/View.ts" />
/// <reference path="../Blend.ts" />

interface ButtonInterface extends UIViewInterface {
    text?: string;
    icon?: string;
    iconAlign?: string;
    buttonType?: string;
    ui?: string
}

namespace Blend.button {

    export class Button extends Blend.ui.View {

        protected config: ButtonInterface;
        protected innerElement: Blend.dom.Element = null;
        protected textElement: Blend.dom.Element = null;
        protected iconElement: Blend.dom.Element = null;
        protected text: string;
        protected icon: string;

        public constructor(config: ButtonInterface = {}) {
            super(config);
            var me = this;
            //me.cssClass = 'b-btn';
            me.text = config.text || ''
            me.icon = config.icon || null;
            me.config.iconAlign = config.iconAlign || 'left';
            me.config.buttonType = config.buttonType || 'default';
            me.config.ui = config.ui || 'b-btn-ui-default';
        }

        protected render(): Blend.dom.Element {
            var me = this,
                alignement = me.config.iconAlign.inArray(['left', 'right']) ? 'halign' : 'valign',
                hasIcon: boolean = me.icon !== null,
                hasText: boolean = me.text !== '';

            var buttonEl = new Blend.dom.ElementConfigBuilder('button')
                .addCSS(['b-btn', me.config.ui]);

            var innerEl = new Blend.dom.ElementConfigBuilder('span')
                .setOID('wrapperElement')
                .addCSS(['b-btn-inner', 'b-btn-inner-' + alignement]);

            var txtEl = new Blend.dom.ElementConfigBuilder('span')
                .setOID('textElement')
                .addCSS(['b-btn-text'])
                .setText(me.text);

            var iconEl = new Blend.dom.ElementConfigBuilder('i')
                .setOID('iconElement')
                .addCSS(['b-btn-icon'])
                .addCSS(['fa']);

            if (me.icon !== null) {
                iconEl.addCSS([me.icon]);
            }
            if (me.config.iconAlign.inArray(['left', 'top'])) {
                innerEl.addCSS(['b-btn-inner-icon-text']);
                innerEl.addChild(iconEl);
                innerEl.addChild(txtEl);
            }

            if (me.config.iconAlign.inArray(['right', 'bottom'])) {
                innerEl.addCSS(['b-btn-inner-text-icon']);
                innerEl.addChild(txtEl);
                innerEl.addChild(iconEl);

            }

            if (hasText && hasIcon) {
                buttonEl.addCSS(['b-btn-both'])
            } else if (hasText) {
                buttonEl.addCSS(['b-btn-text-only'])
            } else if (hasIcon) {
                buttonEl.addCSS(['b-btn-icon-only'])
            }


            buttonEl
                .addCSS(['b-btn-' + alignement, 'b-btn-' + me.config.buttonType])
                .addChild(innerEl);

            return Blend.dom.Element.create(buttonEl, me.assignElementByOID, me);
        }
    }
}
