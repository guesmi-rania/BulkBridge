import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';

export const msg = (e: any) => e?.error?.message || 'Something went wrong';

// Adds the JWT to every request
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const t = localStorage.getItem('token');
  return next(t ? req.clone({ setHeaders: { Authorization: `Bearer ${t}` } }) : req);
};

@Injectable({ providedIn: 'root' })
export class Auth {
  http = inject(HttpClient);
  user = signal<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  private save = (r: any) => { localStorage.setItem('token', r.token); localStorage.setItem('user', JSON.stringify(r.user)); this.user.set(r.user); };
  login = (b: any) => this.http.post('/api/auth/login', b).pipe(tap(this.save));
  demo = () => this.http.post('/api/auth/demo', {}).pipe(tap(this.save));
  register = (b: any) => this.http.post<any>('/api/auth/register', b);
  verify = (t: string) => this.http.get<any>(`/api/auth/verify/${t}`);
  forgot = (email: string) => this.http.post<any>('/api/auth/forgot', { email });
  reset = (t: string, password: string) => this.http.post<any>(`/api/auth/reset/${t}`, { password });
  logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); this.user.set(null); }
}

export const authGuard: CanActivateFn = () => inject(Auth).user() ? true : inject(Router).createUrlTree(['/login']);

// Volume pricing: best tier whose minimum is <= quantity
export const unit = (p: any, q: number) => [...p.tiers].reverse().find((t: any) => q >= t.min)?.price ?? p.tiers[0].price;

@Injectable({ providedIn: 'root' })
export class Cart {
  items = signal<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  count = computed(() => this.items().length);
  total = computed(() => this.items().reduce((a, i) => a + i.qty * unit(i.p, i.qty), 0));
  private sync() { localStorage.setItem('cart', JSON.stringify(this.items())); }
  add(p: any) {
    const has = this.items().find(i => i.p._id === p._id);
    this.items.set(has ? this.items().map(i => i === has ? { ...i, qty: i.qty + p.moq } : i) : [...this.items(), { p, qty: p.moq }]); this.sync();
  }
  set(id: string, qty: number) { this.items.set(this.items().map(i => i.p._id === id ? { ...i, qty: Math.max(i.p.moq, qty || 0) } : i)); this.sync(); }
  remove(id: string) { this.items.set(this.items().filter(i => i.p._id !== id)); this.sync(); }
  clear() { this.items.set([]); this.sync(); }
}
