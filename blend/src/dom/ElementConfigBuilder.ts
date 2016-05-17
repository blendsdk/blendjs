/// <reference path="../common/Interfaces.ts" />

namespace Blend.dom {

    export class ElementConfigBuilder {

        protected config: CreateElementInterface;

        public constructor(config: string | CreateElementInterface) {
            var me = this, cfg: CreateElementInterface = {};
            if (Blend.isString(config)) {
                cfg = {
                    tag: <string>config
                }
            } else {
                cfg = <CreateElementInterface>config;
            }
            me.config = Blend.apply(
                {
                    tag: 'div',
                    cls: [],
                    children: [],
                    listeners: {},
                    data: {},
                    style: {},
                    selectable: null
                },
                cfg,
                true,
                true);
        }

        public addChild(child: string | Blend.dom.ElementConfigBuilder | CreateElementInterface): Blend.dom.ElementConfigBuilder {
            var me = this;
            if (Blend.isInstanceOf(child, Blend.dom.ElementConfigBuilder)) {
                me.config.children.push(child);
                return <Blend.dom.ElementConfigBuilder>child;
            } else {
                var c = new Blend.dom.ElementConfigBuilder(<CreateElementInterface>child);
                me.config.children.push(c);
                return c;
            }
        }

        public setStyle(styles: StyleInterface): Blend.dom.ElementConfigBuilder {
            var me = this;
            Blend.forEach(styles, function(v: any, k: string) {
                me.config.style[k] = v;
            });
            return this;
        }

        public setSelectable(state: boolean): Blend.dom.ElementConfigBuilder {
            this.config.selectable = state;
            return this;
        }


        public setText(text: string): Blend.dom.ElementConfigBuilder {
            this.config.text = text;
            return this;
        }

        public addCSS(css: Array<string>): Blend.dom.ElementConfigBuilder {
            var me = this
            css.forEach(function(itm: string) {
                (<Array<string>>me.config.cls).push(itm);
            });
            return this;
        }

        public setOID(oid: string): Blend.dom.ElementConfigBuilder {
            this.config.oid = oid;
            return this;
        }

        public setTag(tag: string): Blend.dom.ElementConfigBuilder {
            this.config.tag = tag;
            return this;
        }

        public getConfig() {
            return this.config;
        }
    }
}