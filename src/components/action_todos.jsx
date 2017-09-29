import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';

class ActionTodos extends Component {
  static propTypes = {
    clearCompleted: PropTypes.func.isRequired,
    toggleAll: PropTypes.func.isRequired,
  }

  handleAction = (e) => {
    if (e === 'CLEAR_ALL') {
      this.props.clearCompleted();
    } else if (e === 'MARK_ALL_DONE') {
      this.props.toggleAll(true);
    } else if (e === 'MARK_ALL_UNDONE') {
      this.props.toggleAll(false);
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

const ClearAllMutation = gql`
  mutation clearCompleted {
    clearCompleted {
      id
    }
  }
`;

const ToggleAllTodoMutation = gql`
  mutation toggleAll($checked: Boolean!) {
    toggleAll(checked: $checked) {
      id
      title
      completed
    }
  }
`;

const withClearCompleted = graphql(ClearAllMutation, {
  props: ({ mutate }) => ({
    clearCompleted: () => {
      mutate({
        variables: {},
      });
    },
  }),
});

const withToggleAllTodo = graphql(ToggleAllTodoMutation, {
  props: ({ mutate }) => ({
    toggleAll: (evt) => {
      mutate({
        variables: { checked: evt },
      });
    },
  }),
});


export default withClearCompleted(withToggleAllTodo(ActionTodos));
