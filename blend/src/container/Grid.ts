/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/Container.ts" />

namespace Blend.container {

    /**
     * This container can be used to implement a Responsive grid
     */
    export class Grid extends Blend.ui.Container {

        protected config: GridContainerInterface
        protected gridRows: Array<Blend.dom.Element>;

        public constructor(config: GridContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'b-gc';
            me.itemCSSClass = me.cssClass + '-itm';
            me.gridRows = [];
        }

        protected renderChild(view: Blend.ui.View): Blend.dom.Element {
            var me = this,
                row: Blend.dom.Element,
                viewEl: Blend.dom.Element,
                gridConfig: GridItemInterface = view.getProperty<GridItemInterface>('config.grid', null);

            if (gridConfig !== null) {
                row = me.gridRows[gridConfig.row || 0] || me.gridRows[0] || null;
                if (row == null) {
                    row = Blend.dom.Element.create({ cls: 'b-grd-r' });
                    me.gridRows.push(row);
                    me.bodyElement.append(row);
                }
                viewEl = view.getElement();
                /**
                 * Adds the css class using the lower API so the View does not go into a
                 * paint/layout cycle
                 */
                viewEl.classList.removeLike(['b-grd-c']);
                viewEl.classList.add(['b-grd-c' + (gridConfig.col || 0)]);
                viewEl.classList.serializeTo(viewEl.getEl());
                view.setStyle({ width: null});
                row.append(viewEl);
                return row;
            } else {
                throw new Error('Items ina Grid container must have a "grid" configuration!')
            }
        }

        protected finalizeRender() {
            var me = this;
            super.finalizeRender();
            me.bodyElement.addCssClass('b-grd');
        }
    }
}

namespace Blend {
    registerClassWithAlias('layout.grid', Blend.container.Grid);
}