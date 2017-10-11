import React from 'react';
import { shallow } from 'enzyme';

import ActionTodos from './action_todos';

describe('<ActionTodos />', () => {
  it('shallow action_todos renders without crashing', () => {
    const wrapper = shallow(<ActionTodos />);
    expect(wrapper).toMatchSnapshot();
  });
});
