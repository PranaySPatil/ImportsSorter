// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "importssorter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.sortImports', () => {
		var currentlyOpenTabfilePath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.fileName : "";
		vscode.workspace.openTextDocument(currentlyOpenTabfilePath).then((document) => {
			let text = document.getText();
            let statements = text.split("\n");
            let importStatementsStartIndex = -1;
			let importStatementsEndIndex = -1;
            for (let i=0; i<statements.length; i++) {
                if (statements[i].split(" ")[0] && statements[i].split(" ")[0] === "import" && importStatementsStartIndex === -1) {
					importStatementsStartIndex = i;
				} 
				
				if (statements[i].split(" ")[0] && statements[i].split(" ")[0] === "import") {
					importStatementsEndIndex = i;
				}
			}
			
			let importStatements = statements.splice(importStatementsStartIndex, importStatementsEndIndex-importStatementsStartIndex+1).filter(statement => statement.startsWith("import"));
			importStatements = sortImportStatements(importStatements);

			for (let statement in importStatements) {
				statements.splice(importStatementsStartIndex, 0, importStatements[statement]);
				importStatementsStartIndex++;
			}

			text = statements.join("\n");
			fs.writeFile(currentlyOpenTabfilePath, text, (err) => { 
      
				// In case of a error throw err. 
				if (err) {
					throw err; 
				}
			});

			vscode.window.showInformationMessage('Sorted your imports!');
		});
	});

	context.subscriptions.push(disposable);
}

function sortImportStatements(statements: string[]): string[] {
	let requireRegex = new RegExp('".*"');
	statements.sort((a: string, b:string) => {
		a = a.match(requireRegex)[0];
		b = b.match(requireRegex)[0];
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return statements;
}

// this method is called when your extension is deactivated
export function deactivate() {}
