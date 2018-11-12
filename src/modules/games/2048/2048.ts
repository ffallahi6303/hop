import {ScriptLoaderService} from "../../../_services/script-loader.service";
import TemplateHelper from "../../../_helpers/template.helper";
import GamesModule from "../games.module";
import Inputs from "../../../app/inputs";

export default class Game2048 {

    private gamesModule: GamesModule;
    private scriptLoader;
    private template;
    private input;
    private $el = $('#fullscreen');
    private scripts = [
        "/assets/js/games/2048/bind_polyfill.js",
        "/assets/js/games/2048/classlist_polyfill.js",
        "/assets/js/games/2048/animframe_polyfill.js",
        "/assets/js/games/2048/keyboard_input_manager.js",
        "/assets/js/games/2048/html_actuator.js",
        "/assets/js/games/2048/grid.js",
        "/assets/js/games/2048/tile.js",
        "/assets/js/games/2048/local_storage_manager.js",
        "/assets/js/games/2048/game_manager.js",
        "/assets/js/games/2048/application.js"
    ];

    constructor(module: GamesModule) {

        const self = this;

        this.scriptLoader = ScriptLoaderService.instance;
        this.template = TemplateHelper.instance;
        this.input = Inputs.instance;
        this.gamesModule = module;

        this.registerKeyboardInputs();
        this.render(() => {
            self.loadDependencies();
        });
    }

    private render(callback?): void {
        const self = this;
        const templatePromise = this.template.load('games', '2048');
        this.template.render(templatePromise, {}, this.$el, 'html', function () {
            self.$el.fadeIn(100);
            if (typeof callback === 'function')
                callback();
        });
    }

    private registerKeyboardInputs(): void {
        const self = this;
        const stopParams = {key: '2045.exit', title: 'خروج از بازی', icon: 'stop', button: true};
        this.input.addEvent('stop', false, stopParams, () => {
            self.destroy();
        });
    }

    private loadDependencies(): void {
        const self = this;
        this.scripts.forEach((script) => {
            self.scriptLoader.loadScript('head', script, true);
        });
    }

    private destroy(): void {
        const self = this;
        this.unloadDependencies();
        this.input.removeEvent('stop', {key: '2048.stop'});
        this.$el.fadeOut(100, () => {
            self.$el.empty();
        });
    }

    private unloadDependencies(): void {
        const self = this;
        this.scripts.forEach((script) => {
            self.scriptLoader.unloadScript('head', script, true);
        });
    }
}