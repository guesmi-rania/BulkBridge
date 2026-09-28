import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
<h1>Order history</h1>
@if (!orders().length) { <p>No orders yet.</p> }
@for (o of orders(); track o._id) {
  <div class="card wide"><b>{{ o.createdAt | date: 'medium' }}</b> — {{ o.total | currency }}
    <ul>@for (i of o.items; track i.name) { <li>{{ i.qty }} × {{ i.name }} at {{ i.price | currency }}</li> }</ul>
  </div>
}`
})
export class Orders {
  orders = signal<any[]>([]);
  constructor() {
    inject(HttpClient).get<any[]>('/api/orders').subscribe(r => this.orders.set(r));
  }
}