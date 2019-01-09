import React from 'react';
// import ReactDOM from 'react-dom';
import { render } from 'react-testing-library';
import App from './App';

/*
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
*/
it('renders the app component', () => {
  const { getByText } = render(<App />);
  expect(getByText('GCProfile')).toBeInDocument();
})