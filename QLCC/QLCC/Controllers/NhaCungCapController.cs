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
    [Route("api/NhaCungCaps")]
    public class NhaCungCapsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public NhaCungCapsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/NhaCungCaps/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<NhaCungCap> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<NhaCungCap>().FromSql($"tbl_NhaCungCap_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<NhaCungCap>();
        }
        
        // GET: api/NhaCungCaps
        [HttpGet]
        public IEnumerable<NhaCungCap> GetNhaCungCaps()
        {
            return _context.NhaCungCaps;
        }
        
        // GET: api/NhaCungCaps/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNhaCungCap([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nhacungcap = await _context.NhaCungCaps.SingleOrDefaultAsync(m => m.NhaCungCapId == id);

            if (nhacungcap == null)
            {
                return NotFound();
            }

            return Ok(nhacungcap);
        }
        
        // PUT: api/NhaCungCaps/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNhaCungCap([FromRoute] int id, [FromBody] NhaCungCap nhacungcap)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != nhacungcap.NhaCungCapId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            nhacungcap.NgaySua = DateTime.Now;
            nhacungcap.NguoiSua = user;
            _context.Entry(nhacungcap).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NhaCungCapExists(id))
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
        
        // POST: api/NhaCungCaps
        [HttpPost]
        public async Task<IActionResult> PostNhaCungCap([FromBody] NhaCungCap nhacungcap)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            nhacungcap.NgayNhap = DateTime.Now;
            nhacungcap.NguoiNhap = user;
            _context.NhaCungCaps.Add(nhacungcap);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNhaCungCap", new { id = nhacungcap.NhaCungCapId }, nhacungcap);
        }
        
        // DELETE: api/NhaCungCaps/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhaCungCap([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nhacungcap = await _context.NhaCungCaps.SingleOrDefaultAsync(m => m.NhaCungCapId == id);
            if (nhacungcap == null)
            {
                return NotFound();
            }

            _context.NhaCungCaps.Remove(nhacungcap);
            await _context.SaveChangesAsync();

            return Ok(nhacungcap);
        }
        
        private bool NhaCungCapExists(int id)
        {                        
            return _context.NhaCungCaps.Any(e => e.NhaCungCapId == id);
        }
    }    
}