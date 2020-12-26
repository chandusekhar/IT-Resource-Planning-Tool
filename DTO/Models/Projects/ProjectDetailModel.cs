using System;

namespace DTO.Models.Projects
{
    public class ProjectDetailModel
    {
        public Guid ProjectDetailId { get; set; }
        public Guid ProjectId { get; set; }
        public string Description { get; set; }
        public DateTime TaskStartedOn { get; set; }
        public DateTime TaskCompletedOn { get; set; }

    }
}