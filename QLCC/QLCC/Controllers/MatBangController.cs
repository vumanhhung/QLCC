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
    [Route("api/MatBangs")]
    public class MatBangsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public MatBangsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/MatBangs
        [HttpGet]
        public IEnumerable<MatBang> GetMatBangs()
        {
            return _context.MatBangs.Include(m => m.cumtoanha).Include(m => m.toanha).Include(m => m.trangthai).Include(m => m.tanglau).Include(m => m.loaimatbang);
        }

        // PUT: api/MatBang/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<MatBang> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            orderBy = orderBy != "x" ? orderBy : "";
            var list = _context.Set<MatBang>().FromSql($"tbl_MatBang_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<MatBang>();
            foreach (var item in list)
            {
                DichVuNuoc dvn = _context.DichVuNuocs.Where(o => o.MatBangId == item.MatBangId).OrderByDescending(o => o.Nam).OrderByDescending(o => o.Thang).FirstOrDefault();
                item.DichVuNuoc = dvn;
            }
            return list;
        }

        // GET: api/ToaNhas/getToaNhaByCum/5,5
        [HttpGet("getMatBangByToaNha/{tangLauId}/{toaNhaId}/{cumToaNhaId}")]
        public IEnumerable<MatBang> getMatBangByToaNha([FromRoute] int tangLauId, int toaNhaId, int cumToaNhaId)
        {
            if (tangLauId != 0 && toaNhaId == 0 && cumToaNhaId == 0)
            {
                var matbangs = _context.MatBangs.Include(m => m.cumtoanha).Include(m => m.toanha).Include(m => m.trangthai).Include(m => m.tanglau).Include(m => m.loaimatbang).Where(m => m.TangLauId == tangLauId).Include(o => o.KhachHangs);
                return matbangs;
            }
            else if (tangLauId != 0 && toaNhaId != 0 && cumToaNhaId == 0)
            {
                var matbangs = _context.MatBangs.Include(m => m.cumtoanha).Include(m => m.toanha).Include(m => m.trangthai).Include(m => m.tanglau).Include(m => m.loaimatbang).Where(m => m.TangLauId == tangLauId).Where(m => m.ToaNhaId == toaNhaId).Include(o => o.KhachHangs);
                return matbangs;
            }
            else if (tangLauId != 0 && toaNhaId != 0 && cumToaNhaId != 0)
            {
                var matbangs = _context.MatBangs.Include(m => m.cumtoanha).Include(m => m.toanha).Include(m => m.trangthai).Include(m => m.tanglau).Include(m => m.loaimatbang).Where(m => m.TangLauId == tangLauId).Where(m => m.ToaNhaId == toaNhaId).Where(m => m.CumToaNhaId == cumToaNhaId).Include(o => o.KhachHangs);
                return matbangs;
            }

            else if (tangLauId == 0 && toaNhaId != 0 && cumToaNhaId == 0)
            {
                var matbangs = _context.MatBangs.Include(m => m.cumtoanha).Include(m => m.toanha).Include(m => m.trangthai).Include(m => m.tanglau).Include(m => m.loaimatbang).Where(m => m.ToaNhaId == toaNhaId).Include(o => o.KhachHangs);
                return matbangs;
            }
            else if (tangLauId == 0 && toaNhaId != 0 && cumToaNhaId != 0)
            {
                var matbangs = _context.MatBangs.Include(m => m.cumtoanha).Include(m => m.toanha).Include(m => m.trangthai).Include(m => m.tanglau).Include(m => m.loaimatbang).Where(m => m.ToaNhaId == toaNhaId).Where(m => m.CumToaNhaId == cumToaNhaId).Include(o => o.KhachHangs);
                return matbangs;
            }
            if (tangLauId != 0 && toaNhaId == 0 && cumToaNhaId != 0)
            {
                var matbangs = _context.MatBangs.Include(m => m.cumtoanha).Include(m => m.toanha).Include(m => m.trangthai).Include(m => m.tanglau).Include(m => m.loaimatbang).Where(m => m.CumToaNhaId == cumToaNhaId).Where(m => m.TangLauId == tangLauId).Include(o => o.KhachHangs);
                return matbangs;
            }
            else
            {
                var matbangs = _context.MatBangs.Include(m => m.cumtoanha).Include(m => m.toanha).Include(m => m.trangthai).Include(m => m.tanglau).Include(m => m.loaimatbang).Where(m => m.CumToaNhaId == cumToaNhaId).Include(o => o.KhachHangs);
                return matbangs;
            }
        }
        // GET: api/MatBangs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMatBang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var matbang = await _context.MatBangs.Include(m => m.cumtoanha).Include(m => m.toanha).Include(m => m.trangthai).Include(m => m.tanglau).Include(m => m.loaimatbang).SingleOrDefaultAsync(m => m.MatBangId == id);

            if (matbang == null)
            {
                return NotFound();
            }

            return Ok(matbang);
        }

        // PUT: api/MatBangs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMatBang([FromRoute] int id, [FromBody] MatBang matbang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != matbang.MatBangId)
            {
                return BadRequest();
            }
            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            matbang.NgaySua = DateTime.Now;
            matbang.NguoiSua = user;
            _context.Entry(matbang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MatBangExists(id))
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

        // POST: api/MatBangs
        [HttpPost]
        public async Task<IActionResult> PostMatBang([FromBody] MatBang matbang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);

            matbang.NgayNhap = DateTime.Now;
            matbang.NguoiNhap = user;
            _context.MatBangs.Add(matbang);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMatBang", new { id = matbang.MatBangId }, matbang);
        }

        // POST: api/MatBangs
        [HttpPost("importMatBang/{cumToaNhaId}/{toaNhaId}/{tangLauId}")]
        public async Task<IActionResult> importMatBang([FromBody] MatBang[] matbang, [FromRoute] int cumToaNhaId, int toaNhaId, int tangLauId)
        {
            var arr_toanha = _context.TangLaus.Where(m => m.TangLauId == tangLauId).Select(m => m.ToaNhaId).ToArray();
            if (toaNhaId == 0)
            {
                toaNhaId = arr_toanha[0].Value;
            }
            if (cumToaNhaId == 0)
            {
                if (arr_toanha[0].Value > 0)
                {
                    var arr_cumtoanha = _context.ToaNhas.Where(m => m.ToaNhaId == arr_toanha[0].Value).Select(m => m.CumToaNhaId).ToArray();
                    cumToaNhaId = arr_cumtoanha[0].Value;
                }
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            foreach (var mb in matbang)
            {
                mb.LoaiTien = "VND";
                //mb.KhachHangId = 2;
                mb.KhachThue = 2;
                mb.GiaoChiaKhoa = 1;
                mb.CaNhan = 2;
                mb.CumToaNhaId = cumToaNhaId;
                mb.ToaNhaId = toaNhaId;
                mb.TangLauId = tangLauId;
                mb.TrangThaiId = 9;
                mb.LoaiMatBangId = 3;

                mb.NgayNhap = DateTime.Now;
                mb.NguoiNhap = user;
                _context.MatBangs.Add(mb);
            }
            await _context.SaveChangesAsync();

            return Ok(matbang);
        }

        // DELETE: api/MatBangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatBang([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var matbang = await _context.MatBangs.SingleOrDefaultAsync(m => m.MatBangId == id);
            if (matbang == null)
            {
                return NotFound();
            }

            _context.MatBangs.Remove(matbang);
            await _context.SaveChangesAsync();

            return Ok(matbang);
        }

        private bool MatBangExists(int id)
        {
            return _context.MatBangs.Any(e => e.MatBangId == id);
        }

        [HttpGet("GetMatBangByTangLau/{id}")]
        public IEnumerable<MatBang> getMatBangByTangLau([FromRoute] int id)
        {
            return _context.MatBangs.Where(r => r.TangLauId == id).ToList();
        }
    }
}