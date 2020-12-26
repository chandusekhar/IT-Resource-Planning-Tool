using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.Data.Entities
{
    public class TeamMembersProjectsMapper
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public TeamMembers TeamMember { get; set; }
        public Projects Project { get; set; }
        public DateTime AllocatedFromDate { get; set; }
        public DateTime AllocatedTill { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
