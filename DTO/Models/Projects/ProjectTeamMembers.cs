using DTO.Models.TeamMembers;
using System;

namespace DTO.Models.Projects
{
    public class ProjectTeamMembers
    {
        public Guid ProjectTeamMembersId { get; set; }
        public Guid ProjectId { get; set; }
        public string TeamMemberJson { get; set; }
        public string EmployeeCode { get; set; }
        public TeamMembersModel TeamMember { get; set; }
        public DateTime AllocatedOnDate { get; set; }
        public DateTime ReleasedOnDate { get; set; }
        public string Description { get; set; }
    }
}