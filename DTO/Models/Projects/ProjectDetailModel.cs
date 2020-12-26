using DTO.Models.TeamMembers;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DTO.Models.Projects
{
    public class ProjectDetailModel
    {
        public Guid ProjectDetailId { get; set; }
        public Guid ProjectId { get; set; } 
        //public List<ProjectTeamMembers> ProjectTeamMembers { get; set; }
        public string Description { get; set; }
        public DateTime TaskStartedOn { get; set; }
        public DateTime TaskCompletedOn { get; set; }
        
    }
}