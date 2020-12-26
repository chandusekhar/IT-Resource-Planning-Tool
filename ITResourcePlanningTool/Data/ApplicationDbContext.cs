using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITResourcePlanningTool.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
          // optionsBuilder.UseMySQL("server=localhost;database=itresourceplanningtool;user=root;password=");
        }

        public DbSet<Members> Members { get; set; }
        public DbSet<Projects> Projects { get; set; }
    }
}
