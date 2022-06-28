// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Stream } from 'stream';
import * as vscode from 'vscode';
import { Block } from './Block';
import { BlockParser } from './BlockParser';

import { StringBuilder } from "./Stringbuilder";
import { StringStream } from "./StringStream";
import { BlockToC4Converter} from "./BlockToC4Converter";
import { C4Workspace } from "./C4Workspace";
import { WorkspacePublisher } from "./WorkspacePublisher";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "c4dsl" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('c4dsl.processc4dsl', () => {
		// // The code you place here will be executed every time your command is executed
		// // Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from code-c4dsl!');

        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;

            // https://stackoverflow.com/questions/45203543/vs-code-extension-api-to-get-the-range-of-the-whole-text-of-a-document
            // var firstLine = document.lineAt(0);
            // var lastLine = document.lineAt(document.lineCount - 1);
            // var textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

            // I need the full text anyway.  This isn't a waste.
            const fullText = document.getText();

            var stream: StringStream;
            stream = new StringStream(fullText);

            var bp: BlockParser = new BlockParser();

            var block: Block = new Block();
            bp.parse(block.children, stream, 0);

            var btc4: BlockToC4Converter = new BlockToC4Converter();

            var ws: C4Workspace = btc4.convert(block);

            var publisher: WorkspacePublisher = new WorkspacePublisher();

            var newText: string = fullText;
            //newText = newText + publisher.publish(ws, "Component", "MERMAID");
            newText = newText + publisher.publish(ws, "Component", "PLANT");
            // rtnVal = WorkspacePublisher.Publish(ws, "Context", "MERMAID");
            // rtnVal = WorkspacePublisher.Publish(ws, "Container", "MERMAID");


            // experimenting with misc. stuff, before putting into a class
            // // https://stackoverflow.com/questions/21895233/how-to-split-string-with-newline-n-in-node
            // var lines = fullText.split(/\r?\n/);

            // for (var ln = 0; ln < lines.length; ln++)
            // {
            //     var lineText = lines[ln];
            //     var sb: StringBuilder;
            //     sb = new StringBuilder();
                
            //     // https://stackoverflow.com/questions/1966476/how-can-i-process-each-letter-of-text-using-javascript
            //     for (var i = 0; i < lineText.length; i++) 
            //     {
            //         sb.append(lineText.charAt(i));
            //         //console.log(lineText.charAt(i));
            //     }
            //     console.log(sb);
            // }

            // experimenting with setting text
            // let newText = "Hello Brad.  You thought you couldn't write Typescript! Hah";

            // let invalidRange = new vscode.Range(0, 0, document.lineCount /*intentionally missing the '-1' */, 0);
            // let fullRange = document.validateRange(invalidRange);
            // editor.edit(edit => edit.replace(fullRange, newText));

            // display the new text
            let invalidRange = new vscode.Range(0, 0, document.lineCount /*intentionally missing the '-1' */, 0);
            let fullRange = document.validateRange(invalidRange);
            editor.edit(edit => edit.replace(fullRange, newText));

            // Clearing selection
            // https://stackoverflow.com/questions/61933072/updating-editor-selections-in-vscode-extension
            editor.selections = editor.selections.map( sel => new vscode.Selection(sel.start.translate(0,1), sel.end.translate(0,1)));
        }       
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}


