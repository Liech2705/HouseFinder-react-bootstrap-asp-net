
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Domain.Entities
{
    public class RoomProperty
    {
        [Key]
        public int Property_Id { get; set; }
        [ForeignKey("Room")]
        public int Room_Id { get; set; }
        public bool Has_AirConditioner { get; set; }
        public bool Has_Wifi { get; set; }
        public int Bed_Count { get; set; }
        public bool Has_Closet { get; set; }
        public bool Has_Mezzanine { get; set; }
        public bool Has_Fridge { get; set; }
        public bool Has_Hot_Water { get; set; }
        public bool Has_Window { get; set; }
        public bool Has_Pet { get; set; }
        public string? Note { get; set; }
        public DateTime Update_At { get; set; }

        // Navigation
        public Room Room { get; set; }
    }
}
