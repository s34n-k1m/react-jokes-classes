import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";
import useLocalStorage from './useLocalStorage';

/** List of jokes.
 * 
 * Props:
 * - numJokesToGet: Number of jokes to display, default 5
 * 
 * State:
 * - jokes: array of joke objects [{id, text, votes}, ...]
 * - isLoading: T/F
 * 
 * App -> JokeList -> Joke
 */
function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useLocalStorage("jokes", []);
  const [isLoading, setIsLoading] = useState(true);
  const [lockedJokeIds, setLockedJokeIds] = useLocalStorage(
    "lockedJokeIds",
    []
  );

  console.log("jokes= ", jokes);
  console.log("isLoading= ", isLoading);
  console.log("lockedJokeIds= ", lockedJokeIds);

  useEffect(
    function getJokes() {
      async function getJokesWithApi() {
        try {
          // load jokes one at a time, adding not-yet-seen jokes
          // const locked = new Set([lockedJokeIds]);
          let newJokes = jokes.filter((j) => lockedJokeIds.includes(j.id));
          let seenJokes = new Set([...newJokes]);

          while (newJokes.length < numJokesToGet) {
            let res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" },
            });
            let { ...joke } = res.data;

            if (!seenJokes.has(joke.id)) {
              seenJokes.add(joke.id);
              newJokes.push({ ...joke, votes: 0 });
            } else {
              console.log("duplicate found!");
            }
          }

          setJokes(newJokes);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
        }
      }

      // && JSON.stringify(jokes) === "[]"
      if (isLoading) {
        getJokesWithApi();
      } else {
        setIsLoading(false);
      }
    },
    [isLoading, numJokesToGet, setJokes, jokes, lockedJokeIds]
  );

  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setJokes(jokes => (jokes.filter(j => lockedJokeIds.includes(j.id))));
    setIsLoading(true);
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    setJokes((jokes) =>
      jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  /** reset vote counts for all jokes to 0 */

  function resetVotes() {
    setJokes((jokes) => jokes.map((j) => ({ ...j, votes: 0 })));
  }

  /** Locks the joke selected by adding it to list of lockedJokeIds */
  function lockJoke(id) {
    setLockedJokeIds((jokeIds) => ([...jokeIds, id]));
  }

  /** Unlocks the joke selected by removing it from list of lockedJokeIds */
  function unlockJoke(id) {
    setLockedJokeIds((jokeIds) => (jokeIds.filter(jokeId => jokeId !== id)));
  }

  /* render: either loading spinner or list of sorted jokes. */
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      <button className="JokeList-reset" onClick={resetVotes}>
        Reset Votes
      </button>

      {sortedJokes.map((j) => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
          isLocked={lockedJokeIds.includes(j.id)}
          lock={lockJoke}
          unlock={unlockJoke}
        />
      ))}
    </div>
  );
}


export default JokeList;
