using DTO.Models.ProjectTypes;
using DTO.Models.TeamMembers;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace DTO.Models.Projects
{
    public class ProjectsModel
    {
        public Guid ProjectId { get; set; }
        public string ProjectName { get; set; }
        public Guid ProjectTypeId { get; set; }

        [JsonPropertyName("ProjectTypeJson")]
        public string ProjectTypeJson { get; set; }
        public ProjectType ProjectType { get; set; }
        public string Description { get; set; }
        public Guid ReleaseManagerId { get; set; }

        [JsonPropertyName("ReleaseManagerJson")]
        public string ReleaseManagerJson { get; set; }
        public TeamMembersModel ReleaseManager { get; set; }
        public string AccountManager { get; set; }
        public DateTime PlannedStartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Status Status { get; set; }
        public Priority Priority { get; set; }
        public string Remarks { get; set; }
        public string AddedBy { get; set; }
        public DateTime AddedOn { get; set; }
        public DateTime UpdatedOn { get; set; } 
        public List<ProjectDetailModel> ProjectDetails { get; set; }
        public List<ProjectTeamMembers> ProjectTeamMembers { get; set; }
        

        public ProjectsModel()
        {
            this.ProjectType = new ProjectType();
            this.ProjectDetails = new List<ProjectDetailModel>();
            this.ReleaseManager = new TeamMembersModel();
            this.EndDate = (DateTime?)null;
        }
    }

    public enum Status
    {
        OnHold, 
        InProgress,
        NotStarted,
        Completed
    }

    public enum Priority
    {
        Critical, 
        Low,
        High,
        Normal
    }
}
