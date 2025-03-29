using FizzBuzzService.Services;
var builder = WebApplication.CreateBuilder(args);

// Add services to the containers
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddSingleton<GameStorageService>();

builder.Services.AddControllers();

// https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SchemaGeneratorOptions.SupportNonNullableReferenceTypes = true;
});

const string corsPolicyName = "CorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName,
        policy  =>
        {
            policy.WithOrigins("*");
            policy.WithMethods("*");
            policy.WithHeaders("*");
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(corsPolicyName);

app.UseHttpsRedirection();

// No Authorization required
// app.UseAuthorization();

app.MapControllers();

app.Run();
