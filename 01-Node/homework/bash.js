// console.log(Object.keys(process));

const commands = require("./commands");

const done = function (output) {
  process.stdout.write(output);
  process.stdout.write("\nprompt > ");
};

// Output un prompt
process.stdout.write("prompt > ");
// El evento stdin 'data' se dispara cuando el user escribe una línea
process.stdin.on("data", function (data) {
  var args = data.toString().trim().split(" ");
  var cmd = args.shift();
  if (commands.hasOwnProperty(cmd)) {
    // process.stdout.write(Date());
    commands[cmd](args, done);
  } else {
    process.stdout.write("Command not found");
  }
  //   process.stdout.write("\nprompt > ");
});
