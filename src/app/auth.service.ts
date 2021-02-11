import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  constructor(
    public auth: AngularFireAuth
  ) { }
  login() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(_ => this.loggedIn = true);
  }
  logout(): void {
    if (confirm('Logout dari aplikasi ini?')) {
      this.auth.signOut()
        .then(_ => this.loggedIn = false);
    }
  }
}
