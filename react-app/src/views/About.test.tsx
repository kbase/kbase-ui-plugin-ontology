import React from 'react';
import { render, waitFor } from '@testing-library/react';
import About from './About';
import { MemoryRouter, Route } from 'react-router-dom';

const TIMEOUT = 10000;

test('renders About view', async () => {
    const { getByText } = render(
        <MemoryRouter initialEntries={['/samples/about']} initialIndex={0}>
            <Route path="/samples/about" children={About} />
        </MemoryRouter>
    );
    await waitFor(() => {
        const linkElement = getByText(/About the samples Plugin/i);
        expect(linkElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});
