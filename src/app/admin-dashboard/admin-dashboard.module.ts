import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdmindashboarComponent } from './components/admindashboar/admindashboar.component';
import { UserslistComponent } from './components/userslist/userslist.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PostsComponent } from './components/posts/posts.component';
import { NewpostsComponent } from './components/newposts/newposts.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NewUsersComponent } from './components/new-users/new-users.component';
import { UsersService } from './services/users.service';
import { PostComponent } from './components/post/post.component';
import { NewPostComponent } from './components/new-post/new-post.component';
@NgModule({
  declarations: [
    AdmindashboarComponent,
    UserslistComponent,
    UserProfileComponent,
    PostsComponent,
    NewpostsComponent,
    NavbarComponent,
    NewUsersComponent,
    PostComponent,
    NewPostComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: "", redirectTo: "users", pathMatch: "full" },
      {
        path: '',
        component: AdmindashboarComponent,
        children: [
          { path: 'users', component: UserslistComponent },
          { path: 'new-users', component: NewUsersComponent },
          { path: 'users/:id', component: UserProfileComponent },
          { path: 'posts', component: PostsComponent },
          { path: 'new-posts', component: NewpostsComponent }
        ]
      },
    ])
  ],
  providers: [
    UsersService
  ]
})
export class AdminDashboardModule { }
