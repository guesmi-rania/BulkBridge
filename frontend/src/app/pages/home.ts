import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true, imports: [RouterLink], template: `
<section class="hero"><h1>Wholesale buying,<br><span>made simple.</span></h1>
<p>Volume pricing, minimum order quantities and fast reordering for professional buyers.</p>
<div class="row"><a routerLink="/catalog" class="btn">Browse catalog</a><a routerLink="/login" [queryParams]="{demo:1}" class="btn ghost">⚡ Instant demo</a></div></section>
<section class="grid f"><div class="card"><h3>📉 Tiered pricing</h3><p>Prices drop automatically as quantity grows.</p></div>
<div class="card"><h3>📦 MOQ rules</h3><p>Minimum order quantities enforced server-side.</p></div>
<div class="card"><h3>🔐 Secure accounts</h3><p>Email verification, JWT auth and password reset.</p></div></section>`
})
export class Home {}
