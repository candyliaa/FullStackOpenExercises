import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries/queries'
import { useState } from 'react'

const Books = (props) => {
  if (!props.show) {
    return null
  }

  const [selectedGenre, setSelectedGenre] = useState('')

  const result = useQuery(ALL_BOOKS)

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>{result.error.message}</div>
  }

  const books = result.data.allBooks
  
  const allGenres = Array.from(new Set(books.flatMap(book => book.genres)))

  const filteredBooks = selectedGenre ? books.filter(b => b.genres.includes(selectedGenre)) : books

  return (
    <div>
      <h2>books</h2>

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
      <div>
          <button
            onClick={() => setSelectedGenre('')}
            >All Genres</button>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            >{genre}</button>
        ))}
      </div>
    </div>
  )
}

export default Books
