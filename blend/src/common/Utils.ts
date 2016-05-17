interface Array<T> {
    unique(): Array<T>;
}

interface String {
    ucfirst(): string;
    repeat(counts: number): string;
    startsWith(searchString: string, position?: number): boolean,
    inArray(list: Array<string>): boolean
}

interface Function {
    async: any;
}

interface XMLHttpRequest {
    sendAsBinary(data: any): void
}

if (!XMLHttpRequest.prototype.sendAsBinary) {
    /**
     * From MDN
     */
    XMLHttpRequest.prototype.sendAsBinary = function(sData) {
        var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
        for (var nIdx = 0; nIdx < nBytes; nIdx++) {
            ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
        }
        this.send(ui8Data);
    };
}

if (!Function.prototype.async) {
    Function.prototype.async = function() {
        var me = this, args = arguments;
        setTimeout(function() {
            me.apply(me, args);
        }, 1);
    };
}

if (!String.prototype.inArray) {
    String.prototype.inArray = function(list: Array<string> = []): boolean {
        var result: boolean = false;
        for (var i = 0; i != list.length; i++) {
            if (list[i] == this) {
                result = true;
                break;
            }
        }
        return result;
    }
}


if (!String.prototype.repeat) {
    String.prototype.repeat = function(counts: number) {
        return new Array(counts + 1).join(this);
    }
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString: string, position: number = 0) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

if (!String.prototype.ucfirst) {
    String.prototype.ucfirst = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

if (!(<any>Array.prototype).unique) {
    (<any>Array.prototype).unique = function() {
        return this.filter(function(item: any, i: any, allItems: any) {
            return i == allItems.indexOf(item);
        });
    }
}