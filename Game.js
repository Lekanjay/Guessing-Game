const Palyer=require("./Player.js");
const Question=require("./Question.js");

Game_STATE={
    in_session:"IN_SESSION",
    ended:"ENDED"
}

class GameSession{
    constructor(io){
        this.players=[];
        this.question=null;
        this.state=Game_STATE.in_session;
        this.gameMaster=null;
        this.socket=io;
        this.playerIndex={};
    }
    
}