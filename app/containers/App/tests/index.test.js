import React from 'react';
import { shallow } from 'enzyme';

import App from '../index';

describe('<App />', () => {
  it('should render the header', () => {
    const renderedComponent = shallow(
      <App />
    );
    expect(renderedComponent).toBe(true);
  });
});
