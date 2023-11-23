import { Typography } from "@mui/material";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useFloating, useHover, useInteractions } from '@floating-ui/react'

export default function QRHover({ text }: { text: string; }) {

    const [isOpen, setIsOpen] = useState(false);
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
    });
    const hover = useHover(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
    ]);

    return (
        <div
            ref={refs.setReference}
            {...getReferenceProps()}
            style={{ display: 'inline-block' }}
        >
            <Typography>{text}</Typography>
            {isOpen && (
                <div ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                >
                    <QRCode value={text}></QRCode>
                </div>
            )}
        </div>
    )

}
