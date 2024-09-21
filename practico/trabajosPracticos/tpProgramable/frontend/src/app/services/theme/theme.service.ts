import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    // dark: boolean = false;
    // mode = 'auto';
    // prefDark = window.matchMedia('(prefers-color-scheme: dark)');

    constructor() { }

    async setTheme(type : 'light' | 'dark'): Promise<void> {
        // const storeMode = this.mode;

        await Preferences.set({
            key: 'mode',
            value: type
        });

        // if (this.mode !== 'auto') {
        //     this.dark = (this.mode === 'dark') ? true : false;
        // } else {
        //     this.dark = this.prefDark.matches;
        //     this.prefDark.addEventListener('change', e => {
        //         this.dark = e.matches;
        //     });
        // }
    };

    // async checkMode() {
    //     const { value } = await Preferences.get({ key: 'mode' });
    //     if (value) {
    //         this.mode = value;
    //     }

    //     return this.mode;
    // };
}