import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrls: ['./add-edit-project.component.css']
})

export class AddEditProjectComponent {

  @Input() projectInputModel: any;
  @Input() projects: any;
  @Input() teamMembers: any;
  @Input() projectTypes: any;
  @Input() CRUDOperationType: string;

  constructor(
    private _apiService: ApiService,
    private router: Router,
    private modalService: NgbModal) {
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  saveProjectData(projectInputs) {
    
    this.projectInputModel = projectInputs;
    if (this.CRUDOperationType != "edit") {
      if (this.projects.find(project => project.projectName.toLowerCase() == projectInputs.projectName.toLowerCase()) != undefined) {
        swal.fire({
          text: 'Project with same name already exists! Please recheck the name',
          icon: 'warning'
        });
        return;
      }
    }
    
    if (new Date(projectInputs.endDate) < new Date(projectInputs.plannedStartDate)) {
      swal.fire({
        text: 'End Date can not be less than "Planned Start Date". Please choose another date',
        icon: 'warning'
      });
      return;
    }

    if (projectInputs.projectTeamMembers.length > 0) {
      var _teamMembers = [];
      projectInputs.projectTeamMembers.forEach(function (value) {
        if (new Date(value.releasedOnDate) < new Date(value.allocatedOnDate)) {
          swal.fire({
            text: 'Release Date of ' + value.employeeName + ' can not be less than the Allocated Date. Please choose another date',
            icon: 'warning'
          });
          return;
        }

        if (value.checked) {
          _teamMembers.push(value);
        }

      });
      projectInputs.projectTeamMembers = _teamMembers;
    }
    console.log(projectInputs);


    this._apiService.SaveProjects(this.projectInputModel, this.CRUDOperationType).subscribe(data => {

        if (data.status == 200) {
          this.modalService.dismissAll();
          // this.router.navigateByUrl('/projects', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/projects']);
          // }); 
          swal.fire({
            text: "Project was successfully added.",
            icon: 'success'
          });
        }
        else {
          swal.fire({
            text: "Some error occurred. Please try again!",
            icon: 'warning'
          });
        }
      });
     
   
  }

  setDefaultReleaseDate(endDate) {
    this.projectInputModel.projectTeamMembers.forEach(function (val) {
      val.releasedOnDate = endDate;
    });
    console.log(this.projectInputModel);
  }

  setDefaultAllocatedStartDate(startDate) {
    this.projectInputModel.projectTeamMembers.forEach(function (val) {
      val.allocatedOnDate = startDate;
    })
  }
}
