"use client";
import { useState } from "react";
import getValidWords from "../pages/api/getValidWords";
export default function DisplayOutput() {
    const [letters, setLetters] = useState("");
    const [length, setLength] = useState(0);
    const [result, setResult] = useState(null);
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const response = await fetch("/api/getValidWords", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ letters, length: length.toString() }),
        });

        const data = await response.json();
        setResult(data.validWords);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="Letters"
                value={letters}
                onChange={(e) => setLetters(e.target.value)}
            />
            <input
                type="number"
                placeholder="Min Length"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
            />
            <button type="submit">Submit</button>
            </form>

            {result && (
                <ul>
                    {Object.keys(result).map((word) => (
                    <li key={word}>{word}</li>
                ))}
                </ul>
            )}
        </div>
    );
}