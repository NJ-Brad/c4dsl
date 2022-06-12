export class StringBuilder
{
    public text: string;

    constructor() {
        this.text = "";
    }

    public append(additionalText: string){
        this.text = this.text.concat(additionalText);
    }
}
