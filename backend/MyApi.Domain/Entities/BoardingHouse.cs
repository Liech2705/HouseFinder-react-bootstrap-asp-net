using MyApi.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Domain.Entities
{
    public class BoardingHouse
    {
        [Key]
        public int House_Id { get; set; }

        [ForeignKey("User")]
        public int User_Id { get; set; }

        public string Description { get; set; }

        public int? Room_Count { get; set; }

        public bool? Is_Elevator { get; set; }

        public int? Num_Floors { get; set; }

        public string Note { get; set; }

        public HouseStatus Status { get; set; }

        public DateTime? Create_At { get; set; }

        // Navigation
        public User User { get; set; }
        public ICollection<Room> Rooms { get; set; }
        public ICollection<HouseImage> HouseImages { get; set; }
    }
}
