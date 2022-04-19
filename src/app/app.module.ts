import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RecaptchaModule } from 'angular-google-recaptcha';

import { SocialLoginModule, SocialAuthServiceConfig } from "angularx-social-login";
// import { GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SidenavModule } from './main/sidenav/sidenav.module';
import { ToolbarModule } from './main/toolbar/toolbar.module';
import { FooterModule } from './main/footer/footer.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    RecaptchaModule.forRoot({ siteKey: '6LeZzs0UAAAAAIvhaHwCgrCmaqj_em0I58VOHITo' }),
    SocialLoginModule,
    MatButtonModule, MatIconModule, MatSnackBarModule,
    SidenavModule, ToolbarModule, FooterModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ], //For MDBBootstrapModule
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '139381155536-901pdp8e39mt0o94blo90n0i5pl8sllf.apps.googleusercontent.com' //VFL Group on LocalhostTest: https://console.developers.google.com/
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('321402965561948'),  //Chua cap nhat ID moi 
          },
          // {
          //   id: AmazonLoginProvider.PROVIDER_ID,
          //   provider: new AmazonLoginProvider(
          //     'clientId'
          //   ),
          // },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
