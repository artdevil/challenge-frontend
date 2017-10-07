import React from 'react';
import { shallow } from 'enzyme';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';

import App from './App';
import ActionTodos from './components/action_todos';
import AddToDo from './components/add_todo';
import Todos from './components/todos';

it('shallow renders without crashing', () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});

it('renders one <NavigationDrawer /> components', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find(NavigationDrawer).length).toBe(1);
});

it('renders one <ActionTodos /> components', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find(ActionTodos).length).toBe(1);
});

it('renders one <Todos /> components', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find(Todos).length).toBe(1);
});

it('renders one <AddToDo /> components', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find(AddToDo).length).toBe(1);
});
