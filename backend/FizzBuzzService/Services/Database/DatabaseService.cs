
using SQLite;
namespace FizzBuzzService.Services.Database;

public class DatabaseService
{
    private static Task<ISQLiteConnection>? _connection;

    private static async Task<ISQLiteConnection> Connect()
    {
        return new SQLiteConnection("./storage.db");
    }

    /// <summary>
    /// Consumes the next available database connection
    /// </summary>
    /// <returns>Task for the next available database connection. This connection will be open and ready.</returns>
    public virtual async Task<ISQLiteConnection> UseConnection()
    {
        _connection ??= Connect();
        return await _connection;
    }
}
