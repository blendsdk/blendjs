/// <reference path="../logger/LoggerInterface.ts" />

namespace Blend.testing {

    export class ConsoleLogger implements Blend.logger.LoggerInterface {

        private logtext: string;

        open(): any {
            this.logtext = '<div class="container-fluid"><table class="table table-bordered" >'
                + '<thead><tr><th>Test</th><th>Log</th><th>Context</th></tr></thead><tbody>';
            this.info("Starting at" + (new Date()));
        }

        close(): any {

            var head: HTMLHeadElement = document.head
                , link: HTMLLinkElement = document.createElement('link');

            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css';
            head.appendChild(link);
            
            this.info("Finished at" + (new Date()));

            this.logtext += "</tbody></table></div>";
            var logEl: HTMLElement = document.getElementById("log");
            logEl.innerHTML = this.logtext;
        }

        log(type: string, message: string, context?: any): any {
            if (type === 'fail') {
                this.logtext += `<tr class="fail"><td>${context.test}</td><td>${message}</td><td><pre>${JSON.stringify(context, null, 2)}</pre></td></tr>`;
            } else if (type !== "pass") {
                this.logtext += `<tr class="${type}"><td colspan="3">${message}</td></tr>`;
            }
        }

        warn(message: string, context?: any): any {
            this.log("warn", message, context);
        }

        error(message: string, context?: any): any {
            this.log("error", message, context);
        }

        info(message: string, context?: any): any {
            this.log("info", message, context);
        }

        debug(message: string, context?: any): any {
            this.log("debug", message, context);
        }

    }

}