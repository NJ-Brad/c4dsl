import { Block } from "./Block";
import { C4Item } from "./C4Item";
import { C4Relationship } from "./C4Relationship";
import { C4Workspace } from "./C4Workspace";
import { LineParser } from "./LineParser";
import { StringBuilder } from "./Stringbuilder";

export class WorkspacePublisher
{
    redirections = new Map<string, string>();
    public diagramType: string = "";

    public publish(workspace: C4Workspace , diagramType: string , format: string ) : string    {

        this.diagramType = diagramType;

        var rtnVal: string  = "";
        switch (format)
        {
            case "MERMAID":
                switch (diagramType)
                {
                    case "Context":
                        rtnVal = this.publishMermaidContext(workspace);
                        break;
                    case "Container":
                        rtnVal = this.publishMermaidContainer(workspace);
                        break;
                    case "Component":
                        rtnVal = this.publishMermaidComponent(workspace);
                        break;
                    default:
                        rtnVal = this.publishMermaid(workspace);
                        break;
                }
                break;
            case "PLANT":
                break;
        }

        return rtnVal;
    }

    private  publishMermaidComponent(workspace: C4Workspace ) : string    {
        return this.publishMermaid(workspace);
    }

    private publishMermaid(workspace: C4Workspace ) : string 
    {
        var sb: StringBuilder  = new StringBuilder();

        sb.append(this.mermaidHeader(workspace));

        var item: C4Item;
        for (var itmNum = 0; itmNum < workspace.items.length; itmNum++)
        {
            item = workspace.items[itmNum];
            sb.append(this.mermaidItem(item));
        }

        var rel: C4Relationship;
        for (var relNum = 0; relNum < workspace.relationships.length; relNum++)
        {
            rel = workspace.relationships[relNum];
            sb.append(this.mermaidConnection(rel));
        }

        return sb.text;
    }

     private publishMermaidContext(workspace: C4Workspace ) : string {
         var sb: StringBuilder = new StringBuilder();

         sb.append(this.mermaidHeader(workspace));

         this.createContextRedirects(workspace.items);

        var item: C4Item;
        for (var itmNum = 0; itmNum < workspace.items.length; itmNum++)
        {
            item = workspace.items[itmNum];
            sb.append(this.mermaidItem(item));
        }

        var connections: string[] = [];
        var rel: C4Relationship;
        var newConn: string;
        for (var relNum = 0; relNum < workspace.relationships.length; relNum++)
        {
            rel = workspace.relationships[relNum];
            newConn = this.mermaidConnection(rel);

            if(!this.isInList(newConn, connections)){
                sb.append(this.mermaidConnection(rel));
            }
        }

        return sb.text;
     }

    private isInList(lookFor: string, lookIn: string[]): boolean{

        return false;
    }

    private publishMermaidContainer(workspace: C4Workspace ) : string    {
        var sb: StringBuilder = new StringBuilder();

        sb.append(this.mermaidHeader(workspace));

        this.createContainerRedirects(workspace.items);

        var item: C4Item;
        for (var itmNum = 0; itmNum < workspace.items.length; itmNum++)
        {
            item = workspace.items[itmNum];
            sb.append(this.mermaidItem(item));
        }

        var rel: C4Relationship;
        for (var relNum = 0; relNum < workspace.relationships.length; relNum++)
        {
            rel = workspace.relationships[relNum];
            sb.append(this.mermaidConnection(rel));
        }

        return sb.text;
    }

     private createContextRedirects(items: C4Item[], redirectTo: string = "")  {

        var item: C4Item;
        for (var itmNum = 0; itmNum < items.length; itmNum++)
        {
            item = items[itmNum];

             if (redirectTo !== "")
             {
                 this.redirections.set(item.id, redirectTo);
                 if (item.items.length > 0)
                 {
                     this.createContextRedirects(item.items, redirectTo);
                 }
             }
             else
             {
                 switch (item.itemType)
                 {
                     case "SYSTEM":
                     case "DATABASE":
                         this.createContextRedirects(item.items, item.id);
                         break;
                 }
             }
         }
     }

     private createContainerRedirects(items: C4Item[], redirectTo: string = "")  {
        var item: C4Item;
        for (var itmNum = 0; itmNum < items.length; itmNum++)
        {
            item = items[itmNum];
            if (redirectTo !== "")
            {
                 this.redirections.set(item.id, redirectTo);
                if (item.items.length > 0)
                {
                    this.createContainerRedirects(item.items, redirectTo);
                }
            }
            else
            {
                switch (item.itemType)
                {
                    case "CONTAINER":
                        this.createContainerRedirects(item.items, item.id);
                        break;
                }
            }
        }
     }

    private mermaidHeader(workspace: C4Workspace): string     {
        var sb: StringBuilder = new StringBuilder();
        sb.append("flowchart TB");
        sb.append("\r\n");
// classDef borderless stroke-width:0px
// classDef darkBlue fill:#00008B, color:#fff
// classDef brightBlue fill:#6082B6, color:#fff
// classDef gray fill:#62524F, color:#fff
// classDef gray2 fill:#4F625B, color:#fff

// ");

        return sb.text;
    }

    private buildIndentation(level: number){
        var rtnVal: string = "";

        for(var i = 0; i< (4*level); i++){
            rtnVal = rtnVal + " ";
        }
        return rtnVal;
    }

    private mermaidItem(item: C4Item, indent: number = 1) : string 
    {
        var sb: StringBuilder = new StringBuilder();

        var indentation: string = this.buildIndentation(indent);
        var displayType:string = item.itemType;
        var goDeeper: boolean = true;

        switch (item.itemType)
        {
            case "PERSON":
                if(item.external)
                {
                    displayType = "External Person";
                }
                else
                { 
                    displayType = "Person";
                }
                break;
            case "SYSTEM":
                if (item.external)
                {
                    displayType = "External System";
                }
                else
                {
                    if(this.ciEquals(this.diagramType, "Context"))
                    {
                        goDeeper = false;
                        displayType = "System";
                    }
                    else if (item.items.length === 0)
                    {
                        displayType = "System";
                    }
                    else
                    {
                        displayType = "System Boundary";
                    }
                }
                break;
            case "CONTAINER":
                if (item.external)
                {
                    displayType = "External Container";
                }
                else
                {
                    if(this.ciEquals(this.diagramType, "Container"))
                    {
                        goDeeper = false;
                        displayType = "Container";
                    }
                    else if (item.items.length === 0)
                    {
                        displayType = "Container";
                    }
                    else
                    {
                        displayType = "Container Boundary";
                    }
                }
                break;
            case "DATABASE":
                if (item.external)
                {
                    displayType = "External Database";
                }
                else
                {
                    if(this.ciEquals(this.diagramType, "Container"))
                    {
                        goDeeper = false;
                        displayType = "Database";
                    }
                    else if (item.items.length === 0)
                    {
                        displayType = "Database";
                    }
                    else
                    {
                        displayType = "Database Boundary";
                    }
                }
                break;
        }

        var displayLabel: string = `\"<strong><u>${item.label}</u></strong>`;
        var brokenDescription: string = item.description.replace("`", "<br/>");

        if (item.description.length !== 0)
        {
            displayLabel = displayLabel + `<br/>${brokenDescription}`;
        }

        displayLabel += `<br/>&#171;${displayType}&#187;\"`;

        if (!goDeeper || (item.items.length === 0))
        {
            sb.append(`${indentation}${item.id}[${displayLabel}]`);
            sb.append("\r\n");
        }
        else
        {
            sb.append(`${indentation}subgraph ${item.id}[${displayLabel}]`);
            sb.append("\r\n");
            indent++;

            var item2: C4Item;
            for (var itmNum = 0; itmNum < item.items.length; itmNum++)
            {
                item2= item.items[itmNum];
                sb.append(this.mermaidItem(item2, indent).trimEnd());
                sb.append("\r\n");
            }
            sb.append(`${indentation}end`);
            sb.append("\r\n");
        }

        return sb.text;
    }

    private mermaidConnection(rel: C4Relationship , indent: number = 1) : string  {
        var sb: StringBuilder = new StringBuilder();

        var indentation: string = this.buildIndentation(indent);

        var from: string = rel.from;
        var to: string = rel.to;
        var redirected: boolean = false;

        if(this.redirections.has(from))
        {
            from = this.redirections.get(from)!;
            redirected = true;
        }

        if (this.redirections.has(to))
        {
            to = this.redirections.get(to)!;
            redirected = true;
        }

        if (from === to){
            return "";
        }

        if (redirected || (rel.technology.length === 0 ))
        {
            sb.append(`${indentation}${from}--\"${rel.label}\"-->${to}`);
            sb.append("\r\n");        }
        else
        {
            sb.append(`${indentation}${from}--\"${rel.label}<br>[${rel.technology}]\"-->${to}`);
            sb.append("\r\n");
        }

        return sb.text;
    }

    // https://stackoverflow.com/questions/2140627/how-to-do-case-insensitive-string-comparison
    ciEquals(a: string, b : string) {
        return typeof a === 'string' && typeof b === 'string'
            ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
            : a === b;
    }    

}