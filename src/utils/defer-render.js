// @flow
import React from 'react';

type FunctionComponent<P> = (props: P) => ?React$Element<any>;
type ClassComponent<D, P, S> = Class<React$Component<D, P, S>>;
type DeferRender<P, S> = (
    WrappedComponent: ClassComponent<void, P, S> | FunctionComponent<P>
) => ClassComponent<void, P, S>;

const deferRender: DeferRender<*, *> = WrappedComponent => {
    return class Wrapper extends React.PureComponent {
        state = {};

        componentDidMount() {
            this.schedulePropsChange();
        }

        componentDidUpdate(prevProps) {
            if (prevProps !== this.props) {
                this.schedulePropsChange();
            }
        }

        schedulePropsChange() {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => this.setState({props: this.props}));
            });
        }

        render() {
            const {props} = this.state;
            return props ? <WrappedComponent {...props} /> : null;
        }
    };
};

export default deferRender;
