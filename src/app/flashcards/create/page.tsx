'use client'

import { SetStateAction, useEffect, useState } from "react"

export default function Create() {
    const [front, setFront] = useState("")
    const [back, setBack] = useState("")
    const [flipped, setFlipped] = useState(false)

    const changeInFront = (event: { target: { value: SetStateAction<string> } }) => {
        setFront(event.target.value)
    }

    const changeInBack = (event: { target: { value: SetStateAction<string> } }) => {
        setBack(event.target.value)
    }
    const setFlippedOnClick = () => {
        setFlipped(prev => !prev)
    };
    

    return (
        <></>
    )  
}