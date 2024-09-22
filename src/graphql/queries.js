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
export const getSubject = /* GraphQL */ `
  query GetSubject($id: ID!) {
    getSubject(id: $id) {
      id
      id1
      id2
      year
      semester
      name
      number
      A
      B
      C
      D
      F
      other
      average
      teacher
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listSubjects = /* GraphQL */ `
  query ListSubjects(
    $filter: ModelSubjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        id1
        id2
        year
        semester
        name
        number
        A
        B
        C
        D
        F
        other
        average
        teacher
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSubjectById1AndYear = /* GraphQL */ `
  query GetSubjectById1AndYear(
    $id1: String!
    $year: ModelFloatKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSubjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSubjectById1AndYear(
      id1: $id1
      year: $year
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        id1
        id2
        year
        semester
        name
        number
        A
        B
        C
        D
        F
        other
        average
        teacher
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSubjectByTeacherAndId1 = /* GraphQL */ `
  query GetSubjectByTeacherAndId1(
    $teacher: String!
    $id1: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSubjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSubjectByTeacherAndId1(
      teacher: $teacher
      id1: $id1
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        id1
        id2
        year
        semester
        name
        number
        A
        B
        C
        D
        F
        other
        average
        teacher
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
