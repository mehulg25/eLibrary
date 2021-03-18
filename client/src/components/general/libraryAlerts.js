import React, {useState, useEffect} from 'react';
import {Alert} from 'react-bootstrap';
import {useErrorState, hideAlert, useErrorDispatch} from '../../ErrorContext'

function LibraryAlerts({msg, variant, show}) {
    const {showAlert} = useErrorState();
    const errorDispatch = useErrorDispatch();

    useEffect(() => {
        if (showAlert) {
            setTimeout(() => {
                hideAlert(errorDispatch)
            }, 2500)
        }
    }, [showAlert])

    return (

        <div>
            <Alert show={show}
                variant={variant}>
                {msg} </Alert>
        </div>

    )
}


export default LibraryAlerts; 

