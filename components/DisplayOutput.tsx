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
    const renderTrigger = (length: string, isOpen: boolean) => (
        <div className="collapsible-trigger">
            {`${length} letter words`}
            <span className={`collapsible-arrow ${isOpen ? 'expanded' : 'collapsed'}`}>▼</span>
        </div>
    );
    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-row space-x-4">
            <div className="flex flex-col">
            <p>Letters</p>
            <input
                type="text"
                placeholder="Letters"
                value={letters}
                onChange={handleInputChange(setLetters)}
                className="text-white rounded-md bg-inherit backdrop-blur-md border border-[#606060]"
            />
            </div>
            <div className="flex flex-col">
            <p>Minimum length</p>
            <select 

            onChange={(e) => {
                setLength(e.target.value ? Number(e.target.value) : null);
                setResult(null);
                setSubmitted(false);
            }}  
            name="length" 
            value={length ?? ""}  
            className="text-white rounded-md bg-inherit backdrop-blur-md border border-[#606060]">
                <option value="" className="text-black">-</option>
                <option value="3" className="text-black">3</option>
                <option value="4" className="text-black">4</option>
            </select>
            </div>
            <div className="flex flex-col">
            <p className="text-stone-900">‎ </p>
            <button type="submit" className="text-white rounded-md bg-inherit backdrop-blur-md border border-[#606060] hover:bg-stone-700">Submit</button>
            </div>
            </form>
            <div className="flex flex-col justify-center items-center py-4 space-y-4 ">
            {error && <p>{error}</p>}
            {submitted && (result && Object.keys(result).length > 0 ? (
                Object.keys(result).map((length) => (
                    <Collapsible 
                        key={length} 
                        trigger={renderTrigger(length, false)} 
                        triggerWhenOpen={renderTrigger(length, true)}
                    >
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
        </div>
    );
}