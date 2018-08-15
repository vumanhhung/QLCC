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
    [Route("api/CuDans")]
    public class CuDansController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public CuDansController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/CuDans/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<CuDan> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<CuDan>().FromSql($"tbl_CuDan_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<CuDan>();
        }
        // PUT: api/CuDans/getItems/5/5/x
        [HttpGet("getChuHo")]
        public IEnumerable<CuDan> getChuHo()
        {
            return _context.CuDans.Where(m=>m.QuanHeChuHoId == 14 && m.TrangThaiCuDanId == 1);
        }
        // GET: api/CuDans
        [HttpGet]
        public IEnumerable<CuDan> GetCuDans()
        {
            return _context.CuDans.Include(m=>m.matbangs).Include(m=>m.quanhechuhos).Include(m=>m.trangthaicudans);
        }
        
        // GET: api/CuDans/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCuDan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cudan = await _context.CuDans.Include(m => m.matbangs).Include(m => m.quanhechuhos).Include(m => m.trangthaicudans).SingleOrDefaultAsync(m => m.CuDanId == id);

            if (cudan == null)
            {
                return NotFound();
            }

            return Ok(cudan);
        }

        // GET: api/ToaNhas/getToaNhaByCum/5,5
        [HttpPost("getCuDanByMatBang")]
        public IEnumerable<CuDan> getCuDanByMatBang([FromBody] int?[] matbang)
        {
                var cudans = _context.CuDans.Include(m => m.matbangs).Include(m => m.quanhechuhos).Include(m => m.trangthaicudans).Where(x => matbang.Contains(x.MatBangId));
                return cudans;
        }
        // GET: api/ToaNhas/getToaNhaByCum/5,5
        [HttpPost("GetAllData")]
        public IEnumerable<CuDan> GetAllData()
        {
            var cudans = _context.CuDans.Include(m => m.matbangs).Include(m => m.quanhechuhos).Include(m => m.trangthaicudans);
            return cudans;
        }
        // PUT: api/CuDans/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCuDan([FromRoute] int id, [FromBody] CuDan cudan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cudan.CuDanId)
            {
                return BadRequest();
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            cudan.NgaySua = DateTime.Now;
            cudan.NguoiSua = user;
            _context.Entry(cudan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CuDanExists(id))
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
        
        // POST: api/CuDans
        [HttpPost]
        public async Task<IActionResult> PostCuDan([FromBody] CuDan cudan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            cudan.NgayNhap = DateTime.Now;
            cudan.NguoiNhap = user;
            _context.CuDans.Add(cudan);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCuDan", new { id = cudan.CuDanId }, cudan);
        }
        
        // DELETE: api/CuDans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCuDan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cudan = await _context.CuDans.SingleOrDefaultAsync(m => m.CuDanId == id);
            if (cudan == null)
            {
                return NotFound();
            }

            _context.CuDans.Remove(cudan);
            await _context.SaveChangesAsync();

            return Ok(cudan);
        }
        
        private bool CuDanExists(int id)
        {                        
            return _context.CuDans.Any(e => e.CuDanId == id);
        }
    }    
}