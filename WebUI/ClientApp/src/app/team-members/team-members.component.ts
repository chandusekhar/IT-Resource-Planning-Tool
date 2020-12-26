import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
    selector: 'app-team-members',
    templateUrl: './team-members.component.html',
    styleUrls: ['./team-members.component.css']
})
/** TeamMembers component*/
export class TeamMembersComponent implements OnInit {

  public teamMembers: Array<any>; 
  public totalTeamMembersCount: number;

  constructor(private _apiService: ApiService) {

  }

  ngOnInit(): void {
    this.getTeamMembers();
  }

  getTeamMembers() {
    this._apiService.getTeamMembers().subscribe(res => {
      this.teamMembers = res.json();
      this.totalTeamMembersCount = res.json().length;   
      console.log("Team Members.....");
      console.log(res);
    });
  }
}
