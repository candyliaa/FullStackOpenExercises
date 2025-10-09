import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { randomUUID } from 'crypto'
import mongoose from 'mongoose'
import 'dotenv/config'

import Book from './src/models/Book.js'
import Author from './src/models/Author.js'
import { GraphQLError } from 'graphql'

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

try {
  mongoose.connect(MONGODB_URI)
  console.log('connected to MongoDB');
} catch (error) {
  console.log('error:', error)
  process.exit(1)
}


let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book

    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({});
      return books.length;
    },
    authorCount: async () => {
      const authors = await Author.find({});
      return authors.length;
    },
    allBooks: (root, args) => { 
        if (!args.author && !args.genre) {
            return Book.find({});
        }
        else if (!args.genre) {
            return Book.find({ author: args.author });
        }
        else {
            return Book.find({ genre: args.genre });
        }
    },

    allAuthors: async () => {
        const authors = await Author.find({});
        const books = await Book.find({});

        return authors.map(author => ({
          name: author.name,
          born: author.born,
          id: author._id,
          bookCount: books.filter(book => book.author.toString() === author._id.toString()).length
        }))
    },
  },
  Mutation: {
    addBook: async (root, args) => {
        let author = await Author.findOne({ name: args.author })

        if (!author) {
          author = new Author({ name: args.author })
          try {
            await author.save()
          } catch (error) {
            throw new GraphQLError('creating author failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error,
              },
            })
          }
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id
        })

        try {
          await book.save()
          return {
            title: book.title,
            published: book.published,
            genres: book.genres,
            id: book._id,
            author: {
              _id: author._id,
              name: author.name,
              born: author.born,
            }
          }
        } catch(error) {
            throw new GraphQLError('creating author failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.title,
                error,
              },
            })
        }
      },
    
    editAuthor: (root, args) => {
        const author = authors.find(a => a.name === args.name)
        if (!author) {
            return null
        }

        const updatedAuthor = { ...author, born: args.setBornTo}
        authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
        return updatedAuthor
      }
    },
    Author: {
      bookCount: async (root) => {
        const count = await Book.countDocuments({ author: root._id });
        return count;
      }
    }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
