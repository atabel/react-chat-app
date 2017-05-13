// @flow
import React from 'react';

type FunctionComponent<P> = (props: P) => ?React$Element<any>;
type ClassComponent<D, P, S> = Class<React$Component<D, P, S>>;

const deferRender = <P: Object, S>(
    WrappedComponent: ClassComponent<void, P, S> | FunctionComponent<P>
): ClassComponent<void, P, *> => {
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
