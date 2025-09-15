import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useReducer } from "react"

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload
    case "CLEAR":
      return ""
    default:
      return state
  }
}

const App = () => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, "")

  const showNotification = (message) => {
    notificationDispatch({ type: "SET", payload: message })

    setTimeout(() => {
      notificationDispatch({ type: "CLEAR" })
    }, 5000)
  }

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] })
      showNotification(`new anecdote "${newAnecdote.content}" created`)
    },
    onError: (error) => {
      showNotification(error.response.data.error)
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] })
      showNotification(`you voted for ${updatedAnecdote.content}`)
    },
  })
  const increaseVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: false
  })

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ""
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification notification={notification} />
      <AnecdoteForm onCreate={addAnecdote} />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => increaseVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
