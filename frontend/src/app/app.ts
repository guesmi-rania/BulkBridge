import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { Auth, Cart } from './core';
@Component({
  selector: 'app-root', standalone: true, imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
<header class="nav"><a routerLink="/" class="brand"><img src="logo.svg" width="34" height="34" alt="B2B Hub logo">B2B<span>Hub</span></a>
<nav><a routerLink="/catalog" routerLinkActive="on">Catalog</a>
@if (auth.user()) { <a routerLink="/orders" routerLinkActive="on">Orders</a><a class="lnk" (click)="out()">Logout ({{ auth.user().name }})</a> }
@else { <a routerLink="/login">Sign in</a><a routerLink="/register" class="btn sm">Sign up</a> }
<a routerLink="/cart" class="cart">🛒 {{ cart.count() }}</a></nav></header>
<main><router-outlet /></main>
<footer>B2B Hub · portfolio project built with Angular, Node.js &amp; MongoDB</footer>`
})
export class App { auth = inject(Auth); cart = inject(Cart); r = inject(Router); out() { this.auth.logout(); this.r.navigate(['/']); } }
