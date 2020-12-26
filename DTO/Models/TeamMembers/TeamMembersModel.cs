using DTO.Attributes;
using DTO.Models.Projects;
using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

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

        [JsonConverter(typeof(RawJsonConverter))]
        public string Projects { get; set; } // typeJson
         
        public List<TeamMemberProjectsModel> ProjectsDetails { get; set; }
    }
}
