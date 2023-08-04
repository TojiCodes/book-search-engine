const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Book {
    bookId: ID
    authors: [String]
    description: String
    image: String
    link: String
    title: String
}

type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
}

type AuthPayload {
    token: String
    user: User
}

input BookInput {
    bookId: ID
    authors: [String]
    description: String
    image: String
    link: String
    title: String
}

type Query {
    getSingleUser(username: String, id: ID): User
    login(email: String!, password: String!): AuthPayload
}

type Mutation {
    createUser(username: String!, email: String!, password: String!): AuthPayload
    saveBook(bookData: BookInput!): User
    deleteBook(bookId: ID!): User
}
`;

module.exports = typeDefs;
