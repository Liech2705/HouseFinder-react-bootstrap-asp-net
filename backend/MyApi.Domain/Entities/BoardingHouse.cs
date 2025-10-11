using MyApi.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Domain.Entities
{
    public class BoardingHouse
    {
        public int House_Id { get; set; }
        public int User_Id { get; set; }
        public string House_Name { get; set; }
        public string Description { get; set; }
        public bool? Is_Elevator { get; set; }
        public int Electric_Cost { get; set; }
        public int Water_Cost { get; set; }
        public string Province { get; set; }
        public string Commune { get; set; }

        public string Street { get; set; }
        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public HouseStatus Status { get; set; }

        public DateTime? Create_At { get; set; }

        // Navigation
        public User User { get; set; }
        public ICollection<Room> Rooms { get; set; }
        public ICollection<HouseImage> HouseImages { get; set; }
    }
}
