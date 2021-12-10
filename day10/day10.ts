import fs from 'fs';

declare type openChars = "{" | "(" | "[" | "<";
declare type closeChars = "}" | ")" | "]" | ">";
declare type allChars = openChars | closeChars;

class Parser 
{
    public PointsForCorrupted: number = 0;
    private PointsForAutoCorrectList: number[] = [];
    public get PointsForAutoComplete(){
        return this.PointsForAutoCorrectList[Math.floor(this.PointsForAutoCorrectList.length / 2)];
    }

    private ClosingChar: Record<openChars, closeChars> =
        {
            "{": "}",
            "(": ")",
            "[": "]",
            "<": ">"
        };

    private CorruptedPointValues: Record<closeChars, number> = {
        ")": 3,
        "]": 57,
        "}": 1197,
        ">": 25137
    };

    private AutoCompletePointValues: Record<closeChars, number> = {
        ")": 1,
        "]": 2,
        "}": 3,
        ">": 4
    };

    constructor(lines: allChars[]) 
    {
        this.parse(lines);
    }

    private parse(lines: allChars[])
    {
        for(let line of lines)
        {
            let expectedChar: closeChars[] = [];
            let corrupted: boolean = false;
            for(let char of line)
            {
                const matchedClosingChar: closeChars | undefined = this.ClosingChar[char as openChars];
                if(matchedClosingChar != undefined)
                {
                    expectedChar.push(matchedClosingChar);
                    continue;
                }
                
                const expected = expectedChar.pop();

                if(char != expected)
                {
                    this.PointsForCorrupted += this.CorruptedPointValues[char as closeChars];
                    corrupted = true;
                    break;
                }
            }

            if(!corrupted)
            {
                let points = 0;
                for(let i = expectedChar.length - 1; i >= 0; i--)
                {
                    points *= 5;
                    points += this.AutoCompletePointValues[expectedChar[i] as closeChars];
                }
                this.PointsForAutoCorrectList.push(points);
            }
        }

        this.PointsForAutoCorrectList = this.PointsForAutoCorrectList.sort((a, b) => a - b);
    }
}

let input: allChars[] = fs.readFileSync('input.txt').toString().split('\n').map(x => x.trim() as allChars);

const parser = new Parser(input);
console.log(parser.PointsForCorrupted);
console.log(parser.PointsForAutoComplete);