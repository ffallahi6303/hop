import * as $ from 'jquery';

declare let document: any;

interface Script {
    src: string;
    loaded: boolean;
}

export class ScriptLoaderService {

    private static _instance: ScriptLoaderService;
    public _scripts: Script[] = [];

    /**
     * Lazy load list of scripts
     * @param tag
     * @param scripts
     * @param loadOnce
     * @returns {Promise<any[]>}
     */
    loadScripts(tag, scripts, loadOnce?: boolean): Promise<any> {
        loadOnce = loadOnce || false;

        scripts.forEach((script: string) => {
            if (!this._scripts[script]) {
                this._scripts[script] = {src: script, loaded: false};
            }
        });

        let promises: any[] = [];
        scripts.forEach(
            (script) => promises.push(this.loadScript(tag, script, loadOnce)));

        return Promise.all(promises);
    }

    /**
     * Lazy load a single script
     * @param tag
     * @param {string} src
     * @param loadOnce
     * @returns {Promise<any>}
     */
    loadScript(tag, src: string, loadOnce?: boolean): Promise<any> {
        loadOnce = loadOnce || false;

        if (!this._scripts[src]) {
            this._scripts[src] = {src: src, loaded: false};
        }

        return new Promise((resolve, reject) => {
            // resolve if already loaded
            if (this._scripts[src].loaded && loadOnce) {
                resolve({src: src, loaded: true});
            }
            else {
                // load script tag
                let scriptTag = $('<script/>').attr('type', 'text/javascript').attr('src', this._scripts[src].src);

                $(tag).append(scriptTag);

                this._scripts[src] = {src: src, loaded: true};
                resolve({src: src, loaded: true});
            }
        });
    }

    unloadScript(tag: string, src: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._scripts[src]) {
                $(tag).find('script[src="' + src + '"]');
                delete this._scripts[src];
                resolve({src: src, loaded: false});
            } else {
                reject({});
            }
        });
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }
}