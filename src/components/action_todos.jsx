import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import _ from 'lodash';
import queries from '../queries/todos';
import mutations from '../mutations/todos';

class ActionTodos extends Component {
  static propTypes = {
    clearCompleted: PropTypes.func.isRequired,
    toggleAll: PropTypes.func.isRequired,
  }

  handleAction = (e) => {
    const { todos } = this.props.client.readQuery({ query: queries.TodosListQuery });
    if (e === 'CLEAR_ALL') {
      this.props.clearCompleted(todos);
    } else if (e === 'MARK_ALL_DONE') {
      this.props.toggleAll(true, todos);
    } else if (e === 'MARK_ALL_UNDONE') {
      this.props.toggleAll(false, todos);
    }
  }

  render() {
    return (
      <div className="md-cell md-cell--12" style={{ textAlign: 'right' }}>
        <MenuButton
          id="menu-button-1"
          flat
          primary
          menuItems={[
            <ListItem key={1} primaryText="Clear Completed" onClick={() => this.handleAction('CLEAR_ALL')} />,
            <ListItem key={2} primaryText="Mark all as Done" onClick={() => this.handleAction('MARK_ALL_DONE')} />,
            <ListItem key={3} primaryText="Mark all as Undone" onClick={() => this.handleAction('MARK_ALL_UNDONE')} />,
          ]}
          iconChildren="build"
          position={MenuButton.Positions.TOP_RIGHT}
        >
          Action
        </MenuButton>
      </div>
    );
  }
}

const withClearCompleted = graphql(mutations.ClearAllMutation, {
  props: ({ mutate }) => ({
    clearCompleted: (todos) => {
      mutate({
        variables: {},
        optimisticResponse: {
          clearCompleted: todos,
        },
        update: (store) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({ query: queries.TodosListQuery });
          // Add our channel from the mutation to the end.
          const dataPickBy = _.filter(data.todos, todo => todo.completed === false);
          // Write the data back to the cache.
          store.writeQuery({ query: queries.TodosListQuery, data: { todos: dataPickBy } });
        },
      });
    },
  }),
});

const withToggleAllTodo = graphql(mutations.ToggleAllTodoMutation, {
  props: ({ mutate }) => ({
    toggleAll: (evt, todos) => {
      mutate({
        variables: { checked: evt },
        optimisticResponse: {
          toggleAll: todos,
        },
        update: (store) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({ query: queries.TodosListQuery });
          // Add our channel from the mutation to the end.
          data.todos.map((todo) => {
            return _.assign(todo, { completed: evt });
          });
          // Write the data back to the cache.
          store.writeQuery({ query: queries.TodosListQuery, data });
        },
      });
    },
  }),
});


export default compose(withClearCompleted, withToggleAllTodo)(ActionTodos);
