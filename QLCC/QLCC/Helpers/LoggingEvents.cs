// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLCC.Helpers
{
    public static class LoggingEvents
    {
        public static readonly EventId INIT_DATABASE = new EventId(101, "Lỗi khởi tạo cơ sở dữ liệu");
        public static readonly EventId SEND_EMAIL = new EventId(201, "Lỗi khi gửi email");
    }

}
