import React from 'react';

// import { render } from 'react-testing-library';
import ReactDOM from 'react-dom';
import Home from './Home';

/*
it('renders the Home', () => {
    const { getByText } = render(<Home />);
    expect(getByText('home page')).toBeInDocument();
})
*/

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Home />, div);
    ReactDOM.unmountComponentAtNode(div);
  });