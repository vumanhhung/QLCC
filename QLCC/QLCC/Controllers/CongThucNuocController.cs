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
    [Route("api/CongThucNuocs")]
    public class CongThucNuocsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public CongThucNuocsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/CongThucNuocs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<CongThucNuoc> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<CongThucNuoc>().FromSql($"tbl_CongThucNuoc_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<CongThucNuoc>();
        }
        
        // GET: api/CongThucNuocs
        [HttpGet]
        public IEnumerable<CongThucNuoc> GetCongThucNuocs()
        {
            return _context.CongThucNuocs;
        }
        
        // GET: api/CongThucNuocs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCongThucNuoc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var congthucnuoc = await _context.CongThucNuocs.SingleOrDefaultAsync(m => m.CongThucNuocId == id);

            if (congthucnuoc == null)
            {
                return NotFound();
            }

            return Ok(congthucnuoc);
        }
        
        // PUT: api/CongThucNuocs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCongThucNuoc([FromRoute] int id, [FromBody] CongThucNuoc congthucnuoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != congthucnuoc.CongThucNuocId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            congthucnuoc.NgaySua = DateTime.Now;
            congthucnuoc.NguoiSua = user;
            var checkten = await _context.CongThucNuocs.SingleOrDefaultAsync(r => r.TenCongThucNuoc == congthucnuoc.TenCongThucNuoc && r.CongThucNuocId != id);
            if(checkten == null)
            {
                _context.Entry(congthucnuoc).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                var warn = "";
                if (checkten != null)
                {
                    warn = "Exist";
                }
                return Ok(warn);                
            }
        }
        
        // POST: api/CongThucNuocs
        [HttpPost]
        public async Task<IActionResult> PostCongThucNuoc([FromBody] CongThucNuoc congthucnuoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            congthucnuoc.NgayNhap = DateTime.Now;
            congthucnuoc.NguoiNhap = user;
            var checkten = await _context.CongThucNuocs.SingleOrDefaultAsync(r => r.TenCongThucNuoc == congthucnuoc.TenCongThucNuoc);
            if (checkten == null)
            {
                _context.CongThucNuocs.Add(congthucnuoc);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetCongThucNuoc", new { id = congthucnuoc.CongThucNuocId }, congthucnuoc);
            }
            else
            {
                var warn = new CongThucNuoc();
                if (checkten != null)
                {
                    warn.TenCongThucNuoc = "Exist";
                }
                return Ok(warn);
            }
        }
        
        // DELETE: api/CongThucNuocs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCongThucNuoc([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var congthucnuoc = await _context.CongThucNuocs.SingleOrDefaultAsync(m => m.CongThucNuocId == id);
            if (congthucnuoc == null)
            {
                return NotFound();
            }

            _context.CongThucNuocs.Remove(congthucnuoc);
            await _context.SaveChangesAsync();

            return Ok(congthucnuoc);
        }
        
        private bool CongThucNuocExists(int id)
        {                        
            return _context.CongThucNuocs.Any(e => e.CongThucNuocId == id);
        }

        [HttpPut("ChangeStatus/{id}")]
        public async Task<IActionResult> updateTable(int id)
        {
            CongThucNuoc ctn = new CongThucNuoc();
            var check = _context.CongThucNuocs.Where(r => r.CongThucNuocId != id && r.Status == true);
            if(check.Count() != 0)
            {
                foreach (var item in check)
                {
                    item.Status = false;
                }
            }            
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("CheckStatus")]
        public async Task<IActionResult> checkStatus()
        {
            var stringcheck = "";
            var checkstatus = await _context.CongThucNuocs.SingleOrDefaultAsync(r => r.Status == true);
            if(checkstatus == null)
            {
                stringcheck = "none";
            }
            else
            {
                stringcheck = "exist";
            }
            return Ok(stringcheck);
        }
    }    
}