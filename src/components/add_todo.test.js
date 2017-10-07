import React from 'react';
import { shallow } from 'enzyme';

import AddTodo from './add_todo';

describe('<AddTodo />', () => {
  it('shallow add_todo renders without crashing', () => {
    const wrapper = shallow(<AddTodo />);
    expect(wrapper).toMatchSnapshot();
  });
});
