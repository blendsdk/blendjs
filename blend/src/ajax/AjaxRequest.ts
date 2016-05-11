/// <reference path="../Blend.ts" />
/// <reference path="../Component.ts" />

namespace Blend.ajax {

    export abstract class AjaxRequest extends Blend.Component {

        protected config: AjaxRequestInterface;
        protected xhr: XMLHttpRequest;

        protected abstract doSendRequest(data: DictionaryInterface): void

        public constructor(config: string | AjaxRequestInterface) {
            var cfg: AjaxRequestInterface;
            if (Blend.isString(config)) {
                cfg = {
                    url: <string>config || null,
                }
            } else {
                cfg = <AjaxRequestInterface>config
            }
            super(cfg);
            var me = this;
            me.config = {
                url: cfg.url || null,
                headers: cfg.headers || {},
                onComplete: cfg.onComplete || null,
                onProgress: cfg.onProgress || null,
                onFailed: cfg.onFailed || null,
                onSuccess: cfg.onSuccess || null,
                onStart: cfg.onStart || null,
                scope: cfg.scope | <any>me
            }
            me.initialize();
        }

        protected initialize() {
            var me = this;
            me.xhr = new XMLHttpRequest();
            me.xhr.addEventListener("progress", function(evt: Event) { me.updateProgress.apply(me, [me.xhr, evt]) });
            me.xhr.addEventListener("load", function(evt: Event) { me.transferComplete.apply(me, [me.xhr, evt]) });
            me.xhr.addEventListener("error", function(evt: Event) { me.transferFailed.apply(me, [me.xhr, evt]) });
            me.xhr.addEventListener("abort", function(evt: Event) { me.transferCanceled.apply(me, [me.xhr, evt]) });
        }

        public sendRequest(data: DictionaryInterface = {}) {
            var me = this;
            if (me.callHandler('onStart', arguments) !== false) {
                me.doSendRequest(data);
            } else {
                me.transferCanceled(me.xhr, null);
            }
        }

        protected updateProgress(request: XMLHttpRequest, evt: Event) {
            var me = this;
            me.callHandler('onProgress', arguments);
        }

        protected transferComplete(request: XMLHttpRequest, evt: Event) {
            var me = this;
            if (request.status >= 300) {
                me.transferFailed.apply(me, arguments);
            } else if (request.status < 300) {
                me.callHandler('onSuccess', arguments);
            }
            me.callHandler('onComplete', arguments);
        }

        protected transferFailed(request: XMLHttpRequest, evt: Event) {
            var me = this;
            me.callHandler('onFailed', arguments);
        }

        protected transferCanceled(request: XMLHttpRequest, evt: Event) {
            var me = this;
            me.transferFailed(request, evt);
        }

        private callHandler(name: string, args: IArguments) {
            var me = this;
            if ((<any>me.config)[name]) {
                return (<Function>(<any>me.config)[name]).apply(me.config.scope || me, args);
            } else {
                return undefined;
            }
        }

        protected encodeURIComponent(value: string) {
            return encodeURIComponent(value).replace(/[!'()*]/g, function(c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        }
    }

}