import { DatePipe } from '@angular/common';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { ApiService } from '../../api.service';
import { AddEditProjectComponent } from '../add-edit-project/add-edit-project.component';
import { AppComponent } from '../app.component'; 

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [AddEditProjectComponent, DatePipe]
})
export class HomeComponent implements OnInit {
     
    constructor(
        private _apiService: ApiService,
        public _appComponent: AppComponent,
        public _addProjects: AddEditProjectComponent,
        private modalService: NgbModal,
        private datePipe: DatePipe) { 
    }

    _operationType: string;

    public statusColorClass: any;
    public projects: any;
    public projectDetails: Array<any>;
    public teamMembers: any;
    public totalProjectsCount: number;
    public totalTeamMembersCount: number;
    public projectTypes: any;
    public projectInputModel = {
        projectTeamMembers: []
    };
    public projectTypeInputModel: any;
    public teamMembersInputModel: any;
    _projects = [];
    ngOnInit() {
        this._appComponent.navActive = "Dashboard";
        this._appComponent.title = "Dashboard";
        this.getProjects();
        this.getTeamMembers();
        this.getProjectTypes();

        this.projects = this._projects.sort((a: any, b: any) =>
            new Date(a.plannedStartDate).getTime() - new Date(b.plannedStartDate).getTime()
        );
        this.projectTypeInputModel = {};
        this.teamMembersInputModel = {};

    }

    getProjects() {

        this._apiService.getProjects().subscribe(res => {
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

        });
    }

    getTeamMembers() {

        this._apiService.getTeamMembers().subscribe(res => {
            this.teamMembers = res.json();
            this.totalTeamMembersCount = res.json().length;
        });
    }

    getProjectTypes() {
        this._apiService.getProjectTypes().subscribe(res => {
            this.projectTypes = res.json();
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

    addProjectTypes(content: TemplateRef<any>) {
        this.modalService.open(content, { size: 'sm' });
    }

    closeModal() {
        this.modalService.dismissAll();
    }

    editProjectType(content: TemplateRef<any>, projectTypeObj, opType) {
        this._operationType = opType;
        this.projectTypeInputModel = projectTypeObj;
        this.modalService.open(content, { size: 'sm' });
    }

    saveProjectTypes(projectTypeInput) {
        this._apiService.SaveProjectTypes(projectTypeInput, this._operationType).subscribe(res => {
            if (res.status == 200) {
                swal.fire({
                    text: "Project type was successfully saved.",
                    icon: 'success'
                });
            }
            else {
                swal.fire({
                    text: "Some error occurred. Please try again later.",
                    icon: 'error'
                });
            }
            this.modalService.dismissAll();
            this.getProjectTypes();

        })
    }

    deleteProjectType(pTypeId) {
        var _apiService = this._apiService;
        swal.fire({
            text: "Sure to delete this Project Type?",
            icon: 'info',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#DC3545'

        }).then(function () {
            _apiService.deleteProjectType(pTypeId).subscribe(res => {
                if (res.status == 200) {

                    swal.fire({
                        text: 'Project Type was successfully deleted.',
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

    addNewMember(content: TemplateRef<any>) {
        this.modalService.open(content, { size: "sm" });
    }

    saveTeamMembers(teamMembersInputModel) {
        this.teamMembersInputModel = teamMembersInputModel;
        this._apiService.saveTeamMembers(teamMembersInputModel, this._operationType).subscribe(res => {
            if (res.status == 200) {
                swal.fire({
                    text: "Team Member added successfully",
                    icon: 'success'
                });
                this.getTeamMembers();
            }
            else {
                swal.fire({
                    text: "Some error occurred. Please try again later.",
                    icon: 'error'
                });
            }
        });
    }

    editMember(content: TemplateRef<any>, teamMembersInputModel, opType) {
        this.teamMembersInputModel = teamMembersInputModel;
        this._operationType = opType;
        this.modalService.open(content, { size: "sm" });
    }

    deleteMember(empCode) {
        var _apiService = this._apiService;
        swal.fire({
            text: "Sure to delete this Member?",
            icon: 'info',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#DC3545'

        }).then(function () {
            _apiService.deleteTeamMember(empCode).subscribe(res => {
                if (res.status == 200) {

                    swal.fire({
                        text: 'Member was successfully deleted.',
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

