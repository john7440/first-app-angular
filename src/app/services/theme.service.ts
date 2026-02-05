import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
    theme = signal<'light' | 'dark'>('light');

    constructor(){
        const savedTheme = localStorage.getItem('theme') as  'light' | 'dark' | null;
        const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark').matches;

        this.theme.set(savedTheme || (prefersDark ? 'dark': 'light'));

        effect(() =>{
            const currentTheme = this.theme();
            document.documentElement.setAttribute('data-bs-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    toggleTheme() {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
  }

    setTheme(theme: 'light' | 'dark'){
        this.theme.set(theme);
    }

}