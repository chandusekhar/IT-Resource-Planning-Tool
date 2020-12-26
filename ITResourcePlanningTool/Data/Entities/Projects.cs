using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static ITResourcePlanningTool.Helpers.Enums;

namespace ITResourcePlanningTool.Data
{
    public class Projects
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ProjectType Type { get; set; }
        public string Description { get; set; }
        public Members ReleaseManager { get; set; }
        public string AccountManager { get; set; }
        public DateTime PlannedStartDate { get; set; }
        public DateTime Deadline { get; set; }
        public ProjectStatus Status { get; set; }
        public ProjectPriority Priority {get;set;}
        public string Remarks { get; set; }
    }
}
