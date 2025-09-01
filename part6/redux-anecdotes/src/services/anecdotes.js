import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content, votes) => {
  const object = { content, votes };
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const voteOn = async (id, updatedAnecdote) => {
  const response = await axios.put(
    `${baseUrl}/${id.toString()}`,
    updatedAnecdote
  );
  return response.data;
};

export default { getAll, createNew, voteOn };
