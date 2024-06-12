"use client";
import { useState } from "react";
import getValidWords from "../pages/api/getValidWords";
import Collapsible from "react-collapsible";

export default function DisplayOutput() {
    const [letters, setLetters] = useState("");
    const [length, setLength] = useState<number | null>(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const response = await fetch("/api/getValidWords", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ letters, length: length?.toString() }),
        });

        const data = await response.json();
        setResult(data.validWords);
        setSubmitted(true);
    };

    const validateInputs = () => {
        if (letters.length < 3) {
            setError("Number of letters should be at least 3");
            return false;
        }
        else if (letters.length > 10) {
            setError("Number of letters should be at most 10");
            return false;
        }
        if (!/^[a-zA-Z]+$/.test(letters)) {
            setError("Only letters are allowed");
            return false;
        }
        if (length === null) {
            setError("Please select a minimum length");
            return false;
        }
        setError("");
        return true;
    };

    const handleInputChange = (setter: Function) => (event: any) => {
        setter(event.target.value);
        setResult(null);
        setError("");
        setSubmitted(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="Letters"
                value={letters}
                onChange={handleInputChange(setLetters)}
                className="text-black"
            />
            <select 
            onChange={(e) => {
                setLength(e.target.value ? Number(e.target.value) : null);
                setResult(null);
                setSubmitted(false);
            }}  
            name="length" 
            value={length ?? ""}  
            className="text-black">
                <option value="">-</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <button type="submit">Submit</button>
            </form>
            {error && <p>{error}</p>}
            {submitted && (result && Object.keys(result).length > 0 ? (
                Object.keys(result).map((length) => (
                    <Collapsible key={length} trigger={`Words of length ${length}`}>
                        <ul>
                            {(result[length] as string[]).map((word: string) => (
                                <li key={word}>{word}</li>
                            ))}
                        </ul>
                    </Collapsible>
                ))
            ) : (
                <p>No words found</p>
            ))}
        </div>
    );
}