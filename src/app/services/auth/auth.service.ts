import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;
  loggedIn : boolean;
  public currentUser;

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user){
          this.loggedIn = true;
          this.currentUser = {name: user.displayName, email: user.email, imageUrl: user.photoURL, uid: user.uid}
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }else{
          this.loggedIn = false;
          this.currentUser = null;
          return of(null);
        }
      })
    )
  }
  


public login(email, password){
  return this.afAuth.auth.signInWithEmailAndPassword(email, password)
}

public signup(email, password){
  return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
}

}
