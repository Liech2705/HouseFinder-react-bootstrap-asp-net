using MyApi.Domain.Entities;

public class Review
{
    public int Review_Id { get; set; }
    public int User_Id { get; set; }
    public int Room_Id { get; set; }

    public byte Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime Created_At { get; set; }

    // Navigation
    public User User { get; set; }
    public Room Room { get; set; }
}
