import fs from 'fs';
const fileName = "input.txt";

class BingoPlayer {
    noWinningBoards: Set<BingoBoard>;
    winningBoards: BingoBoard[];

    constructor(boards: number[][][]) {
        this.noWinningBoards = new Set(boards.map(board => new BingoBoard(board)));
        this.winningBoards = [];
    }

    public PlayGame(nums: number[]) {
        for (let num of nums)
        {
            player.markNumber(num);
        }

        return;
    }

    public markNumber(num: number) {
        for (let board of this.noWinningBoards.values()) {
            const wasMarked = board.markNumber(num);

            if (wasMarked && board.IsWinningBoard) {
                this.noWinningBoards.delete(board);
                this.winningBoards.push(board);
            }
        }
    }
}

class BingoBoard {
    private groupings: Grouping[];
    public IsWinningBoard: boolean;
    public Score: number = 0;

    private unmarkedSum: number;

    constructor(board: number[][]) {
        this.IsWinningBoard = false;
        this.unmarkedSum = board.reduce((total, row) => total + row.reduce((rowTotal, item) => rowTotal + item, 0), 0);
        this.groupings = [];

        for (let i = 0; i < board.length; i++) {
            this.groupings.push(new Grouping(board[i]));

            const column: number[] = [];
            for (let j = 0; j < board.length; j++) {
                column.push(board[j][i])
            }

            this.groupings.push(new Grouping(column));
        }
    }

    public markNumber(num: number): boolean {
        let marked = false;

        for (let group of this.groupings) {
            const wasMarked = group.mark(num);
            marked = marked || wasMarked;

            if (wasMarked) {
                
                if(!this.IsWinningBoard && group.IsComplete)
                {
                    this.IsWinningBoard = group.IsComplete;
                }
            }
        }

        if(marked)
        {
            this.unmarkedSum -= num;
        }

        if(this.IsWinningBoard)
        {
            this.Score = this.unmarkedSum * num;
        }

        return marked;
    }
}

class Grouping {
    private open: Set<number>;
    private claimed: Set<number>;


    constructor(group: number[]) {
        this.open = new Set<number>(group);
        this.claimed = new Set<number>();
    }

    mark(num: number): boolean {
        if (this.open.has(num)) {
            this.open.delete(num);
            this.claimed.add(num);
            return true;
        }

        return false;
    }

    get IsComplete(): boolean {
        return this.open.size < 1;
    }
}

let input: string[] = fs.readFileSync(fileName).toString().split('\n\n');
const chosenNumbers: number[] = input[0].split(',').map(x => parseInt(x));
const boards: number[][][] = input.slice(1).map(boardString => boardString.split('\n').map(group => group.trim().split(/\s+/).map(x => parseInt(x))));
const player: BingoPlayer = new BingoPlayer(boards);

player.PlayGame(chosenNumbers);
console.log(player.winningBoards[0].Score);
console.log(player.winningBoards[player.winningBoards.length - 1].Score)