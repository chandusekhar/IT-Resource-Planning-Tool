using BAL.Interfaces.TeamMembers;
using DTO.Models.TeamMembers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamMembersController : ControllerBase
    {
        private readonly bITeamMembers _bITeamMembers;
        public TeamMembersController(bITeamMembers bITeamMembers)
        {
            _bITeamMembers = bITeamMembers;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _bITeamMembers.GetAsync());
        }

        [HttpGet("{employeeCode}")]
        public async Task<IActionResult> Get(string employeeCode)
        {
            return Ok(await _bITeamMembers.GetAsync(employeeCode));
        }

        //[Route("GetProjects/{employeeCode}")]
        //[HttpGet(Name = "GetProjects")]
        //public async Task<List<TeamMemberProjectsModel>> GetProjects(string employeeCode)
        //{
        //    return await _bITeamMembers.GetProjects(employeeCode);
        //}

        [HttpPost]
        public async Task Post([FromBody] TeamMembersModel teamMembers)
        {
            await _bITeamMembers.EditAsync(teamMembers);
            return;
        }

        [HttpPut("{employeeCode}")]
        public async Task Put(string employeeCode, [FromBody] TeamMembersModel model)
        {
            await _bITeamMembers.EditAsync(model, employeeCode);
            return;
        }

        [HttpDelete("{employeeCode}")]
        public async Task Delete(string employeeCode)
        {
            await _bITeamMembers.DeleteAsync(employeeCode);
            return;
        }
    }
}
