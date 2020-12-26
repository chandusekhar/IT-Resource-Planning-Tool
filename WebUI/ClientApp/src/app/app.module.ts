import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { FooterComponent } from './footer/footer.component';
import { HttpModule } from '@angular/http';
import { ReportsComponent } from './reports/reports.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { TooltipModule } from 'ngx-tooltip';
//import { GoogleChartsModule, ScriptLoaderService } from 'angular-google-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApiService } from '../api.service'; 
import { LoaderService } from '../loader.service';
import { LoaderInterceptor } from '../loader-interceptor.service';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddEditProjectComponent } from './add-edit-project/add-edit-project.component';
import { TeamMembersComponent } from './team-members/team-members.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    SidebarMenuComponent,
    FooterComponent,
    ReportsComponent,
    ProjectsComponent,
    AddEditProjectComponent,
    ProjectdetailsComponent,
    LoaderComponent,
    TeamMembersComponent
  ],
  entryComponents: [
    AddEditProjectComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpModule,
    HttpClientModule,
    FormsModule,
    //GoogleChartsModule,
    NgApexchartsModule, 
    TooltipModule,
    NgbModule,
    NgxPaginationModule,   
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'reports', component: ReportsComponent },
      { path: 'home', component: HomeComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'team-members', component: TeamMembersComponent },
      { path: 'projects/:projectId', component: ProjectdetailsComponent }
    ])
  ],
  providers: [
    ApiService, 
    AddEditProjectComponent,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
