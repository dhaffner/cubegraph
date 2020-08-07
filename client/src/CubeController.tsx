import "@scarygami/scary-cube";
import { isEmpty, delay } from 'lodash';
import React, { useEffect } from "react";
import TurnPicker from './TurnPicker';
import styled from 'styled-components';
import { withTheme } from 'styled-components';
import { useTheme } from '@material-ui/core/styles';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "scary-cube": any;
        }
    }
}


const ScaryCube = ({ className, faces, onChange, neighbors, onHover, nextMove }) => {
    const ref = React.useRef();

    useEffect(() => {
        if (ref === undefined) {
            return;
        }
        else if (ref.current === undefined) {
            return;
        }

        // @ts-ignore
        ref.current.addEventListener('move-finished', () => {
            console.log('move-finished');

        });
    }, [])

    useEffect(() => {
        if (ref === undefined) {
            return;
        }
        else if (ref.current === undefined) {
            return;
        }
        if (faces === undefined || isEmpty(faces)) {
            return;
        }
        // @ts-ignore
        let { current } = ref;
        // @ts-ignore
        if (!current.moving) {
            // @ts-ignore
            current.faces = faces;
        }

    }, [faces]);

    function addMove(move, target) {
        if (ref === undefined) {
            return;
        }
        else if (ref.current === undefined) {
            return;
        }
        // @ts-ignore
        ref.current.addMove(move);
        delay(() => onChange(target), 100);
    }

    return (
        <div className={className}>
            <scary-cube ref={ref}></scary-cube>
            <TurnPicker key={faces} addMove={addMove} moves={neighbors} onHover={onHover} nextMove={nextMove} />
        </div>
    );
}


const StyledCube = styled(ScaryCube)`
--cube-color-u: ${({ theme }) => theme.palette.background.paper};
--cube-color-d: ${({ theme }) => theme.palette.secondary.dark};
--cube-color-f: ${({ theme }) => theme.palette.success.dark};
--cube-color-b: ${({ theme }) => theme.palette.info.dark};
--cube-color-l: ${({ theme }) => theme.palette.warning.dark};
--cube-color-r: ${({ theme }) => theme.palette.error.dark};
min-height: 100%;
margin: auto;
`;

export default function ThemedCube(props) {
    let theme = useTheme();
    return <StyledCube theme={theme} {...props} />;
}