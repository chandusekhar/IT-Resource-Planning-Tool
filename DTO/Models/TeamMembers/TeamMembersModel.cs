using System;

namespace DTO.Models.TeamMembers
{
    public class TeamMembersModel
    {
        public Guid TeamMembersId { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeCode { get; set; }
        public DateTime AddedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string AddedBy { get; set; }
        public string Designation { get; set; }
        public bool IsActive { get; set; }
        public string Projects { get; set; }
    }
}
