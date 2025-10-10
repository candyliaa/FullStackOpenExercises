import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries/queries'
import { ME } from '../queries/queries'

const Recommend = (props) => {
  if (!props.show) {
    return null
  }

  const user = useQuery(ME)
  
  const result = useQuery(ALL_BOOKS)

  if (user.loading || result.loading) {
    return <div>loading...</div>
  }

  if (user.error || result.error) {
    return <div>{result.error.message}</div>
  }

  const favoriteGenre = user.data.me.favoriteGenre

  const books = result.data.allBooks

  const filteredBooks = favoriteGenre ? books.filter(b => b.genres.includes(favoriteGenre)) : books

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre {favoriteGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
