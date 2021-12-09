import fs from 'fs';

class Diagram
{
    Lines: Line[] = [];
    Begin: Point = new Point(0, 0);
    End: Point;

    Diagram: number[][];

    public OverlapPoints: number = 0;;

    constructor(lines: Line[], allowedTypes: Set<LineType>)
    {
        let maxX = 0;
        let maxY = 0;
        for(let line of lines)
        {
            if(allowedTypes.has(line.Type))
            {
                this.Lines.push(line);
                maxX = Math.max(maxX, line.MaxX);
                maxY = Math.max(maxY, line.MaxY);
            }
        }

        this.End = new Point(Math.max(maxX, maxY), Math.max(maxX, maxY));
        this.Diagram = [];
        this.drawDiagram();
    }

    private drawDiagram()
    {
        for(let y = 0; y <= this.End.Y; y++)
        {
            let row = [];
            for(let x = 0; x <= this.End.X; x++)
            {
                row.push(0);
            }

            this.Diagram.push(row);
        }

        for(let line of this.Lines)
        {
            for(let point of line.Range)
            {
                this.Diagram[point.Y][point.X] += 1;

                if(this.Diagram[point.Y][point.X] == 2)
                {
                    this.OverlapPoints++;
                }
            }
        }
    }

    public Print()
    {
        for(const row of this.Diagram)
        {
            console.log(row.reduce((line, point) => `${line}${point == 0 ? '.' : point}`, ""));
        }
    }
}

class Line
{
    Begin: Point;
    End: Point;
    Range: Point[] = [];

    MaxX: number;
    MaxY: number;
    Type: LineType = LineType.Unknown;

    constructor(begin: Point, end: Point)
    {
        this.Begin = begin;
        this.End = end;
        this.calculateRange();
        this.MaxX = Math.max(this.Begin.X, this.End.X);
        this.MaxY = Math.min(this.Begin.Y, this.End.Y);
    }

    private calculateRange()
    {
        let range: Point[] = [];

        if(this.Begin.X == this.End.X)
        {
            this.Type = LineType.Horiz;
            range = this.range(this.Begin.Y, this.End.Y).map(y => new Point(this.Begin.X, y));
        }
        else if(this.Begin.Y == this.End.Y)
        {
            this.Type = LineType.Vert;
            range = this.range(this.Begin.X, this.End.X).map(x => new Point(x, this.Begin.Y));
        }
        else if (this.degreeOfLine() == 45)
        {
            let x = this.range(this.Begin.X, this.End.X);
            let y = this.range(this.Begin.Y, this.End.Y);

            for(let i = 0; i < x.length; i++)
            {
                range.push(new Point(x[i], y[i]));
            }
            this.Type = LineType.Diag;
        }

        this.Range = range;
    }

    private range(begin: number, end: number): number[]
    {
        let result = [begin];

        if(begin > end)
        {
            for(let i = begin - 1; i > end; i--)
            {
                result.push(i);
            }
        }
        else
        {
            for(let i = begin + 1; i < end; i++)
            {
                result.push(i);
            }
        }

        result.push(end);
        return result;
    }

    private degreeOfLine() : number
    {
       let theta = Math.atan2(Math.abs(this.End.Y - this.Begin.Y), Math.abs(this.End.X - this.Begin.X));
       theta *=  180 / Math.PI;
       return theta;
    }
}

enum LineType
{
    Unknown,
    Horiz,
    Vert,
    Diag
}

class Point
{
    constructor(x: number, y: number)
    {
        this.X = x;
        this.Y = y;
    }

    X: number;
    Y: number;
}

let input: Line[] = fs
.readFileSync('input.txt')
.toString()
.split('\n')
.map(position => 
    {
        const linePoints = position
                            .split(' -> ')
                            .map(point => 
                                {
                                    let coord = point.split(',');
                                     return new Point(parseInt(coord[0]), parseInt(coord[1]));
                                });
        return new Line(linePoints[0], linePoints[1]);
    }
);


const part1Diagram = new Diagram(input, new Set<LineType>([LineType.Horiz, LineType.Vert]));
// part1Diagram.Print();
console.log(part1Diagram.OverlapPoints);

const part2Diagram = new Diagram(input, new Set<LineType>([LineType.Horiz, LineType.Vert, LineType.Diag]));
// part2Diagram.Print();
console.log(part2Diagram.OverlapPoints);