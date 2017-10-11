import React from 'react';
import { shallow } from 'enzyme';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import { mockNetworkInterface } from 'react-apollo/test-utils';
import queries from '../queries/todos';

import Todos from './todos';

it('shallow todos renders without crashing', () => {
  const data = { todos: { id: 1, label: 'hello world', completed: true } };

  const networkInterface = mockNetworkInterface(
    { request: { query: queries.TodosListQuery }, result: { data } },
  );

  const client = new ApolloClient({ networkInterface, addTypename: false });

  const wrapper = shallow(
    <ApolloProvider client={client}>
      <Todos />
    </ApolloProvider>);

  expect(wrapper).toMatchSnapshot();
});
