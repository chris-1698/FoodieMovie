import { Typography } from "@mui/material";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function POC({ text }: { text: string; }) {

    const [isOver, setIsOver] = useState(false);

    const handleMouseHover = () => {
        console.log('Por encima, por encima!');
        setIsOver(true)
        console.log(isOver);
    }
    
    const handleMouseHoverOff = () => {
        console.log('Por debajo, por debajo!');
        setIsOver(false)
        console.log(isOver);
    }
    
    return ( 
        <>
            <Typography onMouseOver={handleMouseHover} onMouseOut={handleMouseHoverOff}>{text}</Typography>
            { isOver && (
                // Ver cómo hacer esto con un div flotante
                // Como un cuadro emergente 
                <QRCode value={text}></QRCode>
            ) }
        </>
    )

}
