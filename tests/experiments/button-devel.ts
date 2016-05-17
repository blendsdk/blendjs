/// <reference path="../blend/support.d.ts" />
/// <reference path="../blend/blend.d.ts" />

Blend.Runtime.ready(function() {

    var bodyEl = Blend.getElement(document.body);
    var fa_icon = 'fa-close';
    var buttonSizes: Array<string> = ['default', 'tool'];
    var iconAligns: Array<string> = ['left', 'right', 'top', 'bottom'];

    buttonSizes.forEach(function(buttonSize: string) {

        var wrapper = Blend.createElement({
            cls: ['t-wrapper'],
            style: {
                border: '1px solid gray',
                margin: 5,
                padding: 5,
            },
            children: []
        });

        wrapper.append(new Blend.button.Button({
            text: buttonSize.ucfirst(),
            buttonType: buttonSize,
        }).getElement());

        wrapper.append(new Blend.button.Button({
            icon: fa_icon,
            buttonType: buttonSize,
        }).getElement());


        iconAligns.forEach(function(iconAlign: 'top' | 'bottom' | 'left' | 'right') {

            var button = new Blend.button.Button(<ButtonInterface>{
                iconAlign: iconAlign,
                text: buttonSize.ucfirst(),
                icon: fa_icon,
                buttonType: buttonSize,
            });
            wrapper.append(button.getElement());

        });

        bodyEl.append(wrapper);

    });

}).kickStart();