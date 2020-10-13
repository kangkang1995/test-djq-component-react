import * as React from 'react';
export default function (props) {
    const { data: dataMap, params } = props;
    // const width = dataMap.get("width");
    // const height = dataMap.get("height");
    // const round = dataMap.get("round");
    const width = 1000;
    const height = 1000;
    // const round = dataMap.get("round");
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <rect id="ss0" x="100" y="100" width="100" height="50" fill="#00FF4E" stroke="none">
                <animate attributeName="x" to="80" begin="ss0.mouseenter" dur="0.2s" fill="freeze" keySplines="0 .75 .25 1" />
                <animate attributeName="width" to="140" begin="ss0.mouseenter" dur="0.2s" fill="freeze" keySplines="0 .75 .25 1" />
                <animate attributeName="x" to="100" begin="ss0.mouseout" dur="0.2s" fill="freeze" keySplines="0 .75 .25 1" />
                <animate attributeName="width" to="100" begin="ss0.mouseout" dur="0.2s" fill="freeze" keySplines="0 .75 .25 1" />
            </rect>
        </svg >
    )
}