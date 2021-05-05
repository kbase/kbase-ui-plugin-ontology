import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Help from './Help';
import { MemoryRouter, Route } from 'react-router-dom';

const TIMEOUT = 10000;

test('renders About view', async () => {
    const { getByText } = render(
        <MemoryRouter initialEntries={['/samples/help']} initialIndex={0}>
            <Route path="/samples/help" children={Help} />
        </MemoryRouter>
    );
    await waitFor(() => {
        const linkElement = getByText(/Help for the samples Plugin/i);
        expect(linkElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});
