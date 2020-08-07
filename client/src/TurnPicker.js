import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Grid, Box } from "@material-ui/core";
import Face from "./Face";
import { ORDER } from "./helpers";
import { isEmpty } from "lodash";
import { useTheme } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            margin: 0,
        },
    })
);

export default function TurnPicker({ moves, addMove, onHover, nextMove }) {
    const classes = useStyles();
    let theme = useTheme();
    let count = 3;
    let columns = [];
    for (let i = 0; i < moves.length; i += count) {
        columns.push(moves.slice(i, i + count));
    }
    let { source } = moves.length > 0 ? moves[0] : {};
    if (isEmpty(source)) return <span />;
    console.log("nextmove", nextMove);
    return (
        <Box>
            <Grid
                container
                xs={12}
            // justify="space-between"
            // alignItems="flex-end"
            >
                {columns.map((column, i) => {
                    let { move, target } = column[0];
                    let face = move[0];
                    let offset = ORDER.indexOf(face) * 9;
                    let colors = source.substring(offset, offset + 9).split("");
                    return (
                        <Grid
                            key={face}
                            container
                            xs={6}
                            md={6}
                            justify="space-between"
                            alignItems="center"
                            direction="row"
                            style={{ marginBottom:10 }}
                        >
                            <Grid item xs={2}>
                                <Face colors={colors} />
                            </Grid>
                            <Grid item xs={10} spacing={1}>
                                <ButtonGroup
                                    key={i}
                                    variant="text"
                                    aria-label="text primary button group"
                                    fullWidth={true}
                                    style={{ padding: 5, marginRight: 5 }}
                                >
                                    {column.map(({ source, target, move }) => (
                                        <Button
                                            key={move}
                                            onClick={() => addMove(move, target)}
                                            onMouseEnter={() => onHover(target)}
                                            style={{
                                                backgroundColor:
                                                    nextMove && nextMove.move == move
                                                        ? theme.palette.success.main
                                                        : "transparent",
                                            }}
                                        >
                                            {move}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
