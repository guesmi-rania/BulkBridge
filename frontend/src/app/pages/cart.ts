import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Auth, Cart, unit, msg } from '../core';
@Component({
  standalone: true, imports: [CurrencyPipe, RouterLink], template: `
<h1>Your cart</h1>
@if (!c.items().length) { <p>Your cart is empty. <a routerLink="/catalog">Browse the catalog</a></p> } @else {
<div class="card wide"><table>@for (i of c.items(); track i.p._id) {
<tr><td>{{ i.p.icon }} {{ i.p.name }}</td><td><input type="number" [min]="i.p.moq" [value]="i.qty" (change)="c.set(i.p._id, +$any($event.target).value)"></td>
<td>{{ unit(i.p, i.qty) | currency }} / unit</td><td><a class="lnk" (click)="c.remove(i.p._id)">✕</a></td></tr> }</table></div>
<h2>Total: {{ c.total() | currency }}</h2>@if (err) { <p class="err">{{ err }}</p> }
<button class="btn" (click)="checkout()">Place order</button> }`
})
export class CartPage {
  c = inject(Cart); a = inject(Auth); r = inject(Router); http = inject(HttpClient); unit = unit; err = '';
  checkout() {
    if (!this.a.user()) return void this.r.navigate(['/login']);
    this.http.post('/api/orders', { items: this.c.items().map(i => ({ id: i.p._id, qty: i.qty })) })
      .subscribe({ next: () => { this.c.clear(); this.r.navigate(['/orders']); }, error: e => this.err = msg(e) });
  }
}
