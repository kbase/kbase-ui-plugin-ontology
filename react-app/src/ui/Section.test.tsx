import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import Section from './Section';

it('Renders a simple section component with just title, and no content', () => {
    render(<Section title="Section Test" />);
    expect(screen.getByText('Section Test')).toBeInTheDocument();
    expect(screen.queryByText('foo')).toBeNull();
});

it('Renders a simple section component with just title, and simple content', () => {
    render(<Section title="Section Test">Hello</Section>);
    expect(screen.getByText('Section Test')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.queryByText('foo')).toBeNull();
});

it('Renders a simple section component with just title, and somewhat more complex content', () => {
    render(<Section title="Section Test"><div><i>Hello</i> <span>world</span>.</div></Section>);
    expect(screen.getByText('Section Test')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.queryByText('foo')).toBeNull();
});

it('Renders a simple section component with just title, and simple content, with a toolbar', () => {
    render(<Section title="Section Test" renderToolbar={() => { return <div>TOOL</div>; }}>Hello</Section>);
    expect(screen.getByText('Section Test')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('TOOL')).toBeInTheDocument();

    expect(screen.queryByText('foo')).toBeNull();
});

// TODO: run tests in real browser.
// jest uses jsdom, which will never be able to render, so for any test like this which needs to
// validate the layout, we'll need to run in a real browser.
// This should be a one-time crunch to figure out all the dependencies and mechanics.

// it('Renders a simple section component with just title, and simple content, with full height', () => {
//     // const containerStyle: React.CSSProperties = {
//     //     height: '500px',
//     //     display: 'flex',
//     //     flexDirection: 'column'
//     // };
//     const wrapper = document.createElement('div');
//     wrapper.style.height = '500px';
//     wrapper.style.display = 'flex';
//     wrapper.style.flexDirection = 'column';
//     const { container, getByText, queryByText } = render(<Section title="Section Test" fullheight={true}>Hello</Section>, {
//         container: document.body.appendChild(wrapper)
//     });
//     expect(getByText('Section Test')).toBeInTheDocument();
//     expect(getByText('Hello')).toBeInTheDocument();
//     expect(container.clientHeight).toEqual(500);

//     const theComponent = container.firstChild;
//     expect(theComponent).not.toBeNull();
//     if (theComponent === null) {
//         throw new Error('Oops');
//     }
//     expect((theComponent as Element).clientHeight).toEqual(500);

//     expect(queryByText('foo')).toBeNull();
// });