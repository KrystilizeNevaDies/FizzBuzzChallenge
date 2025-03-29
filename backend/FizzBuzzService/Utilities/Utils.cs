namespace FizzBuzzService.Utilities;

public static class Utils
{
    private const double Tolerance = 0.0001;

    public static bool EqualsTolerant(double a, double b)
    {
        return Math.Abs(a - b) < Tolerance;
    }
}
