import React from 'react';

import { render } from 'react-testing-library';
import { MockedProvider } from 'react-apollo/test-utils';

import { profileInfoQuery, GQLOnboard} from './GQLOnboard';

const mocks = [
    {
      request: {
        query: profileInfoQuery,
        variables: {
          gcID: '1',
        },
      },
      result: {
        data: {
          profiles: [{
            gcID: '1',
            name: 'Name Test',
            email: 'test@test.test',
            avatar: '',
            mobilePhone: '1234567890',
            officePhone: '0987654321',
            supervisor: {
              gcID: '2',
              name: 'Supervisor Person',
            },
            address: {
              id: '3',
              streetAddress: '123 Fake St',
              city: 'Ottawa',
              province: 'Ontario',
              postalCode: 'H0H0H0',
              country: 'Canada',
            },
            titleEn: 'Title En',
            titleFr: 'Title Fr',
            org: {
              id: '4',
              nameEn: 'Team En',
              nameFr: 'Team Fr',
              organization: {
                id: '1',
                nameEn: 'Department En',
                nameFr: 'Department Fr',
                acronymEn: 'DE',
                acronymFr: 'DR',
              },
            },
          }],
        },
      },
    },
  ];

it('renders the onboarding module', () => {
    const { getByText } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <GQLOnboard /> 
        </MockedProvider>
    );

    expect(getByText('Welcome')).toBeInTheDocument();
});