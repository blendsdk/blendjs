/// <reference path="../Blend.ts" />
/// <reference path="../Component.ts" />

namespace Blend.ajax {

    export abstract class AjaxRequest extends Blend.Component {

        protected xhr: XMLHttpRequest;
        protected xhrConfig: DictionaryInterface;
        protected url: string;
        protected headers: DictionaryInterface;
        protected onComplete: Function;
        protected onProgress: Function;
        protected onFailed: Function;
        protected onSuccess: Function;
        protected onStart: Function;
        protected scope: any;

        protected abstract doSendRequest(data: DictionaryInterface): void

        public constructor(config: string | AjaxRequestInterface) {
            super();
            var me = this, cfg: AjaxRequestInterface;
            if (Blend.isString(config)) {
                cfg = {
                    url: <string>config || null,
                }
            } else {
                cfg = <AjaxRequestInterface>config
            }
            me.url = cfg.url || null;
            me.headers = cfg.headers || {};
            me.onComplete = cfg.onComplete || null;
            me.onProgress = cfg.onProgress || null;
            me.onFailed = cfg.onFailed || null;
            me.onSuccess = cfg.onSuccess || null;
            me.onStart = cfg.onStart || null;
            me.scope = cfg.scope | <any>me;
            me.xhrConfig = {
                withCredentials: cfg.withCredentials === true ? true : false
            }
            me.initialize();
        }

        protected initialize() {
            var me = this, handlers: DictionaryInterface = {
                progress: me.updateProgress,
                load: me.transferComplete,
                error: me.transferFailed,
                abort: me.transferCanceled
            };
            me.xhr = new XMLHttpRequest();
            Blend.forEach(handlers, function(handler: Function, eventName: string) {
                me.xhr.addEventListener(eventName, function(evt: Event) {
                    handler.apply(me, [me.xhr, evt]);
                })
            });
            Blend.forEach(me.headers, function(value: string, header: string) {
                me.xhr.setRequestHeader(header, value);
            });
            Blend.forEach(me.xhrConfig, function(value: any, key: string) {
                (<any>me.xhr)[key] = value;
            });
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
            if ((<any>me)[name]) {
                return (<Function>(<any>me)[name]).apply(me.scope || me, args);
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