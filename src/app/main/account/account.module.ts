import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { SocialLoginComponent } from './social-login/social-login.component';
import { SignUpComponent, SignUpFormComponent } from './sign-up/sign-up.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

import { UserAvatarTemplateModule } from 'src/app/templates/user-avatar-template/user-avatar-template.module';
import { EmailTemplateModule } from 'src/app/templates/email-template/email-template.module';
import { PhoneNumberTemplateModule } from 'src/app/templates/phone-number-template/phone-number-template.module';
import { ProcessingTemplateModule } from 'src/app/templates/processing-template/processing-template.module';

//Create component: npm run ng g c main/account/
@NgModule({
  declarations: [LoginComponent, UserMenuComponent, SocialLoginComponent, SignUpComponent, SignUpFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatCheckboxModule,
    MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule,
    UserAvatarTemplateModule,
    EmailTemplateModule, PhoneNumberTemplateModule,
    ProcessingTemplateModule
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ],
  entryComponents: [
    SignUpFormComponent
  ],
  exports: [LoginComponent, UserMenuComponent]
})
export class AccountModule { }
