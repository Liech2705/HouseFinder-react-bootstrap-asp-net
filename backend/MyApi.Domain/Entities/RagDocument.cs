using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApi.Domain.Entities
{
    public class RagDocument
    {
        public string Text { get; set; } = "";
        public int House_Id { get; set; } = -1;
    }
}
