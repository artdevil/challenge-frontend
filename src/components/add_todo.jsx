import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'react-md/lib/TextFields';
import { gql, graphql } from 'react-apollo';

import { TodosListQuery } from './todos';

const AddTodo = ({ mutate }) => {
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      mutate({
        variables: { title: e.target.value },
        optimisticResponse: {
          add: {
            title: e.target.value,
            id: Math.round(Math.random() * -1000000),
            completed: false,
            __typename: 'Todo',
          },
        },
        update: (store, { data: { add } }) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({ query: TodosListQuery });
          // Add our channel from the mutation to the end.
          data.todos.push(add);
          // Write the data back to the cache.
          store.writeQuery({ query: TodosListQuery, data });
        },
      });
      e.target.value = '';
    }
  };

  return (
    <TextField className="md-cell md-cell--12" placeholder="New Title" onKeyUp={handleKeyUp} id="addtodo" />
  );
};

const addTodoMutation = gql`
  mutation add($title: String!) {
    add(title: $title) {
      id
      title
      completed
    }
  }
`;

AddTodo.propTypes = {
  mutate: PropTypes.func.isRequired,
};

export default graphql(addTodoMutation)(AddTodo);
