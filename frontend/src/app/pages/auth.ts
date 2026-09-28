import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth, msg } from '../core';

@Component({
  standalone: true, imports: [FormsModule, RouterLink], template: `
<section class="card auth"><h1>Welcome back</h1>
<form (ngSubmit)="go()"><input name="e" type="email" placeholder="Work email" [(ngModel)]="email" required>
<input name="p" type="password" placeholder="Password" [(ngModel)]="pw" required><button class="btn" [disabled]="busy">Sign in</button></form>
<button class="btn ghost" (click)="demo()">⚡ Try the demo account</button>@if (err) { <p class="err">{{ err }}</p> }
<p><a routerLink="/forgot">Forgot password?</a> · <a routerLink="/register">Create account</a></p></section>`
})
export class Login {
  a = inject(Auth); r = inject(Router); route = inject(ActivatedRoute); email = ''; pw = ''; err = ''; busy = false;
  ngOnInit() { if (this.route.snapshot.queryParamMap.get('demo')) this.demo(); }   // /login?demo=1 => auto sign-in for recruiters
  go() { this.busy = true; this.a.login({ email: this.email, password: this.pw }).subscribe({ next: () => this.r.navigate(['/catalog']), error: e => { this.err = msg(e); this.busy = false; } }); }
  demo() { this.a.demo().subscribe({ next: () => this.r.navigate(['/catalog']), error: e => this.err = msg(e) }); }
}

@Component({
  standalone: true, imports: [FormsModule, RouterLink], template: `
<section class="card auth"><h1>Create account</h1>
@if (!ok) { <form (ngSubmit)="go()"><input name="n" placeholder="Full name" [(ngModel)]="f.name" required><input name="c" placeholder="Company" [(ngModel)]="f.company">
<input name="e" type="email" placeholder="Work email" [(ngModel)]="f.email" required><input name="p" type="password" placeholder="Password (6+ chars)" [(ngModel)]="f.password" required>
<button class="btn">Sign up</button></form> } @else { <p class="ok">{{ ok }}</p>@if (dev) { <p>Dev mode (no SMTP): <a [href]="dev">click to verify</a></p> } }
@if (err) { <p class="err">{{ err }}</p> }<p>Already registered? <a routerLink="/login">Sign in</a></p></section>`
})
export class Register {
  a = inject(Auth); f: any = {}; ok = ''; err = ''; dev = '';
  go() { this.a.register(this.f).subscribe({ next: r => { this.ok = r.message; this.dev = r.devLink; }, error: e => this.err = msg(e) }); }
}

@Component({
  standalone: true, imports: [RouterLink], template: `<section class="card auth"><h1>Email verification</h1><p [class]="bad ? 'err' : 'ok'">{{ text }}</p><a routerLink="/login" class="btn">Go to sign in</a></section>`
})
export class Verify {
  @Input() token = ''; a = inject(Auth); text = 'Verifying…'; bad = false;
  ngOnInit() { this.a.verify(this.token).subscribe({ next: r => this.text = r.message, error: e => { this.text = msg(e); this.bad = true; } }); }
}

@Component({
  standalone: true, imports: [FormsModule, RouterLink], template: `
<section class="card auth"><h1>Forgot password</h1><form (ngSubmit)="go()"><input name="e" type="email" placeholder="Your email" [(ngModel)]="email" required><button class="btn">Send reset link</button></form>
@if (ok) { <p class="ok">{{ ok }}</p> }@if (dev) { <p>Dev mode: <a [href]="dev">open reset link</a></p> }<a routerLink="/login">Back</a></section>`
})
export class Forgot {
  a = inject(Auth); email = ''; ok = ''; dev = '';
  go() { this.a.forgot(this.email).subscribe(r => { this.ok = r.message; this.dev = r.devLink; }); }
}

@Component({
  standalone: true, imports: [FormsModule, RouterLink], template: `
<section class="card auth"><h1>New password</h1><form (ngSubmit)="go()"><input name="p" type="password" placeholder="New password (6+ chars)" [(ngModel)]="pw" required><button class="btn">Update password</button></form>
@if (ok) { <p class="ok">{{ ok }}</p><a routerLink="/login" class="btn">Sign in</a> }@if (err) { <p class="err">{{ err }}</p> }</section>`
})
export class Reset {
  @Input() token = ''; a = inject(Auth); pw = ''; ok = ''; err = '';
  go() { this.a.reset(this.token, this.pw).subscribe({ next: r => this.ok = r.message, error: e => this.err = msg(e) }); }
}
