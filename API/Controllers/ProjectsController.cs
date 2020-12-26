using BAL.Interfaces.Projects;
using DTO.Models.Projects;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly bIProjects _bIProjects;
        public ProjectsController(bIProjects bIProjects)
        {
            _bIProjects = bIProjects;
        }
        public async Task<IActionResult> Get()
        {
            return Ok(await _bIProjects.GetAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            return Ok(await _bIProjects.GetAsync(id));
        }

        [HttpPost]
        public async Task Post([FromBody] ProjectsModel model)
        {
            await _bIProjects.EditAsync(model, null);
            return;
        }

        [HttpPut("{id}")]
        public async Task Put(Guid id, [FromBody] ProjectsModel model)
        {
            await _bIProjects.EditAsync(model, id);
            return;
        }

        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _bIProjects.DeleteAsync(id);
            return;
        }
    }
}
