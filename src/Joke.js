import React from "react";
import "./Joke.css";

/** A single joke, along with vote up/down buttons.
 * 
 * Props:
 * - id: Number
 * - vote: function passed from JokeList
 * - votes: number of votes for the joke
 * - text: String
 * 
 * State: none
 * 
 * JokeList -> Joke
 */
function Joke({ id, vote, votes, text, isLocked, lock ,unlock }) {

  /** Helper to display lock or unlock button */  
  function displayLockButton() {
    if (isLocked) {
      return (
        <button onClick={(evt) => unlock(id)}>
          <i className="fas fa-lock"></i>
        </button>
      );
    } else {
      return (
        <button onClick={(evt) => lock(id)}>
          <i className="fas fa-lock-open"></i>
        </button>
      );
    }
  }

  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={(evt) => vote(id, +1)}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={(evt) => vote(id, -1)}>
          <i className="fas fa-thumbs-down" />
        </button>

        {displayLockButton()}

        {votes}
      </div>

      <div className="Joke-text">{text}</div>
    </div>
  );
}


export default Joke;
