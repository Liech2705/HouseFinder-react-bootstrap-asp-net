using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApi.Domain.Entities
{
    public class UserToken
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation
        public User User { get; set; } = null!;
    }

}
