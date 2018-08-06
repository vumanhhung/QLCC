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
    [Route("api/QuanHeChuHos")]
    public class QuanHeChuHosController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public QuanHeChuHosController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/QuanHeChuHos/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<QuanHeChuHo> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<QuanHeChuHo>().FromSql($"tbl_QuanHeChuHo_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<QuanHeChuHo>();
        }
        
        // GET: api/QuanHeChuHos
        [HttpGet]
        public IEnumerable<QuanHeChuHo> GetQuanHeChuHos()
        {
            return _context.QuanHeChuHos;
        }
        
        // GET: api/QuanHeChuHos/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuanHeChuHo([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quanhechuho = await _context.QuanHeChuHos.SingleOrDefaultAsync(m => m.QuanHeChuHoId == id);

            if (quanhechuho == null)
            {
                return NotFound();
            }

            return Ok(quanhechuho);
        }
        
        // PUT: api/QuanHeChuHos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuanHeChuHo([FromRoute] int id, [FromBody] QuanHeChuHo quanhechuho)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != quanhechuho.QuanHeChuHoId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            quanhechuho.NgaySua = DateTime.Now;
            quanhechuho.NguoiSua = user;
            _context.Entry(quanhechuho).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuanHeChuHoExists(id))
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
        
        // POST: api/QuanHeChuHos
        [HttpPost]
        public async Task<IActionResult> PostQuanHeChuHo([FromBody] QuanHeChuHo quanhechuho)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            quanhechuho.NgayNhap = DateTime.Now;
            quanhechuho.NguoiNhap = user;
            _context.QuanHeChuHos.Add(quanhechuho);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuanHeChuHo", new { id = quanhechuho.QuanHeChuHoId }, quanhechuho);
        }
        
        // DELETE: api/QuanHeChuHos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuanHeChuHo([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quanhechuho = await _context.QuanHeChuHos.SingleOrDefaultAsync(m => m.QuanHeChuHoId == id);
            if (quanhechuho == null)
            {
                return NotFound();
            }

            _context.QuanHeChuHos.Remove(quanhechuho);
            await _context.SaveChangesAsync();

            return Ok(quanhechuho);
        }
        
        private bool QuanHeChuHoExists(int id)
        {                        
            return _context.QuanHeChuHos.Any(e => e.QuanHeChuHoId == id);
        }
    }    
}