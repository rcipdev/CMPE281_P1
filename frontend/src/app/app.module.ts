import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './signup/signup.component';
import {
  DialogContentExampleDialog,
  HomeComponent,
} from './home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from './service/auth.service';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { FileService } from './service/file.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SignupComponent,
    HomeComponent,
    DialogContentExampleDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    FormsModule,
    MatTableModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    AuthService,
    FileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
