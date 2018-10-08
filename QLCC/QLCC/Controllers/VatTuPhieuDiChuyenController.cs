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
    [Route("api/VatTuPhieuDiChuyens")]
    public class VatTuPhieuDiChuyensController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public VatTuPhieuDiChuyensController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/VatTuPhieuDiChuyens/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<VatTuPhieuDiChuyen> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<VatTuPhieuDiChuyen>().FromSql($"tbl_VatTuPhieuDiChuyen_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<VatTuPhieuDiChuyen>();
        }
        
        // GET: api/VatTuPhieuDiChuyens
        [HttpGet]
        public IEnumerable<VatTuPhieuDiChuyen> GetVatTuPhieuDiChuyens()
        {
            return _context.VatTuPhieuDiChuyens;
        }
        
        // GET: api/VatTuPhieuDiChuyens/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVatTuPhieuDiChuyen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattuphieudichuyen = await _context.VatTuPhieuDiChuyens.SingleOrDefaultAsync(m => m.PhieuDiChuyenId == id);

            if (vattuphieudichuyen == null)
            {
                return NotFound();
            }

            return Ok(vattuphieudichuyen);
        }
        
        // PUT: api/VatTuPhieuDiChuyens/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVatTuPhieuDiChuyen([FromRoute] int id, [FromBody] VatTuPhieuDiChuyen vattuphieudichuyen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vattuphieudichuyen.PhieuDiChuyenId)
            {
                return BadRequest();
            }

            _context.Entry(vattuphieudichuyen).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VatTuPhieuDiChuyenExists(id))
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
        
        // POST: api/VatTuPhieuDiChuyens
        [HttpPost]
        public async Task<IActionResult> PostVatTuPhieuDiChuyen([FromBody] VatTuPhieuDiChuyen vattuphieudichuyen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.VatTuPhieuDiChuyens.Add(vattuphieudichuyen);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVatTuPhieuDiChuyen", new { id = vattuphieudichuyen.PhieuDiChuyenId }, vattuphieudichuyen);
        }
        
        // DELETE: api/VatTuPhieuDiChuyens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVatTuPhieuDiChuyen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattuphieudichuyen = await _context.VatTuPhieuDiChuyens.SingleOrDefaultAsync(m => m.PhieuDiChuyenId == id);
            if (vattuphieudichuyen == null)
            {
                return NotFound();
            }

            _context.VatTuPhieuDiChuyens.Remove(vattuphieudichuyen);
            await _context.SaveChangesAsync();

            return Ok(vattuphieudichuyen);
        }
        
        private bool VatTuPhieuDiChuyenExists(int id)
        {                        
            return _context.VatTuPhieuDiChuyens.Any(e => e.PhieuDiChuyenId == id);
        }
    }    
}