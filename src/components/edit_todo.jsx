import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import DialogContainer from 'react-md/lib/Dialogs';
import TextField from 'react-md/lib/TextFields';

class SimpleModal extends Component {
  static propTypes = {
    showModal: PropTypes.bool.isRequired,
    showModalObj: PropTypes.object.isRequired,
    hideModal: PropTypes.func.isRequired,
    editTodo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalObj: {},
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.state.visible !== nextProps.showModal) {
      this.setState({
        visible: nextProps.showModal,
        modalObj: nextProps.showModalObj,
      });
    }
  }

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
    this.props.hideModal();
  };

  submitTodo = () => {
    this.props.editTodo(this.state.modalObj, this.editTextField.value);
    this.hide();
  }

  render() {
    const { visible, modalObj } = this.state;

    const actions = [];
    actions.push({ secondary: true, children: 'Cancel', onClick: this.hide });
    actions.push(<Button flat primary onClick={this.submitTodo}>Confirm</Button>);

    return (
      <DialogContainer
        id="simple-action-dialog"
        visible={visible}
        onHide={this.hide}
        actions={actions}
        title="Edit Todo"
      >
        <TextField
          id="simple-action-dialog-field"
          label="Some content to change"
          placeholder="Content..."
          defaultValue={modalObj ? modalObj.title : ''}
          ref={(input) => { this.editTextField = input; }}
        />
      </DialogContainer>
    );
  }
}

const EditTodoMutation = gql`
  mutation save($id: String!, $title: String!) {
    save(id: $id, title: $title) {
      id
      title
      completed
    }
  }
`;

const editTodo = graphql(EditTodoMutation, {
  props: ({ mutate }) => ({
    editTodo: (obj, text) => {
      mutate({
        variables: { id: obj.id, title: text },
        optimisticResponse: {
          save: {
            title: text,
            id: obj.id,
            completed: obj.completed,
            __typename: 'Todo',
          },
        },
      });
    },
  }),
});

export default editTodo(SimpleModal);
