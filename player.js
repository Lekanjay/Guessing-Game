class Player{
    constructor(id,name,isGameMaster=false) {
        this.id = id || Math.floor(Math.random() * 1000);
        this.name = name;
        this.isGameMaster = isGameMaster;
    }
    guessAnswer(question,guess) {
        return question.answer === guess;
    }
    setGameMaster(bool) {
        this.isGameMaster = bool;
    }
}
module.exports = Player;