import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { Card } from 'react-md/lib/Cards';
import { List, ListItemControl } from 'react-md/lib/Lists';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import FontIcon from 'react-md/lib/FontIcons';
import _ from 'lodash';
import Modal from './edit_todo';
import queries from '../queries/todos';
import mutations from '../mutations/todos';

class Todos extends Component {
  static propTypes = {
    fetchData: PropTypes.object.isRequired,
    toggleTodo: PropTypes.func.isRequired,
    destroyTodo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showModalObj: {},
    };
  }

  triggerShowModal = (obj) => {
    this.setState({
      showModal: true,
      showModalObj: obj,
    });
  }

  triggerHideModal = () => {
    this.setState({
      showModal: false,
    });
  }

  render() {
    if (this.props.fetchData.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.fetchData.error) {
      return <p>{this.props.fetchData.error.message}</p>;
    }

    return (
      <Card className="md-cell md-cell--12">
        <Modal showModal={this.state.showModal} hideModal={this.triggerHideModal} showModalObj={this.state.showModalObj} />
        <List>
          {
            this.props.fetchData.todos.map(todo => (
              <ListItemControl
                key={todo.id}
                primaryAction={
                  <Checkbox
                    id={`list-control-secondary-${todo.id}`}
                    name={`list-control-secondary-${todo.id}`}
                    label={todo.title}
                    checked={todo.completed}
                    onChange={() => { this.props.toggleTodo(todo); }}
                  />
                }
                rightIcon={
                  <span>
                    <FontIcon style={{ cursor: 'pointer' }} onClick={() => { this.triggerShowModal(todo); }}>edit</FontIcon>
                    <FontIcon style={{ cursor: 'pointer' }} onClick={() => { this.props.destroyTodo(todo); }}>delete</FontIcon>
                  </span>
                }
              />
            ))
          }
        </List>
      </Card>
    );
  }
}

const withTodos = graphql(queries.TodosListQuery, {
  options: { pollInterval: 5000 },
  props: ({ data }) => ({
    fetchData: data || {},
  }),
});

const withToggleTodo = graphql(mutations.ToggleTodoMutation, {
  props: ({ mutate }) => ({
    toggleTodo: (evt) => {
      mutate({
        variables: { id: evt.id },
        optimisticResponse: {
          toggle: {
            title: evt.title,
            id: evt.id,
            completed: !evt.completed,
            __typename: 'Todo',
          },
        },
        update: (store, { data: { toggle } }) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({ query: queries.TodosListQuery });
          // Add our channel from the mutation to the end.
          const index = _.findIndex(data.todos, { id: toggle.id });
          const dataSelect = data.todos[index];
          dataSelect.title = toggle.title;
          dataSelect.completed = toggle.completed;
          data.todos.splice(index, 1, dataSelect);
          // Write the data back to the cache.
          store.writeQuery({ query: queries.TodosListQuery, data });
        },
      });
    },
  }),
});

const withDestroyTodo = graphql(mutations.DestroyTodoMutation, {
  props: ({ mutate }) => ({
    destroyTodo: (evt) => {
      mutate({
        variables: { id: evt.id },
        optimisticResponse: {
          destroy: {
            id: evt.id,
            __typename: 'Todo',
          },
        },
        update: (store, { data: { destroy } }) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({ query: queries.TodosListQuery });
          // Add our channel from the mutation to the end.
          const index = _.findIndex(data.todos, { id: destroy.id });
          data.todos.splice(index, 1);
          // Write the data back to the cache.
          store.writeQuery({ query: queries.TodosListQuery, data });
        },
      });
    },
  }),
});

export default compose(withTodos, withToggleTodo, withDestroyTodo)(Todos);
