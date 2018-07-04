using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;

namespace QLCC.Controllers
{
    [Produces("application/json")]
    [Route("api/NguoiDungToaNhas")]
    public class NguoiDungToaNhasController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public NguoiDungToaNhasController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/NguoiDungToaNhas/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<NguoiDungToaNha> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            List<NguoiDungToaNha> list = new List<NguoiDungToaNha>();
            orderBy = orderBy != "x" ? orderBy : "";
            var obj = _context.Set<NguoiDungToaNha>().FromSql($"tbl_NguoiDungToaNha_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<NguoiDungToaNha>();
            for (int i = 0; i < obj.Count; i++)
            {
                NguoiDungToaNha o = new NguoiDungToaNha();
                o = obj[i];
                o.ToaNha = _context.ToaNhas.SingleOrDefault(m => m.ToaNhaId == obj[i].ToaNhaId);
                list.Add(o);
            }
            return list;
        }
        
        // GET: api/NguoiDungToaNhas
        [HttpGet]
        public IEnumerable<NguoiDungToaNha> GetNguoiDungToaNhas()
        {
            return _context.NguoiDungToaNhas;
        }
        
        // GET: api/NguoiDungToaNhas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNguoiDungToaNha([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nguoidungtoanha = await _context.NguoiDungToaNhas.SingleOrDefaultAsync(m => m.NguoiDungToaNhaId == id);

            if (nguoidungtoanha == null)
            {
                return NotFound();
            }

            return Ok(nguoidungtoanha);
        }
        
        // PUT: api/NguoiDungToaNhas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNguoiDungToaNha([FromRoute] int id, [FromBody] NguoiDungToaNha nguoidungtoanha)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != nguoidungtoanha.NguoiDungToaNhaId)
            {
                return BadRequest();
            }

            _context.Entry(nguoidungtoanha).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NguoiDungToaNhaExists(id))
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
        
        // POST: api/NguoiDungToaNhas
        [HttpPost]
        public async Task<IActionResult> PostNguoiDungToaNha([FromBody] NguoiDungToaNha nguoidungtoanha)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.NguoiDungToaNhas.Add(nguoidungtoanha);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNguoiDungToaNha", new { id = nguoidungtoanha.NguoiDungToaNhaId }, nguoidungtoanha);
        }
        
        // DELETE: api/NguoiDungToaNhas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNguoiDungToaNha([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nguoidungtoanha = await _context.NguoiDungToaNhas.SingleOrDefaultAsync(m => m.NguoiDungToaNhaId == id);
            if (nguoidungtoanha == null)
            {
                return NotFound();
            }

            _context.NguoiDungToaNhas.Remove(nguoidungtoanha);
            await _context.SaveChangesAsync();

            return Ok(nguoidungtoanha);
        }
        
        private bool NguoiDungToaNhaExists(int id)
        {                        
            return _context.NguoiDungToaNhas.Any(e => e.NguoiDungToaNhaId == id);
        }
    }    
}