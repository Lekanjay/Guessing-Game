const Palyer = require("./Player.js");
const Question = require("./Question.js");

Game_STATE = {
  in_session: "IN_SESSION",
  ended: "ENDED",
};

class GameEvent {
  constructor(data, eventName, message) {
    this.data = data;
    this.eventName = eventName;
    this.message = message;
  }
}
class GameSession {
  constructor(io) {
    this.players = [];
    this.question = null;
    this.state = Game_STATE.in_session;
    this.events = [];
    this.gameMaster = null;
    this.socket = io;
    this.playerIndex = {};
  }
  createGameEvent({ message, data, eventName }) {
    const event = new GameEvent({ message, data, eventName });
    this.events.push(event);
    return event;
  }
  emitEvemt(event) {
    this.socket.emit(event.eventName, event);
  }
  emitGameEvent({ message, data, eventName }) {
    const event = this.createGameEvent({ message, data, eventName });
    this.emitEvemt = event;
  }

  addQuestion(event) {
    if (this.state == Game_STATE.started) return;
    const question = new Question({
      question: event.question,
      answer: event.answer,
    });
    this.questions = question;

    this.emitGameEvent({
      message: `QUESTION: ${this.question.question}`,
      eventName: "question_created",
    });
    this.state = Game_STATE.started;
  }

  guessAnswer(event) {
    if (this.state == Game_STATE.ended) return;
    const player = this.players[this.playerIndex[event.playerId]];
    const isanswer = this.question.guessAnswer(event.answer);
    if (!isanswer) {
      this.emitGameEvent({
        message: `GUESS: ${player.name} guessed ${event.answer}`,
        eventName: "guess",
        isAnswer,
      });
    } else {
      this.emitGameEvent({
        message: `ANSWER: The answer is ${event.answer}. 10 points awarded to ${player.name}`,
        eventName: "guess",
        isAnswer,
      });
      this.state = Game_STATE.ended;
    }
  }
  assignGameMaster(retry=false){
    this.gameMaster=null;
    const randomIndex=Math.floor(Math.random() * this.players.length);
    let newGameMaster=this.players[randomIndex];
    if(!newGameMaster){
      this.assigbnGameMaster(retry)
    }
    newGameMaster.setGameMaster(true);
     this.emitGameEvent({
            message: `NEW GAME MASTER: New game master is ${this.gameMaster.name}`,
            eventName: 'new_game_master',
            data: this.players,
        })
  }
  joinGame(event) {
    if (this.state ===  Game_STATE.in_session) {
      this.emitGameEvent({
        message: `Game is in progress, try again in  seconds`, //${this.timer.secondsLeft()}
        eventName: "join_error",
      });
    }

    // if (!event.data.name || !event.data.name.trim().length) {
    //   this.emitGameEvent({
    //     message: `Must provide a name`,
    //     eventName: "join_error",
    //   });
    //}
    if (this.state === Game_STATE.ended) {
      const player = new Player({ name: event.data.name, id: socket.id });
      this.playerIndex[socket.id] = player;

      if (!this.gameMaster) {
        player.setGameMaster(true);
        this.gameMaster = player;
      }

      this.players.push(player);
      this.emitGameEvent({
        message: `${player.name} just joined`,
        data: {
          player,
          gameMaster: this.gameMaster,
        },
        eventName: "player_joined",
      });
    }
  }
  exit() {
  this.players = this.players.filter((pl) => pl.id !== socket.id)  }
}
module.exports = GameSession;
