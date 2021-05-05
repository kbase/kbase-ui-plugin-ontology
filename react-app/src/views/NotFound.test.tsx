import React from 'react';
import { render, waitFor } from '@testing-library/react';
import NotFound from './NotFound';
import { MemoryRouter, Route } from 'react-router-dom';

const TIMEOUT = 10000;

test('renders About view', async () => {
    const { getByText } = render(
        <MemoryRouter initialEntries={['/samples/foo']} initialIndex={0}>
            <Route children={NotFound} exact={true} />
        </MemoryRouter>
    );
    await waitFor(() => {
        const linkElement = getByText(/NOT FOUND!/i);
        expect(linkElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});
