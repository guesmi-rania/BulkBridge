import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Cart } from '../core';
@Component({
  standalone: true, imports: [CurrencyPipe], template: `
<h1>Wholesale catalog</h1>
<div class="bar"><input placeholder="Search products…" (input)="q.set($any($event.target).value)">
<select (change)="cat.set($any($event.target).value)"><option value="">All categories</option>@for (c of cats(); track c) { <option>{{ c }}</option> }</select></div>
@if (loading()) { <p>Loading…</p> }
<div class="grid">@for (p of shown(); track p._id) {
<article class="card"><div class="ico">{{ p.icon }}</div><h3>{{ p.name }}</h3><small>{{ p.category }} · MOQ {{ p.moq }}</small><p>{{ p.description }}</p>
<table>@for (t of p.tiers; track t.min) { <tr><td>{{ t.min }}+ units</td><td>{{ t.price | currency }}</td></tr> }</table>
<button class="btn" (click)="cart.add(p)">Add {{ p.moq }} to cart</button></article> }</div>`
})
export class Catalog {
  cart = inject(Cart); all = signal<any[]>([]); q = signal(''); cat = signal(''); loading = signal(true);
  cats = computed(() => [...new Set(this.all().map(p => p.category))]);
  shown = computed(() => this.all().filter(p => (!this.cat() || p.category === this.cat()) && p.name.toLowerCase().includes(this.q().toLowerCase())));
  constructor() { inject(HttpClient).get<any[]>('/api/products').subscribe(r => { this.all.set(r); this.loading.set(false); }); }
}
