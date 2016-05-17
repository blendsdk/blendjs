namespace Blend.dom {

    /**
     * Implements a style list provides for the Blend.dom.Element
     */
    export class StyleList {

        private styles: DictionaryInterface
        private el: HTMLElement;
        private pixelRe = /px$/;
        private UNIT: string = 'px';
        private unitPropertyRe: RegExp = /(width$|height$|size$|radius$|padding|margin$|top$|bottom$|right$|left$)/;
        private unitTypeRe: RegExp = /(em$|\%$|auto|^calc)/;

        constructor(el:HTMLElement ) {
            this.initList(el.style.cssText.trim());
        }

        private initList(data: string) {
            var me = this,
                p: Array<string>;
            me.styles = {};
            if (data !== '') {
                data.split(';').forEach(function(d: string) {
                    if (d !== '') {
                        p = d.split(':');
                        me.styles[p[0].trim()] = me.fromUnit(p[1].trim());
                    }
                });
            }
        }

        public set(name: string, value: any) {
            this.styles[name] = value;
        }

        public unset(name: string) {
            delete (this.styles[name]);
        }

        public getComputed(el: HTMLElement,names:Array<string>) {
            var me = this,
                cs = window.getComputedStyle(el, null),
                r: StyleInterface = {};
            names.forEach(function(key: string) {
                r[key] = me.fromUnit(cs.getPropertyValue(key));
            });
            return r;
        }

        public serializeTo(el: HTMLElement) {
            var me = this,style='';
            Object.keys(me.styles).forEach(function(name: string) {
                style += `${name}:${me.toUnit(name,me.styles[name])};`;
            });
            if (style !== '') {
                el.style.cssText = style;
            }
        }

        /**
         * Checks and converts the value to px based on the given key
         */
        private toUnit(key: string, value: any) {
            var me = this;
            if (value !== null && me.unitPropertyRe.test(key) && !me.unitTypeRe.test(value)) {
                value = value + me.UNIT;
            }
            return value;
        }


        /**
         * Given the value it converts px value to a number, otherwise it returns the original
         * value.
         */
        private fromUnit(value: any): any {
            var me = this;
            if (value !== null && me.pixelRe.test(value)) {
                value = parseFloat(value.replace(me.UNIT, ''));
            }
            return value;
        }

    }

}