import fs from 'fs';
let input: ICommand[] = fs.readFileSync('input.txt').toString().split('\n').map(resolveCommand);

function resolveCommand(command: string) : ICommand
{        
    const [direction, value] = command.split(' ');
    return { Direction: direction as ("up" | "down" | "forward"), Magnitude: parseInt(value)};
}

interface ISub
{
    move(commands: ICommand[]): void;
    position: number;
    printPosition(): void;
} 

class SimpleSub implements ISub
{ 
    protected horiz: number = 0;
    protected depth: number = 0;

    public move(commands: ICommand[]): SimpleSub
    {
        for(const command of commands)
        {
            switch(command.Direction)
            {
                case "up":
                    this.up(command.Magnitude);
                    break;
                case "down":
                    this.down(command.Magnitude);
                    break;
                case "forward":
                    this.forward(command.Magnitude);
                    break;
            }
        }

        return this;
    }

    protected forward(value: number) 
    {
        this.horiz += value;
    }
    
    protected up(value: number) {
       this.depth -= value;
    }
    
    protected down(value: number) {
        this.depth += value;
    }
    
    public get position(): number {
        return this.horiz * this.depth;
    }

    public printPosition()
    {
        console.log(this.position);
    }
}

class ComplexSub extends SimpleSub
{
    private aim: number = 0;
    
    protected forward(value: number) 
    {
        this.horiz += value;
        this.depth += this.aim * value;
    }
    
    protected up(value: number) {
       this.aim -= value;
    }
    
    protected down(value: number) {
        this.aim += value;
    }
}

interface ICommand
{
    Direction: "up" | "down" | "forward";
    Magnitude: number;
}

new SimpleSub().move(input).printPosition();
new ComplexSub().move(input).printPosition();
