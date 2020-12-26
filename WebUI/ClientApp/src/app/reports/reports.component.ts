import { ApiService } from '../../api.service';
import { AppComponent } from '../app.component';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { Component } from '@angular/core';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  fill: ApexFill,
  grid: ApexGrid,
  tooltip: ApexTooltip,
  yaxis: ApexYAxis

};

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})

export class ReportsComponent {
  public projects: Array<any>;
  public title: string;
  public type: string;
  public chartData: Array<any>;
  public columnNames: Array<any>;
  public chartOptions: Partial<ChartOptions>;
  public chartWidth: number;
  public chartHeight: number;
  public reportTitle: string;
  public projectid: string;
  public showChart: boolean;
  public fromDate: Date;
  public toDate: Date;
  public phasesChart: any;
  public membersInvolved: Array<any>;
  public memberid: string;
  public _teamMembers: Array<any>;//[{ code, name, color }];


  constructor(private _appComponent: AppComponent, private _apiService: ApiService) {
    this._appComponent.navActive = "Reports";
    this._appComponent.title = "Reports";

    this.getProjects();
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%",
          rangeBarGroupRows: false,
          dataLabels: {
            position: "top",
            hideOverflowingLabels: false
          },
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
        },
        offsetX: 0,
      },
      fill: {
        type: "solid",

      },
      xaxis: {
        type: "datetime",
        position: "top"
      },

      legend: {
        position: "top",
        horizontalAlign: "center"
      },
      tooltip: {
        custom: function (opts) {
          const fromDate = new Date(opts.y1).toDateString();
          const toDate = new Date(opts.y2).toDateString();
          const values = opts.ctx.rangeBar.getTooltipValues(opts);

          return (
            '<div class="apexcharts-tooltip-rangebar">' +
            '<div> <span class="series-name" style="color: ' +
            values.color +
            '">' +
            (values.seriesName ? values.seriesName : "") +
            "</span></div>" +
            '<div> <span class="category">' +
            values.ylabel +
            ' </span> <span class="value start-value">' +
            fromDate +
            '</span> <span class="separator">-</span> <span class="value end-value">' +
            toDate +
            "</span></div>" +
            "</div>"
          );
        }
      }
    };
    this.reportTitle = "<b class='text-muted'>Report Chart of all Projects to today's date</b>";
    this._teamMembers = [];
  }

  ngOnInit() {
    this.projectid = '0';
    this.showChart = true;
    this.memberid = '0';
  }

  getProjects() {
    this._teamMembers = [];
    var _tm = this._teamMembers;
    this._apiService.getProjects().subscribe(data => {
      this.projects = data.json();
      console.log(data.json());

      // Get all Team Members, alter Code
      this.projects.forEach(function (val) {
        val.projectTeamMembers.forEach(function (member) {
          if (_tm.length > 0) {
            if (!_tm.some(a => a.code == member.teamMember.employeeCode)) {
              _tm.push({ code: member.teamMember.employeeCode, name: member.teamMember.employeeName, color: getRandomColor() });
            }
          }
          else {
            _tm.push({ code: member.teamMember.employeeCode, name: member.teamMember.employeeName, color: getRandomColor() });
          }
        });
      });

      this._teamMembers = _tm;
      this.membersInvolved = _tm;
      this.getAllTimelineChart();
    });
  }

  getAllTimelineChart() {
    this.chartOptions.series = [];
    this.chartData = [];
    var _chartData = [];
    var _teamMembers = this._teamMembers;
    var _projects = this.projects;

    _teamMembers.forEach(function (member) {
      var _thisMember = { name: member.name, data: [], color: getRandomColor() };
      _projects.forEach(function (value) {
        if (value.status != '3') { // Not for 'Not Started Projects'

          var onGoing = false;

          if (new Date(value.endDate) < new Date(value.plannedStartDate)) {
            value.endDate = new Date();
            onGoing = true;
          }
          value.projectTeamMembers.forEach(function (_mem) {

            if (new Date(_mem.releasedOnDate) < new Date(_mem.allocatedOnDate)) {
              _mem.releasedOnDate = value.endDate;
            }
            _thisMember.data.push({
              x: value.projectName,// + "(from " + value.plannedStartDate + " - " + onGoing + ")",
              y: [new Date(value.plannedStartDate).getTime(), new Date(value.endDate).getTime()]
            });
            if (member.code == _mem.teamMember.employeeCode) {
              _thisMember.data.push({
                x: value.projectName,// + "(from " + value.plannedStartDate + " - " + onGoing + ")",
                y: [new Date(_mem.allocatedOnDate).getTime(), new Date(_mem.releasedOnDate).getTime()]
              });

            }
            else {
              //
            }
          })
        }

      });
      _chartData.push(_thisMember);
    });

    console.log(_chartData);
    this.chartOptions.series = _chartData;

  }

  getProjectReport(projectId) {
    this.chartOptions.series = [];
    this.chartData = [];
    var _phasesChartData = [];
    var reportTitle = "";
    var _showChart = true;
    var _projects = this.projects;
    var _teamMembers = this._teamMembers;
    _projects.filter(function (project) {
      if (project.status == '0') {
        _showChart = false;
        return;
      }
      return project.projectId == projectId;
    }).map(function (project) {

      var onGoing = false;
      if (new Date(project.endDate) < new Date(project.plannedStartDate)) {
        project.endDate = new Date();
        onGoing = true;
      }
      reportTitle = "<b class='text-muted'>Report chart for " + project.projectName + "</b> | Start Date: <span class='font-weight-bold text-info'>"
        + new Date(project.plannedStartDate).toDateString() + "</span> Completion Date: <span class='font-weight-bold text-info'>" +
        (onGoing ? "Not mentioned" : new Date(project.endDate).toDateString()) + "</span>"; 
      _showChart = true; 
      _teamMembers.forEach(function (member) {

        var _thisMember = { name: member.name, data: [], color: "" }; //TODO: Need to remove the color if not necessary!

        project.projectTeamMembers.forEach(function (_mem) {
          if (member.code == _mem.teamMember.employeeCode) {
            if (new Date(_mem.releasedOnDate) < new Date(_mem.allocatedOnDate)) {
              _mem.releasedOnDate = project.endDate;
            }

            _thisMember.data.push({
              x: project.projectName,
              y: [new Date(_mem.allocatedOnDate).getTime(), new Date(_mem.releasedOnDate).getTime()],
              //fillColor: _thisMember.color,
              dataLabel: _mem.description
            });
          }


        });
        _phasesChartData.push(_thisMember);
      })

    });

    this.chartOptions.series = _phasesChartData;
    this.chartOptions.plotOptions.bar.rangeBarGroupRows = false;
    this.reportTitle = reportTitle;
    this.showChart = _showChart;
    console.log(this.chartData);
  }

  getDateRangeChart() {
    this.chartOptions.series = [];
    this.chartData = [];
    var _startDate = this.fromDate;
    var _toDate = this.toDate;
    var _teamMembers = this._teamMembers;

    if (this.fromDate == null) {
      swal.fire({ text: "Please select 'From Date'", icon: 'warning' });
      return;
    }
    else if (this.toDate == null) {
      swal.fire({
        text: "Please select 'To Date'", icon: 'warning'
      });
      return;
    }
    else {
      this.reportTitle = "Report from <b class='text-info'>" + new Date(_startDate).toDateString() +
        "</b> to <b class='text-info'>" + new Date(_toDate).toDateString() +"</b>";
      var _chartData = [];
      var _projects = this.projects;

      _teamMembers.forEach(function (member) {
        var _thisMember = { name: member.name, data: [], color: "" };

        _projects.forEach(function (value) {
          if (value.status != '0') {

            if (new Date(value.endDate) < new Date(value.plannedStartDate)) {
              value.endDate = new Date();
            }
            if (new Date(value.endDate) > new Date(_toDate)) {
              value.endDate = _toDate;
            }

            value.projectTeamMembers.forEach(function (_mem) {

              if (new Date(_mem.releasedOnDate) < new Date(_mem.allocatedOnDate)) {
                _mem.releasedOnDate = value.endDate;
              }

              if (new Date(_mem.releasedOnDate) > _toDate) {
                _mem.releasedOnDate = _toDate;
              }

              if (member.code == _mem.teamMember.employeeCode) {
                _thisMember.data.push({ x: value.projectName, y: [new Date(_mem.allocatedOnDate).getTime(), new Date(_mem.releasedOnDate).getTime()] });
              }
            });
          }

        });
        _chartData.push(_thisMember);
      });


      this.chartOptions.series = _chartData;

      this.chartOptions.chart.events.zoomed.apply(function () {
        this.chartOptions.chart.events.zoomed = function (chartContext, { xaxis, yaxis }) {
          // return {
          xaxis.min = new Date(this.fromDate).getTime();
          xaxis.max = new Date(this.toDate).getTime();
          // }
        }
      });
      console.log("date range..........");
      console.log(_chartData);
    }
  }

  clearFilters() {
    this.getAllTimelineChart();
  }

  getMembersReport() {
    this.chartOptions.series = [];
    var memberId = this.memberid;
    if (this.memberid == '0') {
      swal.fire({
        text: "Please select a Member",
        icon: "info"
      });
      return;
    }
    if (this.projectid == '0') {
      swal.fire({
        text: "Please select a project to view member's involvement respectively",
        icon: "info"
      });
      return;
    }
    else {
      var reportTitle = "";
      var projectId = this.projectid;
      var _projects = this.projects;
      var _showChart = false;
      var _teamMember = this._teamMembers;
      var _phasesChartData = [];

      _projects.filter(function (project) {
        return project.projectId == projectId;
      }).map(function (project) {

        if (project.status == '0') {
          _showChart = false;
          return;
        }

        _teamMember.filter(function (member) {
          return member.code == memberId
        }).map(function (member) {

          reportTitle = "<b class='text-info'>"+member.name + "'s</b> involvement in <b class='text-info'>" + project.projectName+"</b>";
          var onGoing = false;
          if (project.status > 0) {
            _showChart = true;

            if (new Date(project.endDate) < new Date(project.plannedStartDate)) {
              project.endDate = new Date();
              onGoing = true;
            }

            var _thisMember = { name: member.name, data: [], color: "" };

            project.projectTeamMembers.forEach(function (_mem) {

              if (_mem.teamMember.employeeCode == member.code) {
                if (new Date(_mem.releasedOnDate) < new Date(_mem.allocatedOnDate)) {
                  _mem.releasedOnDate = new Date();
                }

                _thisMember.data.push({
                  x: project.projectName,
                  y: [new Date(_mem.allocatedOnDate).getTime(), new Date(_mem.releasedOnDate).getTime()]
                });

              }
            });
          }
          _phasesChartData.push(_thisMember);
        });

      });

      this.chartOptions.series = _phasesChartData;
      this.reportTitle = reportTitle;
      this.showChart = _showChart;
      console.log(_phasesChartData);
    }
  }

}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
