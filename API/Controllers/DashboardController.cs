using BAL.Interfaces.Projects;
using BAL.Interfaces.TeamMembers;
using DTO.Models.ProjectTypes;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly bIProjects _bIProjects;
        private readonly bITeamMembers _bITeamMembers;
        public DashboardController(bIProjects bIProjects,
            bITeamMembers bITeamMembers)
        {
            _bIProjects = bIProjects;
            _bITeamMembers = bITeamMembers;
        }

        [Route("GetProjectsCount")]
        [HttpGet(Name = "GetProjectsCount")]
        public async Task<int> GetProjectsCount()
        {
            return await _bIProjects.ProjectCountAsync();
        }

        [Route("EditProjectTypes/{id?}")]
        [HttpGet(Name = "EditProjectTypes")]
        public async Task<IActionResult> EditProjectTypes(Guid? id, ProjectType model)
        {
            await _bIProjects.EditProjectTypesAsync(model, id);
            return Ok();
        }

        [Route("DeleteProjectTypes/{id}")]
        [HttpGet(Name = "DeleteProjectTypes")]
        public async Task<IActionResult> DeleteProjectTypes(Guid id)
        {
            await _bIProjects.DeleteProjectTypesAsync(id);
            return Ok();
        }

        [Route("GetTeamMembersCount")]
        [HttpGet(Name = "GetTeamMembersCount")]
        public async Task<int> GetTeamMembersCount()
        {
            return await _bITeamMembers.TeamMembersCountAsync();
        }

        [Route("GetProjectTypes")]
        [HttpGet(Name = "GetProjectTypes")]
        public async Task<IActionResult> GetProjectTypes()
        {
            return Ok(await _bIProjects.GetProjectTypes());
        }
    }
}
