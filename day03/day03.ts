import fs from 'fs';
let input: string[] = fs.readFileSync('input.txt').toString().split('\n');

class DiagnosticReport {
    constructor(input: string[]) {
        this.report = input;
        this.process(input);
    }
    private report: string[];
    private gamma: number = 0;
    private epsilon: number = 0;
    private oxygenGenRating: number = 0;
    private cO2ScrubberRating: number = 0;

    public PrintDiagnostics()
    {
        console.log("Power Consumption: ", this.PowerConsumption);
        console.log("   epsilon: ", this.epsilon)
        console.log("   gamma: ", this.gamma)
        console.log("Life Support Rating: ", this.LifeSupportRating);
        console.log("   oxygen generator rating: ", this.oxygenGenRating)
        console.log("   co2 generator rating: ", this.cO2ScrubberRating)

    }

    public get PowerConsumption(): number
    {
        return this.gamma * this.epsilon;
    }

    public get LifeSupportRating(): number
    {
        return this.oxygenGenRating * this.cO2ScrubberRating;
    }

    private process(input: string[]) 
    {
       this.resolvePower(input);
        this.oxygenGenRating = this.parseRating(input, 1, Math.max);
        this.cO2ScrubberRating = this.parseRating(input, 0, Math.min);
    }

    private resolvePower(input: string[])
    {
        const parsed: number[][] = Array.from({ length: input[0].length }, x => [0, 0]);
        for (let bin of input) {
            const binParsed: string[] = bin.split("");

            for (let i = 0; i < binParsed.length; i++) {
                const num: number = parseInt(binParsed[i]);
                parsed[i][num]++;
            }
        }

        let gamma = "";
        let epsilon = "";

        for (let i = 0; i < parsed.length; i++) {
            const zero = parsed[i][0];
            const one = parsed[i][1];
            if (zero < one) {
                gamma += "1";
                epsilon += "0";
            }
            else {
                gamma += "0";
                epsilon += "1";
            }
        }

        this.gamma = parseInt(gamma, 2);
        this.epsilon = parseInt(epsilon, 2)
    }

    private parseRating(input: string[], prefIndex: number, prefFunc: (...values: number[]) => number): number
    {
        let position = 0;
        let filtered: string[] = input;
        const otherIndex = Math.abs(prefIndex - 1);

        while(position < input[0].length)
        {
            let parsed: string[][] = [[], []];

            for(let i = 0; i < filtered.length; i++)
            {
                const currentBin = filtered[i];
                const current = parseInt(currentBin[position]);
                parsed[current].push(currentBin);
            }

            if(parsed[prefIndex].length == parsed[otherIndex].length || prefFunc(parsed[1].length, parsed[0].length) == parsed[prefIndex].length)
            {
                filtered = parsed[prefIndex];
            }
            else
            {
                filtered = parsed[otherIndex];
            }

            if(filtered.length == 1) break;
            
            position++;
            parsed[0] = [];
            parsed[1] = [];
        }

        return parseInt(filtered[0], 2);
    } 
}

new DiagnosticReport(input).PrintDiagnostics();