import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { Card } from 'react-md/lib/Cards';
import { List, ListItemControl } from 'react-md/lib/Lists';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import FontIcon from 'react-md/lib/FontIcons';
import _ from 'lodash';
import Modal from './edit_todo';

class Todos extends Component {
  static propTypes = {
    fetchData: PropTypes.object.isRequired,
    toggleTodo: PropTypes.func.isRequired,
    triggerShowModal: PropTypes.func.isRequired,
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

export const TodosListQuery = gql`
  query TodosListQuery {
    todos {
      id
      title
      completed
    }
  }
`;

const ToggleTodoMutation = gql`
  mutation toggle($id: String!) {
    toggle(id: $id) {
      id
      title
      completed
    }
  }
`;

const DestroyTodoMutation = gql`
  mutation destroy($id: String!) {
    destroy(id: $id) {
      id
    }
  }
`;

const withTodos = graphql(TodosListQuery, {
  options: { pollInterval: 5000 },
  props: ({ data }) => ({
    fetchData: data || {},
  }),
});

const withToggleTodo = graphql(ToggleTodoMutation, {
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
          const data = store.readQuery({ query: TodosListQuery });
          // Add our channel from the mutation to the end.
          const index = _.findIndex(data.todos, { id: toggle.id });
          const dataSelect = data.todos[index];
          dataSelect.title = toggle.title;
          dataSelect.completed = toggle.completed;
          data.todos.splice(index, 1, dataSelect);
          // Write the data back to the cache.
          store.writeQuery({ query: TodosListQuery, data });
        },
      });
    },
  }),
});

const withDestroyTodo = graphql(DestroyTodoMutation, {
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
          const data = store.readQuery({ query: TodosListQuery });
          // Add our channel from the mutation to the end.
          const index = _.findIndex(data.todos, { id: destroy.id });
          data.todos.splice(index, 1);
          // Write the data back to the cache.
          store.writeQuery({ query: TodosListQuery, data });
        },
      });
    },
  }),
});


export default withTodos(withToggleTodo(withDestroyTodo(Todos)));
