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
    [Route("api/VatTuDiChuyens")]
    public class VatTuDiChuyensController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public VatTuDiChuyensController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/VatTuDiChuyens/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<VatTuDiChuyen> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<VatTuDiChuyen>().FromSql($"tbl_VatTuDiChuyen_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<VatTuDiChuyen>();
        }
        
        // GET: api/VatTuDiChuyens
        [HttpGet]
        public IEnumerable<VatTuDiChuyen> GetVatTuDiChuyens()
        {
            return _context.VatTuDiChuyens.Include(m => m.donvitinhs).Include(m => m.quoctichs).Include(m => m.vattuphieudichuyens).Include(m => m.vattus);
        }
        
        // GET: api/VatTuDiChuyens/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVatTuDiChuyen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattudichuyen = await _context.VatTuDiChuyens.Include(m => m.donvitinhs).Include(m => m.quoctichs).Include(m => m.vattuphieudichuyens).Include(m => m.vattus).SingleOrDefaultAsync(m => m.VatTuDiChuyenId == id);

            if (vattudichuyen == null)
            {
                return NotFound();
            }

            return Ok(vattudichuyen);
        }
        
        // PUT: api/VatTuDiChuyens/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVatTuDiChuyen([FromRoute] int id, [FromBody] VatTuDiChuyen vattudichuyen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vattudichuyen.VatTuDiChuyenId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            vattudichuyen.NgaySua = DateTime.Now;
            vattudichuyen.NguoiSua = user;
            _context.Entry(vattudichuyen).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VatTuDiChuyenExists(id))
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
        
        // POST: api/VatTuDiChuyens
        [HttpPost]
        public async Task<IActionResult> PostVatTuDiChuyen([FromBody] VatTuDiChuyen vattudichuyen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            vattudichuyen.NgayNhap = DateTime.Now;
            vattudichuyen.NguoiNhap = user;
            _context.VatTuDiChuyens.Add(vattudichuyen);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVatTuDiChuyen", new { id = vattudichuyen.VatTuDiChuyenId }, vattudichuyen);
        }
        
        // DELETE: api/VatTuDiChuyens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVatTuDiChuyen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattudichuyen = await _context.VatTuDiChuyens.SingleOrDefaultAsync(m => m.VatTuDiChuyenId == id);
            if (vattudichuyen == null)
            {
                return NotFound();
            }

            _context.VatTuDiChuyens.Remove(vattudichuyen);
            await _context.SaveChangesAsync();

            return Ok(vattudichuyen);
        }

        [HttpGet("GetByPhieuDiChuyen/{id}")]
        public IEnumerable<VatTuDiChuyen> GetByPhieuDiChuyen([FromRoute] int id)
        {
            return _context.VatTuDiChuyens.Include(r => r.quoctichs).Include(r => r.vattus).Include(r => r.vattuphieudichuyens).Include(r => r.donvitinhs).Where(r => r.PhieuDiChuyenId == id).ToList();
        }

        private bool VatTuDiChuyenExists(int id)
        {                        
            return _context.VatTuDiChuyens.Any(e => e.VatTuDiChuyenId == id);
        }
    }    
}