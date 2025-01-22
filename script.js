//  <!-- JavaScript for Output -->
        const editor = document.getElementById('editor');
        const output = document.getElementById('output');
        const runButton = document.getElementById('runButton');
        const consoleOutput = document.getElementById('consoleOutput');

        function clearOutput() {
            const iframeDoc = output.contentDocument || output.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(''); // Clear the iframe content
            iframeDoc.close();
            consoleOutput.textContent = ''; // Clear the console output
        }

        function captureConsoleLogs() {
            const originalConsoleLog = console.log;
            consoleOutput.textContent = ''; // Clear previous logs

            // Override console.log
            console.log = function (...args) {
                args.forEach(arg => {
                    consoleOutput.textContent += arg + '\n';
                });
                originalConsoleLog.apply(console, args);
            };

            // Override console.error for errors
            console.error = function (...args) {
                args.forEach(arg => {
                    consoleOutput.textContent += 'ERROR: ' + arg + '\n';
                });
                originalConsoleLog.apply(console, args);
            };
        }

        runButton.addEventListener('click', () => {
            const userCode = editor.value;

            // Check if the user has written pure JavaScript (no HTML or CSS)
            if (!userCode.includes('<') && !userCode.includes('>')) {
                try {
                    captureConsoleLogs(); // Capture console.log outputs
                    new Function(userCode)(); // Safely evaluate the JavaScript code
                } catch (error) {
                    console.error(error.message); // Show errors in console output
                }
            } else {
                // Handle HTML/CSS/JavaScript together
                const iframeDoc = output.contentDocument || output.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(userCode);
                iframeDoc.close();
            }
        });

        // Clear output when the editor is clicked
        editor.addEventListener('focus', clearOutput);