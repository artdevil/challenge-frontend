import { gql } from 'react-apollo';

const queries = {
  TodosListQuery: gql`
    query TodosListQuery {
      todos {
        id
        title
        completed
      }
    }
  `,
};

export default queries;
