import * as fs from 'fs';
import { Block } from './Block';
import { BlockParser } from './BlockParser';

import { StringBuilder } from "./Stringbuilder";
import { StringStream } from "./StringStream";
import { BlockToC4Converter} from "./BlockToC4Converter";
import { C4Workspace } from "./C4Workspace";
import { WorkspacePublisher } from "./WorkspacePublisher";
import { MermaidRunner } from "./MermaidRunner";

//let message: string = 'Hello World';
//console.log(message);

// https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
// https://bobbyhadz.com/blog/typescript-cannot-find-name-process#:~:text=To%20solve%20the%20error%20%22Cannot,json%20and%20restarting%20your%20IDE.
const myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);

// switch (myArgs[0]) {
//   case 'insult':
//     console.log(myArgs[1], 'smells quite badly.');
//     break;
//   case 'compliment':
//     console.log(myArgs[1], 'is really cool.');
//     break;
//   default:
//     console.log('Sorry, that is not something I know how to do.');
// }

//const fullText = document.getText();

//const fullText = fs.readFileSync('flight.txt').toString('utf-8');
const fullText = fs.readFileSync(myArgs[0]).toString('utf-8');

var stream: StringStream;
stream = new StringStream(fullText);

var bp: BlockParser = new BlockParser();

var block: Block = new Block();
bp.parse(block.children, stream, 0);

var btc4: BlockToC4Converter = new BlockToC4Converter();

var ws: C4Workspace = btc4.convert(block);

var publisher: WorkspacePublisher = new WorkspacePublisher();

//var newText: string = fullText;

 //var newText = "```mermaid" + "\r\n" + publisher.publish(ws, "Context", "PLANT") + "\r\n" + "```";
 //var newText = "```mermaid" + "\r\n" + publisher.publish(ws, "Component", "PLANT") + "\r\n" + "```";
// var newText = "```mermaid" + "\r\n" + publisher.publish(ws, "Container", "PLANT") + "\r\n" + "```";
 //fs.writeFileSync(myArgs[1], newText);

var newText = "";
var path = require('path');
var dirName = path.dirname(myArgs[0]);
var outName : string;
var imgName : string;
var rnr: MermaidRunner = new MermaidRunner();

outName = `${dirName}/context.mmd`;
imgName = `${dirName}/context.png`;
newText = publisher.publish(ws, "Context", "PLANT");
fs.writeFileSync(outName, newText);
rnr.convert(outName, imgName);

outName = `${dirName}/container.mmd`;
imgName = `${dirName}/container.png`;
newText = publisher.publish(ws, "Container", "PLANT");
fs.writeFileSync(outName, newText);
rnr.convert(outName, imgName);

outName = `${dirName}/component.mmd`;
imgName = `${dirName}/component.png`;
newText = publisher.publish(ws, "Component", "PLANT");
fs.writeFileSync(outName, newText);
rnr.convert(outName, imgName);

