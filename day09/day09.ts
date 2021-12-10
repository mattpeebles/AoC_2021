import fs from 'fs';
class HeightMap
{
    public Nodes: Node[];
    public Basins: Basin[];
    private LowPoints: Node[];

    constructor(map: Node[][])
    {
        this.Nodes = [];
        this.Basins = [];
        this.LowPoints = [];
        
        for(let row of map)
        {
            for(let node of row)
            {
                this.Nodes.push(node.ResolveNeighbors(map));
                if(node.IsLowPoint)
                {
                    this.LowPoints.push(node);
                }
            }
        }

        const processedLowPoints: Set<Node> = new Set(); 

        for(let lowPoint of this.LowPoints)
        {
            if(processedLowPoints.has(lowPoint)) continue;

            let basin = new Basin(lowPoint);
            basin.LowPoints.forEach(lp => processedLowPoints.add(lp))
            this.Basins.push(basin);
        }
    }

    public get RiskLevel(): number
    {
        return this.Basins.reduce((a, b) => a += b.StartingLowPoint.Value + 1, 0)
    }

    public LargestBasinSizes(basinCount: number): number
    {
       return this.Basins.sort((a, b) => b.Size - a.Size).slice(0, basinCount).reduce((a, b) => a * b.Size, 1);
    }
}

class Node
{
    Row: number;
    Column: number;
    Value: number;
    Neighbors: Node[] = [];
    IsLowPoint: boolean = false;

    constructor(row: number, column: number, value: number)
    {
        this.Row = row;
        this.Column = column;
        this.Value = value;
    }

    public ResolveNeighbors(map: Node[][]): Node
    {
        if(this.Row > 0)
        {
            this.Neighbors.push(map[this.Row - 1][this.Column]);
        }
        
        if(this.Row < map.length - 1)
        {
            this.Neighbors.push(map[this.Row + 1][this.Column]);
        }

        if(this.Column > 0)
        {
            this.Neighbors.push(map[this.Row][this.Column - 1]);
        }

        if(this.Column < map[this.Row].length - 1)
        {
            this.Neighbors.push(map[this.Row][this.Column + 1]);
        }

        this.IsLowPoint = this.Neighbors.reduce((a: boolean, b) => a && this.Value < b.Value, true);
        return this;
    }
}

class Basin
{
    public StartingLowPoint: Node;
    private Nodes: Node[];
    public LowPoints: Node[];

    constructor(lowPoint: Node)
    {
        this.StartingLowPoint = lowPoint;
        this.Nodes = [];
        this.LowPoints = [];
        this.resolveBasin();
    }

    private resolveBasin()
    {
        const seen: Set<Node> = new Set();
        const queue: Node[] = [this.StartingLowPoint];

        while(queue.length > 0)
        {
            const currentNode = queue.pop();

            if(currentNode == undefined) throw "Cannot parse undefined node";

            if(!seen.has(currentNode) && currentNode.Value < 9)
            {
                this.Nodes.push(currentNode);
                seen.add(currentNode);

                if(currentNode.IsLowPoint)
                {
                    this.LowPoints.push(currentNode);
                }

                for(let neighbor of currentNode.Neighbors)
                {
                    if(!seen.has(neighbor) && neighbor.Value < 9)
                    {
                        queue.push(neighbor);
                    }
                }
            }
        }
    }

    public get Size(){
        return this.Nodes.length;
    }
}


let input: Node[][] = fs
.readFileSync('input.txt')
.toString()
.split('\n')
.map((row, i) => row.split('').map((col, j) => new Node(i, j, parseInt(col))));


const map = new HeightMap(input);
console.log(map.RiskLevel);
console.log(map.LargestBasinSizes(3))