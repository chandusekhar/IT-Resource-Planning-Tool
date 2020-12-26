using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static DTO.Enums.Enums;

namespace DTO.Data.Entities
{
    public class Projects
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ProjectType Type { get; set; }
        public string Description { get; set; }
        public TeamMembers ReleaseManager { get; set; }
        public string AccountManager { get; set; }
        public DateTime PlannedStartDate { get; set; }
        public DateTime Deadline { get; set; }
        public ProjectStatus Status { get; set; }
        public ProjectPriority Priority {get;set;}
        public string Remarks { get; set; }
    }
}
