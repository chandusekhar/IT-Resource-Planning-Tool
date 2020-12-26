using Microsoft.Extensions.DependencyInjection;
using BAL.Interfaces.TeamMembers;
using BAL.Operations.TeamMembers;
using BAL.Interfaces.Projects;
using BAL.Operations.Projects; 

namespace BAL.DependencyResolver
{
    public static class DIResolver
    {
        public static IServiceCollection DIBALResolver(this IServiceCollection services)
        {
            services.AddScoped<bITeamMembers, bTeamMembers>();
            services.AddScoped<bIProjects, bProjects>();
            return services;
        }
    }
}
