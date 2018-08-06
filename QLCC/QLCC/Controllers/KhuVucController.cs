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
    [Route("api/KhuVucs")]
    public class KhuVucsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public KhuVucsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/KhuVucs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<KhuVuc> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<KhuVuc>().FromSql($"tbl_KhuVuc_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<KhuVuc>();
        }
        
        // GET: api/KhuVucs
        [HttpGet]
        public IEnumerable<KhuVuc> GetKhuVucs()
        {
            return _context.KhuVucs;
        }
        
        // GET: api/KhuVucs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetKhuVuc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var khuvuc = await _context.KhuVucs.SingleOrDefaultAsync(m => m.KhuVucId == id);

            if (khuvuc == null)
            {
                return NotFound();
            }

            return Ok(khuvuc);
        }
        
        // PUT: api/KhuVucs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKhuVuc([FromRoute] int id, [FromBody] KhuVuc khuvuc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != khuvuc.KhuVucId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            khuvuc.NgaySua = DateTime.Now;
            khuvuc.NguoiSua = user;
            _context.Entry(khuvuc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KhuVucExists(id))
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
        
        // POST: api/KhuVucs
        [HttpPost]
        public async Task<IActionResult> PostKhuVuc([FromBody] KhuVuc khuvuc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            khuvuc.NgayNhap = DateTime.Now;
            khuvuc.NguoiNhap = user;
            _context.KhuVucs.Add(khuvuc);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKhuVuc", new { id = khuvuc.KhuVucId }, khuvuc);
        }
        
        // DELETE: api/KhuVucs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKhuVuc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var khuvuc = await _context.KhuVucs.SingleOrDefaultAsync(m => m.KhuVucId == id);
            if (khuvuc == null)
            {
                return NotFound();
            }

            _context.KhuVucs.Remove(khuvuc);
            await _context.SaveChangesAsync();

            return Ok(khuvuc);
        }
        
        private bool KhuVucExists(int id)
        {                        
            return _context.KhuVucs.Any(e => e.KhuVucId == id);
        }
    }    
}