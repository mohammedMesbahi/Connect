import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FeedComponent } from './components/feed/feed.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ErrorInterceptor } from './services/error.interceptor';
import { NavComponent } from './components/nav/nav.component';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostComponent } from './components/post/post.component';
import { SummaryPipe } from './tools/pips/summary.pipe';
import { ActionsService } from './services/actions.service';
import { MessagesService } from './services/messages.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment.prod';
import { InboxComponent } from './inbox/inbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateComponent } from './components/create/create.component';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { NotificationService } from './services/notification.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LightPostComponent } from './components/light-post/light-post.component';
import { SharedModule } from '../app/shared/shared.module';
const config: SocketIoConfig = { url: `${environment.apiUrl}/messages_notifications`, options: { withCredentials: true } };
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FeedComponent,
    NotFoundComponent,
    NavComponent,
    MainComponent,
    HomeComponent,
    SearchComponent,
    MessagesComponent,
    NotificationsComponent,
    ProfileComponent,
    PostComponent,
    SummaryPipe,
    InboxComponent,
    CreateComponent,
    UserProfileComponent,
    LightPostComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [AuthService, ActionsService, MessagesService, UserService, PostService, NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
