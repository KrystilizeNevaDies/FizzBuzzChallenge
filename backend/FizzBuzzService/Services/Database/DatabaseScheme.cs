using SQLite;
namespace FizzBuzzService.Services.Database;

public class GameStorage {

    [PrimaryKey]
    public string GameCode { get; set; }

    public string Game { get; set; }

    public long Created { get; set; }

    public long Modified { get; set; }
}