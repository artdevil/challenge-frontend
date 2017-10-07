import React from 'react';
import { shallow } from 'enzyme';

import EditTodo from './edit_todo';

describe('<EditTodo />', () => {
  it('shallow edit_todo renders without crashing', () => {
    const wrapper = shallow(<EditTodo showModal={false} hideModal={() => {}} showModalObj={{}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
