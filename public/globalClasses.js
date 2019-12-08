class Reactive{
    constructor(Question, Answers, URL, correct){
        this.Question = Question;  
        this.Answers = [];
        for(let i=0; i<Answers.length; i++){
            if(Answers[i]!=undefined) this.Answers.push(Answers[i]);
        }
        this.URL = URL;
        this.correct = [];
        for(let i=0; i<this.Answers.length; i++){
            this.correct.push(false);
        }
        this.time = 20;
        this.imgHidden = false;
        // 0 = Inactive     
    }
}
class Player{
    constructor(n, i){
        this.name = n;
        this.id = i;
    }
}

class Game{
    constructor(name, date, desc){
        this.Reactives = [];
        this.Name = name;
        this.Date = date; 
        this.Description = desc;
        this.status = 0;        
        //this.items = I;
    }
}

