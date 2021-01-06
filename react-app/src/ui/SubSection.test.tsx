import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import SubSection from './SubSection';

it('Renders a simple section component with just title, and no content', () => {
    render(<SubSection title="Section Test" />);
    expect(screen.getByText('Section Test')).toBeInTheDocument();
    expect(screen.queryByText('foo')).toBeNull();
});

it('Renders a simple section component with just title, and simple content', () => {
    render(<SubSection title="Section Test">Hello</SubSection>);
    expect(screen.getByText('Section Test')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.queryByText('foo')).toBeNull();
});

it('Renders a simple section component with just title, and somewhat more complex content', () => {
    render(<SubSection title="Section Test"><div><i>Hello</i> <span>world</span>.</div></SubSection>);
    expect(screen.getByText('Section Test')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.queryByText('foo')).toBeNull();
});
