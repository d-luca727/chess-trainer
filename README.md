# Opening Trainer

Opening Trainer is a Chess practice tool to study positions in a more interactive fashion. It is designed to help the user increase their understanding of a position by using Spaced Repetition which has been proven to be one of the best learning methods for enhancing long-term memory capabilities.

## Installation

1. `git clone https://github.com/Proioxis4/opening-trainer.git`
2. add a .env file and replace those values down below

```
DB_URI=<<your mongoDB URI>>
NS=<<your mongoDB server name>>
PORT=<<local port you want to connect to>>
NODE_ENV=<<development>>
```
3. `npm install` and `npm run start` to run the server
4. `cd client` , `npm install`  and `npm start` to run the frontend

## Chess Dependencies

- [Chessground](https://github.com/lichess-org/chessground), a free/libre open source chess UI developed for lichess.org. I used [this React Wrapper](https://github.com/react-chess/chessground).
- [Chess.js](https://github.com/jhlywa/chess.js) for move validation/generation.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



