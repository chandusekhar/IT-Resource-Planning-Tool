using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO.Data.Entities
{
    public class AppUser : IdentityUser
    {
        [StringLength(36)]
        public override string Id { get => base.Id ; set => base.Id = value; }
        public string Name { get; set; }
        //Other fields can be added here
    }
}
