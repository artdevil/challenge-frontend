import React, { Component } from 'react';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import AddToDo from './components/add_todo';
import Todos from './components/todos';
import ActionTodos from './components/action_todos';

import './App.css';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080',
});

const client = new ApolloClient({
  networkInterface,
  connectToDevTools: true,
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <NavigationDrawer toolbarTitle="KeetHealth Test" includeDrawerHeader={false} defaultVisible={false}>
          <div className="md-grid">
            <ActionTodos client={client} />
            <AddToDo />
            <Todos />
          </div>
        </NavigationDrawer>
      </ApolloProvider>
    );
  }
}

export default App;
