namespace Blend.logger {

    export interface LoggerInterface {
        
        open(): any;
        
        close(): any;

        log(type: string, message: string, context?: any): any;

        warn(message: string, context?: any): any;

        error(message: string, context?: any): any;

        info(message: string, context?: any): any;

        debug(message: string, context?: any): any
    }

}