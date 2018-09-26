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
    [Route("api/VatTuPhieuYeuCaus")]
    public class VatTuPhieuYeuCausController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public VatTuPhieuYeuCausController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/VatTuPhieuYeuCaus/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<VatTuPhieuYeuCau> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<VatTuPhieuYeuCau>().FromSql($"tbl_VatTuPhieuYeuCau_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<VatTuPhieuYeuCau>();
        }
        
        // GET: api/VatTuPhieuYeuCaus
        [HttpGet]
        public IEnumerable<VatTuPhieuYeuCau> GetVatTuPhieuYeuCaus()
        {
            return _context.VatTuPhieuYeuCaus.Include(r => r.phongbans).Include(r => r.toanhas);
        }
        
        // GET: api/VatTuPhieuYeuCaus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVatTuPhieuYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattuphieuyeucau = await _context.VatTuPhieuYeuCaus.SingleOrDefaultAsync(m => m.PhieuYeuCauVTId == id);

            if (vattuphieuyeucau == null)
            {
                return NotFound();
            }

            return Ok(vattuphieuyeucau);
        }
        
        // PUT: api/VatTuPhieuYeuCaus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVatTuPhieuYeuCau([FromRoute] int id, [FromBody] VatTuPhieuYeuCau vattuphieuyeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vattuphieuyeucau.PhieuYeuCauVTId)
            {
                return BadRequest();
            }

            _context.Entry(vattuphieuyeucau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VatTuPhieuYeuCauExists(id))
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
        
        // POST: api/VatTuPhieuYeuCaus
        [HttpPost]
        public async Task<IActionResult> PostVatTuPhieuYeuCau([FromBody] VatTuPhieuYeuCau vattuphieuyeucau)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.VatTuPhieuYeuCaus.Add(vattuphieuyeucau);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVatTuPhieuYeuCau", new { id = vattuphieuyeucau.PhieuYeuCauVTId }, vattuphieuyeucau);
        }
        
        // DELETE: api/VatTuPhieuYeuCaus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVatTuPhieuYeuCau([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vattuphieuyeucau = await _context.VatTuPhieuYeuCaus.SingleOrDefaultAsync(m => m.PhieuYeuCauVTId == id);
            if (vattuphieuyeucau == null)
            {
                return NotFound();
            }

            _context.VatTuPhieuYeuCaus.Remove(vattuphieuyeucau);
            await _context.SaveChangesAsync();

            return Ok(vattuphieuyeucau);
        }
        
        private bool VatTuPhieuYeuCauExists(int id)
        {                        
            return _context.VatTuPhieuYeuCaus.Any(e => e.PhieuYeuCauVTId == id);
        }
    }    
}