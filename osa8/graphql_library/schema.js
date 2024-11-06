const typeDefs = `
  type Query {
    bookCount: Int!
    allBooks (author: String, genre: String): [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
    allGenres: [String!]!
    me: User
  }

  type Subscription {
    bookAdded: Book!
  }    

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

module.exports = typeDefs
