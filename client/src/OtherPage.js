import React from 'react';
import { Link } from 'react-router-dom';

export default function(){
    return (
        <div>
            I'm some other page.
            <Link to="/">Go back home</Link>
        </div>
    )
}
