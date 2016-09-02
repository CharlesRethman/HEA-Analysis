StdInOut = function(param){
   console.log(param);
   this.param = param;
};

/*
 * Get any other user input such as user name, required dates or yes/no options. Data format can
 * also be defined in the 'format' parameter (using a RegExp).
 *
 * @param question {String} Optional. Question to be asked on StdIn. If it ends in '?', ':' or ')'
 * it will be append with a space only; if it ends with anything else it will be appended with '? '.
 * Default 'Enter: '.
 * @param format {RegExp}. Displays format as a regexp to the user. Default `/\w+|\s+/`, any number
 * of alphanumeric or whitespace characters allowed, nothing not allowed (  ).
 * @param callback {Function}. `Function (cancelled, data)` where cancelled is true if user aborts
 * (Ctrl-C).
 *
 */
StdInOut.prototype.ask = function(question, format, callback) {
   var stdin = process.stdin, stdout = process.stdout;
   if (question === undefined) stdout.write("Enter: ");
   else if (question.trim().slice(-1) == ':' || question.trim().slice(-1) == '?' || question.trim().slice(-1) == ')') stdout.write(question.trim() + ' ');
   else stdout.write(question + '? ');
   if (format === undefined) format = /\w+|\s+/;
   stdin.setEncoding('utf8');

   //still typing
   stdin.resume();

   // return
   stdin.once('data', function(data) {
/*      if (data.length > 1) {
         data = data.toString().trim();
      } else {
         data = data.toString();
      }*/
      // Ctrl-C
      if (data == '\u0003') {
         callback(true);
         stdout.write('\n'); // add a line and quit
         process.exit();
      }
      // Data in StdIn
      if (format.test(data)) {
         // trim off last whitespace
         data = data.toString().trim();
         // take the callback and pass the answer (string in data)
         callback(false, data);
      } else {
         stdout.write("It should match: "+ format +"\n");
         ask(question, format, callback);
      }
   });
}


/*
 * Get a password from stdin.
 * Adapted from <http://stackoverflow.com/a/10357818/122384>.
 *
 * @param prompt {String} Optional prompt. Default 'Password: '.
 * @param callback {Function} `function (cancelled, password)` where
 *      `cancelled` is true if the user aborted (Ctrl+C).
 * [CR]Added in nice fat bullet placeholders ('\u2022').
 * [CR]Fixed the backspace to trim off last placeholders and snip password string at end.
 * [CR]Fixed Ctrl-C (Quit) to add a line before the exit.
 *
 */
StdInOut.prototype.getPassword = function(prompt, callback) {
   var stdin = process.stdin, stdout = process.stdout
   if (callback === undefined) {
      callback = prompt;
      prompt = undefined;
   }
   if (prompt === undefined) {
      prompt = 'Password';
   }
   if (prompt) {
      stdout.write(prompt + ": ");
   }

   stdin.resume();
   stdin.setRawMode(true);
   stdin.resume();
   stdin.setEncoding('utf8');

   var password = '';
   stdin.on('data', function (ch) {
      ch = ch + '';
      switch (ch) {
      case '\n':
      case '\r':
      case '\u0004':
         // They've finished typing their password
         stdout.write('\n');
         stdin.setRawMode(false);
         stdin.pause();
         callback(false, password);
         break;
      case '\u0003':
         // Ctrl-C
         callback(true);
         stdout.write('\n'); // add a line and quit
         process.exit();
         break;
      case '\u007F':
         // Backspace: snips the stored password, clears the line, resets the cursor to 0 position, reloads the prompt and then adds the • character times the length of the new password
         if (password.length > 0) {
            password = password.slice(0, password.length - 1); // snip the password one char at end
            stdout.write('\u0008');
            stdout.write('\u0020');
            stdout.write('\u0008');
            // ALTERNATIVE SCRIPT uses process.stdout methods by clearing the line, shifting the cursor to the beginning of the line and then writing in the prompt and char holder up until the deleted entry: stdout.clearLine(); stdout.cursorTo(0); stdout.write(prompt + ': '); stdout.write('\u2022'.repeat(password.length))
         }
         break;
      default:
         // Other password characters
         stdout.write('\u2022');
         password += ch;
         break;
     }
   });
}

exports.StdInOut = StdInOut
