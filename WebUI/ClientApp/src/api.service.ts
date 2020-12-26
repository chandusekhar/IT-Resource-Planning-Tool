import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ApiService {

  private BASE_URL: string = "https://localhost:44397/api/";   

  constructor(private http: Http) {
     
  } 

  getProjectTypes() {
    return this.http.get(this.BASE_URL + "Dashboard/GetProjectTypes", {}) 
  } 

  //private handleError(error: any) { 
  //  let errMsg = error.json();
  //  return Observable.throw(errMsg);
  //}
  //private extractData(res: Response) {
  //  let body = res.json();
  //  return body || [];
  //} 
  deleteProject(projectId) {
    let delUrl = this.BASE_URL + 'Projects/' + projectId;
    return this.http.delete(delUrl, {});
  }

  getProjects() {
    let getUrl = this.BASE_URL + 'Projects/';
    return this.http.get(getUrl, {})
  }

  getProjectDetails(projectId) {
    let getUrl = this.BASE_URL + 'Projects/' + projectId;
    return this.http.get(getUrl, {});
  }

  getTeamMembers() {
    let getUrl = this.BASE_URL + 'TeamMembers/List';
    return this.http.get(getUrl, {});
  }

  SaveProjects(projectInputModel, operationType) {
    let postUrl = this.BASE_URL + 'Projects/';
    let _headers = new Headers({ 'Content-Type': 'application/json' });

    if (operationType == "edit") {
      postUrl += projectInputModel.projectId;
      return this.http.put(postUrl, projectInputModel, {
        headers: _headers
      });
    }
    
    return this.http.post(postUrl, projectInputModel, {
      headers: _headers
    });
  }

  SaveProjectTypes(projectTypeInputModel, operationType) {
    let postUrl = this.BASE_URL + 'Dashboard/EditProjectTypes/';
    let _headers = new Headers({ 'Content-Type': 'application/json' });

    if (operationType == "edit") {
      postUrl += projectTypeInputModel.projectTypeId;
      return this.http.put(postUrl, projectTypeInputModel, {
        headers: _headers
      });
    }

    return this.http.post(postUrl, projectTypeInputModel, {
      headers: _headers
    });
  }

  deleteProjectType(pTypeId) {
    let delUrl = this.BASE_URL + 'Dashboard/DeleteProjectTypes/' + pTypeId;
    return this.http.delete(delUrl, {});
  }

  saveTeamMembers(teamMembersModel, operationType) {
    let postUrl = this.BASE_URL + 'TeamMembers/';
    let _headers = new Headers({ 'Content-Type': 'application/json' });

    if (operationType == "edit") {
      postUrl += teamMembersModel.employeeCode;
      return this.http.put(postUrl, teamMembersModel, {
        headers: _headers
      });
    }

    return this.http.post(postUrl, teamMembersModel, {
      headers: _headers
    });
  }

  deleteTeamMember(memCode) {
    let delUrl = this.BASE_URL + 'TeamMembers/' + memCode;
    return this.http.delete(delUrl, {});
  }
}
