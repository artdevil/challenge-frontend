import { gql } from 'react-apollo';

const mutations = {
  ToggleTodoMutation: gql`
    mutation toggle($id: String!) {
      toggle(id: $id) {
        id
        title
        completed
      }
    }
  `,
  addTodoMutation: gql`
    mutation add($title: String!) {
      add(title: $title) {
        id
        title
        completed
      }
    }
  `,
  DestroyTodoMutation: gql`
    mutation destroy($id: String!) {
      destroy(id: $id) {
        id
      }
    }
  `,
  EditTodoMutation: gql`
    mutation save($id: String!, $title: String!) {
      save(id: $id, title: $title) {
        id
        title
        completed
      }
    }
  `,
  ClearAllMutation: gql`
    mutation clearCompleted {
      clearCompleted {
        id
        title
        completed
      }
    }
  `,
  ToggleAllTodoMutation: gql`
    mutation toggleAll($checked: Boolean!) {
      toggleAll(checked: $checked) {
        id
        title
        completed
      }
    }
  `,
};

export default mutations;
