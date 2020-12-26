using DTO.Models.Projects;
using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.Models.TeamMembers
{
    public class TeamMemberProjectsModel
    {
        public Guid TeamMembersProjectsId { get; set; }
        public Guid ProjectId { get; set; }
        public string EmployeeCode { get; set; } // need to remove
        public ProjectsModel Project { get; set; }
        public DateTime AllocatedOnDate { get; set; }
        public DateTime AllocatedTillDate { get; set; }        
    }
}
