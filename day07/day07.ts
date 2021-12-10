import fs from 'fs';
let input: number[] = fs.readFileSync('input.txt').toString().split(',').map(x => parseInt(x));

function part1(crabs: number[]): number {
    const seen = new Set<number>();
    let fuelUsage: number = Infinity;

    for (let crab of crabs) {
        if (seen.has(crab)) continue;
        seen.add(crab);
        fuelUsage = Math.min(fuelUsage, crabs.reduce((a, b) => a + Math.abs(b - crab), 0));
    }

    return fuelUsage;
}

function part2(crabs: number[]) : number
{
    let fuelUsage: number = Infinity;
    let maxCrab: number = crabs.reduce((a, b) => Math.max(a, b), 0);
    const rangeFinder = new Range();
    for (let i = 0; i <= maxCrab; i++) 
    {
        fuelUsage = Math.min(fuelUsage, crabs.reduce((a, b) => a += rangeFinder.Find(Math.abs(b - i)), 0));
    }

    return fuelUsage;
}

class Range
{
    seen: number[];
    constructor()
    {
        this.seen = [];
    }

    public Find(num: number): number
    {
        if(num == 0) return 0; 

        if(this.seen[num] != null)
        {
            return this.seen[num];
        }

        let result: number = num + this.Find(num - 1);
        this.seen[num] = result;
        return result;
    }
}

// class CrabSchool {
//     private line: number[];
//     private fuelConsumed = 0;
//     private crabs: number[];
//     private startNum: number = 0;
//     private neighborCount: number = 0;

//     constructor(crabs: number[]) {
//         this.line = [];
//         this.crabs = crabs;

//         for (let crab of crabs) {
//             if (this.line[crab] == undefined) {
//                 this.line[crab] = 0;
//             }

//             this.line[crab] += 1;
//         }
//     }

//     public CalculateFuelUsage(): number {
//         this.startNum = this.calculateTarget();
//         return this.crabs.reduce((a, b) => this.sum(a, Math.abs(b - this.startNum)), 0);
//     }

//     private calculateTarget(): number {
//         const lowestNeighborAllowed = 0;
//         const maxNeighbors = this.line.length;
//         let maxNeighborsNums: number[] = [];
//         let maxNumber = 0;
//         let currentNeighbor = lowestNeighborAllowed;
//         let continueSearch = true;

//         while (continueSearch && currentNeighbor <= maxNeighbors && maxNeighborsNums.length != 1) {
//             let localNeighborMax = 0;
//             let localMax: number[] = [];
//             this.line.forEach((val, index) => {
//                 if (val == undefined) return;

//                 let neighborsOfVal = this.calculateNeighbors(index, currentNeighbor);

//                 if (neighborsOfVal == localNeighborMax) {
//                     localMax.push(index);
//                 }
//                 else if (neighborsOfVal > localNeighborMax) {
//                     localMax = [index];
//                     localNeighborMax = neighborsOfVal;
//                 }
//             })

//             if (localNeighborMax < maxNumber) {
//                 continueSearch = false;
//             }
//             else if (localNeighborMax > maxNumber) {
//                 maxNumber = localNeighborMax;
//                 maxNeighborsNums = localMax;
//             }

//             currentNeighbor++;
//         }

//         this.neighborCount = currentNeighbor--;
//         return maxNeighborsNums[0];
//     }

//     private calculateNeighbors(index: number, numOfNeighbors: number) {
//         let lowerStart = index - numOfNeighbors;
//         let upperEnd = index + numOfNeighbors;

//         if (lowerStart < 0) {
//             lowerStart = 0;
//         }

//         if (upperEnd >= this.line.length) {
//             upperEnd = this.line.length;
//         }


//         let total = this.line.slice(lowerStart, upperEnd + 1).reduce(this.sum, 0);
//         return total;
//     }

//     private sum(a: number | undefined, b: number | undefined): number {
//         return (a ?? 0) + (b ?? 0);
//     }
// }

console.log(part1(input));
console.log(part2(input));