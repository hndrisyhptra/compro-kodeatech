import ts from 'typescript';
import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const printer=ts.createPrinter({newLine:ts.NewLineKind.LineFeed});
for(const folder of ['app','components','features','lib','services','hooks','types','database','tests','scripts'])walk(folder);
function walk(folder){for(const entry of readdirSync(folder,{withFileTypes:true})){if(entry.name.startsWith('.'))continue;const path=join(folder,entry.name);if(entry.isDirectory())walk(path);else if(/\.tsx?$/.test(path)){const source=ts.createSourceFile(path,readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true,path.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);writeFileSync(path,printer.printFile(source));}}}
