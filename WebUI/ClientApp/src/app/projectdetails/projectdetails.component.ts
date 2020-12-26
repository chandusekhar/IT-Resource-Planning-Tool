import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../../api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import { AddEditProjectComponent } from '../add-edit-project/add-edit-project.component';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css'],
  providers: [AddEditProjectComponent, DatePipe]
})

export class ProjectdetailsComponent implements OnInit { 
  constructor(private route: ActivatedRoute,
    private _apiService: ApiService,
    private modalService: NgbModal,
    private datePipe: DatePipe) {

  }
  public statusColorClass: any;
  public projectId: string;
  public project: any;
  public title: string;
  public type: string;
  public chartData: Array<any>;
  public columnNames: Array<any>;
  public chartOptions: {};
  public chartWidth: number;
  public chartHeight: number;
  public phasesChartData: Array<any>;
  public phasesChartTitle: string;
  public phaseChartType: string;
  public phasesChartOptions: any;
  public phasesChartHeight: any;
  public teamMembers: any;
  public projects: Array<any>;
  public projectTypes: Array<any>;
  public projectInputModel = {
    projectTeamMembers: []
  };

  ngOnInit() {
    this.projectId = this.route.snapshot.params['projectId'];
    this.getTeamMembers();
    this.getProjects();
    this.getProjectDetails();
    this.title = "Project Member's Contributions";
    this.type = 'PieChart';
    this.phaseChartType = 'Timeline';
    this.phasesChartTitle = "Project's Divisions/Phases Timings";
    this.chartWidth = 500;
    this.chartHeight = 400;
    this.phasesChartHeight = 250;
    this.phasesChartOptions = {
      timeline: {
        groupByRowLabel: false, colorByRowLabel: true,         
      },
      chartArea: {
        height: "94%",
        width: "94%"
      },
      height: "250",
      width: "100%",
      hAxis: {
        title: 'TimeLine',
        textPosition: 'in'
      },
      axes: {
        x: {
          0: { side: 'top' }
        }
      }
    }
  }

  getTeamMembers() {
    this._apiService.getTeamMembers().subscribe(data => {
      this.teamMembers = data.json();
    });
  }
  getProjects() {
    this._apiService.getProjects().subscribe(res => {
      var _projects = this.projects;
      this.projects = res.json();
     
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

  getProjectDetails() {
    this._apiService.getProjectDetails(this.projectId).subscribe(res => {
      this.project = res.json();
      this.getSet_ProjectDeadline();
      if (this.project.status == ProjectStatus.Cancelled) {
        this.project.statusColorClass = "dot bg-danger";
        this.project.statusText = "Cancelled";
      }
      else if (this.project.status == ProjectStatus.Completed) {
        this.project.statusColorClass = "fas fa-check text-success";
        this.project.statusText = "Completed";
      }
      else if (this.project.status == ProjectStatus.InProgress) {
        this.project.statusColorClass = "dot bg-success";
        this.project.statusText = "Ongoing";
      }
      else if (this.project.status == ProjectStatus.NotStarted) {
        this.project.statusColorClass = "fas fa-exclamation-triangle text-gray";
        this.project.statusText = "Not-Started";
      }
      else {
        this.project.statusColorClass = "dot bg-warning";
        this.project.statusText = "On-Hold";
      }
      this.getSet_ProjectPriority();
      //this.generateChart(res.json());

      this.project.projectDetails.forEach(function (val) {
        if (new Date(val.taskCompletedOn) < new Date(val.taskStartedOn)) {
          val.taskOngoing = true;
        }
        else if (new Date(val.taskCompletedOn) > new Date()) {
          val.taskOngoing = true;
        }
        else {
          val.taskOngoing = false;
        }
      });

      console.log(this.phasesChartData);
    });
  }


  //private generateChart(data: any) {
  //  this.project.membersInvolved = [];
  //  var _membersInvolved = [];
  //  var mCount = 0;
  //  var mTotalWorkDays = 100;
  //  var _releaseManger = this.project.releaseManager.employeeCode;
  //  this.project.projectTeamMembers.forEach(function (member, index) {

  //    if (new Date(member.releasedOnDate) < new Date(member.allocatedOnDate)) {
  //      member.releasedOnDate = new Date();
  //      member.isCurrentWorking = true;
  //    }
  //    else {
  //      member.isCurrentWorking = false;
  //    }
  //    var _memberDetails = {
  //      employeeName: member.teamMember.employeeName,
  //      employeeCode: member.teamMember.employeeCode,
  //      initials: member.teamMember.employeeName.split(" ").map((n) => n[0]).join(""),
  //      appearance: mCount,
  //      allocatedOnDate: member.allocatedOnDate,
  //      releasedOnDate: member.releasedOnDate,
  //      totalWorkDays: mTotalWorkDays,
  //      isCurrentWorking: member.isCurrentWorking,
  //    };

  //    if (_releaseManger != _memberDetails.employeeCode) {

  //      _memberDetails.totalWorkDays = datediff(new Date(member.allocatedOnDate), new Date(member.releasedOnDate));

  //    }
  //    if (_membersInvolved.length > 0) {

  //      if (!_membersInvolved.some(a => a.employeeCode == _memberDetails.employeeCode)) {
  //        _membersInvolved.push(_memberDetails);
  //      }
  //      else {
  //        mCount++;

  //      }
  //    }
  //    else {
  //      _membersInvolved.push(_memberDetails);
  //      mCount = 1;
  //    }

  //  });

  //  this.generateMemberContributionChart(_membersInvolved);

  //  this.generateTimelineChart();
  //}

  private generateMemberContributionChart(_membersInvolved: any[]) {
    var _chartData = [];
    this.project.membersInvolved = _membersInvolved;
    this.project.membersInvolved.forEach(function (val) {
      var _mem = [];
      _mem.push(val.employeeName, val.totalWorkDays);
      _chartData.push(_mem);
    });
    this.chartData = _chartData;

    console.log(_chartData);
  }

  //private generateTimelineChart() {
  //  var _phasesChartData = [];

  //  if (new Date(this.project.endDate) < new Date(this.project.plannedStartDate)) {
  //    this.project.endDate = new Date();
  //  }
      
  //  var _prd = [];
     
  //  this.project.projectTeamMembers.forEach(function (val) {

  //    _prd = [];
  //    if (new Date(val.releasedOnDate) < new Date(val.allocatedOnDate)) {
  //      val.releasedOnDate = new Date();
  //    }

  //    _prd.push(val.teamMember.employeeName, val.description == null ? "" : val.description, new Date(val.allocatedOnDate), new Date(val.releasedOnDate));
  //    _phasesChartData.push(_prd);
  //  });


  //  this.phasesChartData = _phasesChartData;
  //}

  private getSet_ProjectPriority() {
    if (this.project.priority == ProjectPriority.Critical) {
      this.project.priorityClass = "fas fa-exclamation-triangle text-danger";
      this.project.priorityText = "Critical";
    }
    else if (this.project.priority == ProjectPriority.Low) {
      this.project.priorityClass = "fas fa-flag text-gray";
      this.project.priorityText = "Low";
    }
    else if (this.project.priority == ProjectPriority.Normal) {
      this.project.priorityClass = "fas fa-flag text-info";
      this.project.priorityText = "Normal";
    }
    else if (this.project.priority == ProjectPriority.High) {
      this.project.priorityClass = "fas fa-flag text-danger";
      this.project.priorityText = "High";
    }

  }
   
  private getSet_ProjectDeadline() {
    if (this.project.endDate != null || this.project.endDate > this.project.plannedStartDate) {
      var _deadlineDueDate = new Date(this.project.endDate);
      _deadlineDueDate = new Date(_deadlineDueDate.setDate(_deadlineDueDate.getDate() - 5));
      var _currentDate = new Date();
      this.project.deadlineClass = "";
      this.project.projectCompletionDaysLeft = "";
      if (new Date(_deadlineDueDate.setDate(_deadlineDueDate.getDate() - 5)) >= _currentDate) {
        this.project.DeadlineClass = "text-danger";
      }

      if (_deadlineDueDate < new Date(this.project.endDate)) {
        this.project.projectCompletionDaysLeft = (new Date(this.project.endDate).getDate() - _currentDate.getDate()) + " days left";
      }
      else {
        this.project.projectCompletionDaysLeft = "Deadline crossed!";
      }

    }
  }


  editProject(project: any) {
    const modalRef = this.modalService.open(AddEditProjectComponent, { size: 'lg' });
    modalRef.componentInstance.projects = this.project;
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
            this.router.navigate('/projects');
            //}); 
          });
        }
      });
    });

  }
}


function datediff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
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
