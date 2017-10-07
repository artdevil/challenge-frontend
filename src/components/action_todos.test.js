import React from 'react';
import { shallow } from 'enzyme';
import MenuButton from 'react-md/lib/Menus/MenuButton';

import ActionTodos from './action_todos';


it('shallow action_todos renders without crashing', () => {
  const wrapper = shallow(<ActionTodos />);
  expect(wrapper).toMatchSnapshot();
});

it('renders one <MenuButton /> components', () => {
  const wrapper = shallow(<ActionTodos />);
  expect(wrapper.find(MenuButton).length).toBe(1);
});
