import React from "react";

type MultiSelectOverlayProps = {
    children: React.ReactNode;
};

const MultiSelectOverlay = ({ children }: MultiSelectOverlayProps) => {
    return (
        <div className='absolute left-0 z-10 bg-blend-darken h-full min-w-full bg-slate-100 bg-opacity-50 select-none'>
            <div className='flex h-full items-center justify-center'>{children}</div>
        </div>
    );
};

export default MultiSelectOverlay;
