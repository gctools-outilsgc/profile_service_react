import React from 'react';

import { render } from 'react-testing-library';

import OnboardStep2 from './OnboardStep2';

const createProps = props => ({
    token: '',
    userObject:{
        name: 'First Last',
        email: 'test@test.test',
        titleEn: '',
        titleFr: '',
    },
    submitForm: jest.fn(),
    ...props
});

it('submits the form information', () => {
    let props = createProps();
    const { getByLabelText } = render(
        <OnboardStep2 {...props} />
    );

    expect(getByLabelText('Full name')).toBeInTheDocument();
})