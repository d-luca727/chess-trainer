# Opening Trainer

Opening Trainer is a website used to interactively study chess positions. It is designed to help the user increase their understanding of a position by using Spaced Repetition which has been proven to be one of the best learning methods for enhancing long-term memory capabilities.

## Project Idea

The project is still in a very early stage of development, the idea is to apply the concepts behind the game of [Flashcards](https://en.wikipedia.org/wiki/Flashcard) to develop a better and more solid understanding of a given position. 

At the current state Opening Trainer offers only an easy-to-use UI to manage and study chess positions, soon I will develop more game mechanics that will further improve the user learning and playing experience.

### The features I'm planning to add are:

- Unique difficulty system based on how well you've learned a given position
- Built in analysis board
- Dynamically generated study collection using the user's chess game, lichess study or games' history
- Multiplayer gamemode that will let you challenge a friend on a given study
- More gamemodes.

## How to run it

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

## Dependencies

### Chess UI and Logic
- [Chessground](https://github.com/lichess-org/chessground), a free/libre open source chess UI developed for lichess.org. I used this [React Wrapper for Chessground](https://github.com/react-chess/chessground).
- [Chess.js](https://github.com/jhlywa/chess.js) for move validation/generation.

### Frontend and UI Design
- React typescript
- Ant Design

### Backend
- express.js
- mongoose

I'm also plannig to replace express.js with Rust + Actix soon.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



