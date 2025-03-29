using NJsonSchema;
using NJsonSchema.CodeGeneration.TypeScript;

// var schema = JsonSchema.FromType<Game>();
var schema = await JsonSchema.FromFileAsync("gameSchema.json");

var generator = new TypeScriptGenerator(schema);
var source = generator.GenerateFile();

Console.WriteLine(source);
