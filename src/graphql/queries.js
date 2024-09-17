/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getKamoku = /* GraphQL */ `
  query GetKamoku($id: ID!) {
    getKamoku(id: $id) {
      id
      name
      number
      A
      B
      C
      D
      E
      F
      average
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listKamokus = /* GraphQL */ `
  query ListKamokus(
    $filter: ModelKamokuFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listKamokus(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        number
        A
        B
        C
        D
        E
        F
        average
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
