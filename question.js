class Question {
    constructor(question,answer){
        this.question = question;
        this.answer = answer.trim();
    }
    guessAnswer(guess) {
        return this.answer.toLowerCase() === guess.trim().toLowerCase();
    }
}
module.exports = Question;