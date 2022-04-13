import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() lang!: string;
  langsData: any = [
    {
      lang: 'vi',
      fbLogin: {
        icon: 'fab fa-facebook-f',
        title: 'Đăng nhập bằng Facebook'
      },
      ggLogin: {
        icon: 'fab fa-google',
        title: 'Đăng nhập bằng Google'
      }
    },
    {
      lang: 'en',
      fbLogin: {
        icon: 'fab fa-facebook-f',
        title: 'Sign in with Facebook'
      },
      ggLogin: {
        icon: 'fab fa-google',
        title: 'Sign in with Google'
      }
    }
  ];
  langContent: any = {};

  @Output() emitSocialUser = new EventEmitter();

  user: SocialUser;
  loggedIn: boolean;

  constructor(
    private languageService: LanguageService,
    private messageService: MessageService,
    private authService: SocialAuthService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data;
        this.getLangData();
      }
    });
  }

  ngOnInit(): void {
    this.getLangData();

    this.authService.authState.subscribe((user) => {
      // console.log(user);
      this.user = user;
      this.loggedIn = (user != null);
      if (user) {
        this.emitSocialUser.emit(this.user);
      }
    }, err => console.log(err));
  }

  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
 
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  } 
 
  signOut(): void {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
