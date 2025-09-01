import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const initialState = [];

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
    updateAnecdote(state, action) {
      const updated = action.payload;
      return state.map((anecdote) =>
        anecdote.id !== updated.id ? anecdote : updated
      );
    },
  },
});

export const { appendAnecdote, setAnecdotes, updateAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content, votes) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content, votes);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const increaseVote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };
    const saved = await anecdoteService.voteOn(anecdote.id, updatedAnecdote);
    dispatch(updateAnecdote(saved));
  };
};

export default anecdoteSlice.reducer;
