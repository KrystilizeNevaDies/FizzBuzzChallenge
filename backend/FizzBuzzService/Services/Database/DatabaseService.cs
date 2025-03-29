
using SQLite;
namespace FizzBuzzService.Services;

public class DatabaseService
{
    private static Task<SQLiteConnection>? _connection;

    private static async Task<SQLiteConnection> Connect()
    {
        return new SQLiteConnection("./storage.db");
    }

    /// <summary>
    /// Consumes the next available database connection
    /// </summary>
    /// <returns>Task for the next available database connection. This connection will be open and ready.</returns>
    public async Task<SQLiteConnection> UseConnection()
    {
        _connection ??= Connect();
        return await _connection;
    }
}
