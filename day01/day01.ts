import fs from 'fs';
const input = fs.readFileSync('day01.txt').toString().split('\n');

function depthAnalyzer(input: string[])
{
    let count = 0;
    
    for(let i = 1; i < input.length; i++)
    {
        const previous = parseInt(input[i - 1]);
        const current = parseInt(input[i]);

        if(previous < current)
        {
            count++;
        }
    }

    return count;
}

function resolveWindow(input: string[], startIndex: number, length: number): number[]
{
    return input.slice(startIndex, startIndex + length).map(x => parseInt(x));
}

const sum = (a: number, b: number) => a + b;

function windowDepthAnalyzer(input: string[], windowSize: number)
{
    let count = 0;
    
    for(let i = 1; i < input.length - 2; i++)
    {
        const previousWindow = resolveWindow(input, i - 1, windowSize)
        const currentWindow = resolveWindow(input, i, windowSize);

        if(previousWindow.length != windowSize || currentWindow.length != windowSize)
        {
            break;
        }

        if(previousWindow.reduce(sum) < currentWindow.reduce(sum))
        {
            count++;
        }
    }

    return count;
}

//part one
console.log(depthAnalyzer(input));

//part two
console.log(windowDepthAnalyzer(input, 3));