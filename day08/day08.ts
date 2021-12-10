import fs from 'fs';
import { isTemplateMiddle } from 'typescript';

enum Locations {
    Top = 1 << 0,
    Middle = 1 << 1,
    Bottom = 1 << 2,
    TopLeft = 1 << 3,
    TopRight = 1 << 4,
    BottomLeft = 1 << 5,
    BottomRight = 1 << 6
}


class Digit {
    public KnownValue: number | null = null;
    public PossibleValues: number[] = [];
    public Output: string;
    constructor(output: string) {
        this.Output = output;

        switch (output.length) {
            case 2:
                this.KnownValue = 1;
                break;
            case 3:
                this.KnownValue = 7;
                break;
            case 4:
                this.KnownValue = 4;
                break;
            case 5:
                this.PossibleValues = [2, 3, 5]
                break;
            case 6:
                this.PossibleValues = [0, 6, 9];
                break;
            case 7:
                this.KnownValue = 8;
                break;
            default:
                throw "Bad output";
        }
    }
}

class Entry {
    public Signal: Digit[];
    public Output: Digit[];

    constructor(entry: string) {
        const parsed = entry.split(" | ");
        this.Signal = parsed[0].split(" ").map(x => new Digit(x));
        this.Output = parsed[1].split(" ").map(x => new Digit(x));
        
        this.resolveNumbers();
    }

    private find(num: number, 
        excludes: string[] = [], 
        excludesAmount: number = 0,
        include: string[] = []): Digit {
        for (let digit of this.Signal) {
            if (digit.KnownValue == num) {
                return digit;
            }
            else if (digit.KnownValue == null 
                && digit.PossibleValues.includes(num) 
                && excludes.map(char => digit.Output.includes(char) ? 0 : 1).reduce((a: number, b: number) => a + b, 0) == excludesAmount 
                && include.map(char => digit.Output.includes(char)).reduce((a, b) => a && b, true)) 
            {
                return digit;
            }
        }

        throw "Cannot find digit";
    }

    private getFlag(output: string): number {
        return output.split('').reduce((a, b) => a | this.letterLocation[b], 0);
    }

    private digitInfo: { [num: number]: number } =
        {
            [Locations.Top | Locations.TopLeft | Locations.TopRight | Locations.BottomLeft | Locations.BottomRight | Locations.Bottom] : 0,
            [Locations.TopRight | Locations.BottomRight] : 1,
            [Locations.Top | Locations.TopRight | Locations.Middle | Locations.BottomLeft | Locations.Bottom] : 2,
            [Locations.Top | Locations.TopRight | Locations.Middle | Locations.BottomRight | Locations.Bottom] : 3,
            [Locations.TopLeft | Locations.TopRight | Locations.Middle | Locations.BottomRight] : 4,
            [Locations.Top | Locations.TopLeft | Locations.Middle | Locations.BottomRight | Locations.Bottom]: 5,
            [Locations.Top | Locations.TopLeft | Locations.Middle | Locations.BottomLeft | Locations.BottomRight | Locations.Bottom]: 6,
            [Locations.Top | Locations.TopRight | Locations.BottomRight]: 7,
            [Locations.TopLeft | Locations.Top | Locations.TopRight | Locations.Middle | Locations.BottomLeft | Locations.Bottom | Locations.BottomRight]: 8,
            [Locations.TopLeft | Locations.Top | Locations.TopRight | Locations.Middle | Locations.BottomRight | Locations.Bottom]: 9,
        };

    private letterLocation: { [letter: string]: Locations } = {
        "a": 0,
        "b": 0,
        "c": 0,
        "d": 0,
        "e": 0,
        "f": 0,
        "g": 0
    }

    private distinct(val1: string, val2: string): string {
        let set: Set<string> = new Set(val2.split(''));
        let result = ""
        for (let char of val1) {
            if(!set.has(char)) result += char;
        }

        return result;
    }

    resolveNumbers() {
        //use 1 & 7  to figure out top row
        let one = this.find(1);
        let seven = this.find(7);
        let top = this.distinct(seven.Output, one.Output);
        this.letterLocation[top] = Locations.Top;
        //use one to find 6 in order to distinguish top and bottom right
        let six = this.find(6, one.Output.split(''), 1);
        let topRight = this.distinct(one.Output, six.Output);
        this.letterLocation[topRight] = Locations.TopRight;
        let bottomRight = this.distinct(one.Output, topRight);
        this.letterLocation[bottomRight] = Locations.BottomRight;
        
        //use 5 and 6 to find bottom left
        let five = this.find(5, [topRight], 1, [bottomRight]);
        let bottomLeft = this.distinct(six.Output, five.Output);
        this.letterLocation[bottomLeft] = Locations.BottomLeft;

        //use 5 and 4 to find bottom
        let four = this.find(4);
        let bottom = this.distinct(this.distinct(five.Output, four.Output), top);
        this.letterLocation[bottom] = Locations.Bottom;

        let two = this.find(2, [], 0, [bottomLeft, topRight, top, bottom]);
        let topLeft = this.distinct(five.Output, two.Output + topRight + bottomRight);
        this.letterLocation[topLeft] = Locations.TopLeft;
        let middle = this.distinct(four.Output, topLeft + topRight + bottomRight);
        this.letterLocation[middle] = Locations.Middle;
    }

    public Calculate(): number {
        return parseInt(this.Output.map(sig => this.digitInfo[this.getFlag(sig.Output)].toString()).join(''));
    }
}

let input: Entry[] = fs.readFileSync('input.txt').toString().split('\n').map(line => new Entry(line));

const part1AcceptableSet: Set<number> = new Set([1, 4, 7, 8])

const part1 = input.reduce((a, b) => a += b.Output.reduce((a, b) => {

    if (b.KnownValue != null && part1AcceptableSet.has(b.KnownValue)) {
        a++;
    }

    return a;
}, 0), 0);
console.log(part1);

class Display {
    Entries: Entry[];

    constructor(entries: Entry[]) {
        this.Entries = entries;
    }

    public Calculate(): number
    {
        return this.Entries.reduce((a, b) => a + b.Calculate(), 0);
    }
}

console.log(new Display(input).Calculate());