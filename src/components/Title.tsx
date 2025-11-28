import React from "react";
import BigText from 'ink-big-text';
import {Text} from 'ink';

// Ink Title component to display the application title

export default function Title() {
    return (
        <BigText
            text="React Vite Starter Kit"
            font="block"
            align="center"
            colors={['cyan', 'blue']}
            backgroundColor="black"
            letterSpacing={2}
            lineHeight={1}
            space={true}
            maxLength={40}
        />
        <Text color="green" align="center">Easy to go React + Vite Development</Text>
    );
}