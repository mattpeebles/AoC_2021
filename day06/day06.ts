import fs from 'fs';

class School {
    private school: Map<number, number>;

    constructor(ages: number[]) 
    {
        this.school = this.getSchool();
        
        for (let age of ages) 
        {
            this.school.set(age, this.getAge(age) + 1);
        }
    }

    private getAge(age: number): number
    {
        return this.school?.get(age) ?? 0;
    }

    public Simulate(days: number): School {
        for (let i = 0; i < days; i++) 
        {
            this.age();
        }

        return this;
    }

    private getSchool(): Map<number, number> {
        let newSchool: Map<number, number> = new Map();

        for (let i = 0; i < 9; i++) {
            newSchool.set(i, 0);
        }

        return newSchool;
    }

    private age() {
        let newSchool: Map<number, number> = this.getSchool();

        for (let i = 0; i < 9; i++) {
            let oldSchoolAge = this.getAge(i);
            let newAge = i - 1;
            
            if (newAge < 0) {
                newSchool.set(8, oldSchoolAge);
                newSchool.set(6, oldSchoolAge);
            }
            else {
                newSchool.set(newAge, (newSchool?.get(newAge) ?? 0) + oldSchoolAge)
            }
        }

        this.school = newSchool;
    }

    public get Size() {
        let size = 0;
        for (let i = 0; i < 9; i++) {
            size += this.getAge(i);
        }

        return size;
    }
}

let input: number[] = fs.readFileSync('input.txt').toString().split(',').map(age => parseInt(age));
console.log(new School(input).Simulate(80).Size)
console.log(new School(input).Simulate(256).Size)