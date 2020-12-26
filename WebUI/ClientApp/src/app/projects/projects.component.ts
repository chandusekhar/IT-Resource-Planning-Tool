import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../api.service';
import { AddEditProjectComponent } from '../add-edit-project/add-edit-project.component';
import { AppComponent } from '../app.component';
import swal from 'sweetalert2';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [AddEditProjectComponent, DatePipe]
})

export class ProjectsComponent implements OnInit {
  
  constructor(private _apiService: ApiService,
    private _appComponent: AppComponent,
    private modalService: NgbModal,
    private datePipe: DatePipe) {

    this._appComponent.navActive = "Projects";
    this._appComponent.title = "Projects";
  }

  public statusColorClass: any;
  public totalProjectsCount: number;
  public projects: Array<any>;
  public projectDetails: Array<any>;
  public teamMembers: Array<any>;
  public projectTypes: Array<any>;
  public projectInputModel = {
    projectTeamMembers: []
  };
  p: number = 1;
  _projects = [];

  ngOnInit() {
    
    this.getProjects();
    this.getTeamMembers();
    this.getProjectTypes();
    this.projects = this._projects.sort((a: any, b: any) =>
      new Date(a.plannedStartDate).getTime() - new Date(b.plannedStartDate).getTime()
    );
  }
  getProjects() {
    this._apiService.getProjects().subscribe(res => {
      var _projects = this.projects;
      this.projects = res.json();
      this.totalProjectsCount = res.json().length;
      this.projects.forEach(function (value, index) {
        if (value.status == ProjectStatus.Cancelled) {
          value.statusText = "Cancelled";
          value.statusClass = "dot bg-danger";
        }
        else if (value.status == ProjectStatus.Completed) {
          value.statusText = "Completed";
          value.statusClass = "fas fa-check text-success";
        }
        else if (value.status == ProjectStatus.InProgress) {
          value.statusText = "In Progress";
          value.statusClass = "dot bg-warning";
        }
        else if (value.status == ProjectStatus.NotStarted) {
          value.statusText = "Not Started";
          value.statusClass = "fas fa-exclamation-triangle text-gray";
        }
        else {
          value.statusText = "On Hold";
          value.statusClass = "fas fa-exclamation-triangle text-warning";
        }

        if (value.priority == ProjectPriority.Critical) {
          value.priorityClass = "fas fa-exclamation-triangle text-danger";
          value.priorityText = "Critical";
        }
        else if (value.priority == ProjectPriority.Low) {
          value.priorityClass = "fas fa-flag text-gray";
          value.priorityText = "Low";
        }
        else if (value.priority == ProjectPriority.Normal) {
          value.priorityClass = "fas fa-flag text-info";
          value.priorityText = "Normal";
        }
        else if (value.priority == ProjectPriority.High) {
          value.priorityClass = "fas fa-flag text-danger";
          value.priorityText = "High";
        }

        value.membersInvolved = [];

        if (value.projectTeamMembers.length > 0) {
          value.projectTeamMembers.forEach(function (member, index) {
            var _memberDetails = {
              employeeCode: member.teamMember.employeeCode,
              employeeName: member.teamMember.employeeName,
              initials: member.teamMember.employeeName.split(" ").map((n) => n[0]).join("")
            }
            if (value.membersInvolved.length > 0) {

              if (!value.membersInvolved.some(a => a.employeeCode == _memberDetails.employeeCode)) {
                value.membersInvolved.push(_memberDetails);
              }
            }
            else {
              value.membersInvolved.push(_memberDetails);
            }

          })
        }
      });
      console.log(res);
    });
  }

  getTeamMembers() {
    this._apiService.getTeamMembers().subscribe(data => {
      this.teamMembers = data.json();
    });
  }


  addNewProject() {
    const modalRef = this.modalService.open(AddEditProjectComponent, { size: 'lg' });
    modalRef.componentInstance.projects = this.projects;
    this.projectInputModel.projectTeamMembers = this.teamMembers;

    modalRef.componentInstance.projectInputModel = this.projectInputModel;
    modalRef.componentInstance.teamMembers = this.teamMembers;
    modalRef.componentInstance.projectTypes = this.projectTypes;

  }

  editProject(project: any) {
    const modalRef = this.modalService.open(AddEditProjectComponent, { size: 'lg' });
    modalRef.componentInstance.projects = this.projects;
    var _dateTransformer = this.datePipe;
    var _teamMembers = this.teamMembers;

    _teamMembers.forEach(function (mem) {
      project.projectTeamMembers.forEach(function (val) {
        if (val.employeeCode == mem.employeeCode) {
          mem.checked = true;
          mem.allocatedOnDate = _dateTransformer.transform(val.allocatedOnDate, 'yyyy-MM-dd');
          mem.releasedOnDate = _dateTransformer.transform(val.releasedOnDate, 'yyyy-MM-dd');
          mem.description = val.description;
        }

        val.teamMember = mem.teamMember;
      });
    });
    project.plannedStartDate = new Date(project.plannedStartDate);
    if (project.endDate < project.plannedStartDate) {
      project.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
    else {
      project.endDate = this.datePipe.transform(project.endDate, 'yyyy-MM-dd');
    }
    project.plannedStartDate = this.datePipe.transform(project.plannedStartDate, 'yyyy-MM-dd');
    modalRef.componentInstance.projectInputModel = project;
    modalRef.componentInstance.projectInputModel.projectTeamMembers = _teamMembers;
    modalRef.componentInstance.teamMembers = this.teamMembers;
    modalRef.componentInstance.projectTypes = this.projectTypes;
    modalRef.componentInstance.CRUDOperationType = "edit";
  }

  getProjectTypes() {
    this._apiService.getProjectTypes().subscribe(res => {
      this.projectTypes = res.json();
    });

  }

  deleteProject(projectId) {
    var _apiService = this._apiService;
    swal.fire({
      text: "Sure to delete this Project?",
      icon: 'info',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#DC3545'

    }).then(function () {
      _apiService.deleteProject(projectId).subscribe(res => {
        if (res.status == 200) {

          swal.fire({
            text: 'Project was successfully deleted.',
            icon: 'success'
          }).then(function () {
            //this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            window.location.reload();
            //}); 
          });
        }
      });
    });

  }
}

enum ProjectStatus {
  NotStarted = 3,
  InProgress = 1,
  OnHold = 2,
  Completed = 4,
  Cancelled = 5
}

enum ProjectPriority {
  Low = 2,
  Normal = 4,
  High = 3,
  Critical = 1
}
