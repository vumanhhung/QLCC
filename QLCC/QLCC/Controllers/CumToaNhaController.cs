using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;
using QLCC.Helpers;

namespace QLCC.Controllers
{
    [Produces("application/json")]
    [Route("api/CumToaNhas")]
    public class CumToaNhasController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public CumToaNhasController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // GET: api/CumToaNhas
        [HttpGet]
        public IEnumerable<CumToaNha> GetCumToaNhas()
        {
            return _context.CumToaNhas.Include(c => c.NganHang);
        }
        
        // GET: api/CumToaNhas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCumToaNha([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cumtoanha = await _context.CumToaNhas.Include(c => c.NganHang).SingleOrDefaultAsync(m => m.CumToaNhaId == id);

            if (cumtoanha == null)
            {
                return NotFound();
            }

            return Ok(cumtoanha);
        }
        
        // PUT: api/CumToaNhas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCumToaNha([FromRoute] int id, [FromBody] CumToaNha cumtoanha)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cumtoanha.CumToaNhaId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            cumtoanha.NgaySua = DateTime.Now;
            cumtoanha.NguoiSua = user;
            _context.Entry(cumtoanha).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CumToaNhaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        
        // POST: api/CumToaNhas
        [HttpPost]
        public async Task<IActionResult> PostCumToaNha([FromBody] CumToaNha cumtoanha)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);

            cumtoanha.NgayNhap = DateTime.Now;
            cumtoanha.NguoiNhap = user;
            _context.CumToaNhas.Add(cumtoanha);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCumToaNha", new { id = cumtoanha.CumToaNhaId }, cumtoanha);
        }
        
        // DELETE: api/CumToaNhas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCumToaNha([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var cumtoanha = await _context.CumToaNhas.SingleOrDefaultAsync(m => m.CumToaNhaId == id);            
            if (cumtoanha == null)
            {
                return NotFound();
            }
            List<ToaNha> ListToaNha = _context.ToaNhas.Where(t => t.CumToaNhaId == cumtoanha.CumToaNhaId).ToList();
            if (ListToaNha.Count <= 0)
            {
                _context.CumToaNhas.Remove(cumtoanha);
                await _context.SaveChangesAsync();
                return Ok(cumtoanha);
            }
            else
                return BadRequest("Không xóa được cụm tòa nhà. Do đã được sử dụng!");
        }
        
        private bool CumToaNhaExists(int id)
        {                        
            return _context.CumToaNhas.Any(e => e.CumToaNhaId == id);
        }
    }    
}