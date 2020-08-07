import { useTheme } from '@material-ui/core/styles';
import React from "react";
import styled from 'styled-components';
import { getFaceColors } from './helpers';

function Face({ colors, className }) {
    let theme = useTheme();
    let map = getFaceColors(theme);
    return (
        <div className={className}>
            {colors.map((color, i) =>
                <div key={i} style={{ backgroundColor: map[color] }}>
                </div>
            )}
        </div>
    );
}

let StyledFace = styled(Face)`
display: grid;
grid-gap: 1px;
grid-template-columns: repeat(3, 1fr);
border: 1px solid black;
background-color: black;
> div::before {
    content: "";
    padding-bottom: 100%;
    display: block;
  }
`;

export default StyledFace;
