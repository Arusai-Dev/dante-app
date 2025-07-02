import { useState, useRef, useEffect } from 'react';

const LineNumberedTextarea = ({ 
    value = '', 
    onChange, 
    placeholder = 'Enter your code here...',
    className = '',
    ...props 
}) => {
    const [text, setText] = useState(value);
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    const lineCount = text.split('\n').length;

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        if (onChange) onChange(e);
    };

    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    useEffect(() => {
        setText(value);
    }, [value]);

    return (
        <div className={`flex border border-gray-300 max-h-60 rounded-sm overflow-hidden font-mono text-sm leading-6 bg-gray-80 ${className}`}>
            <div 
                ref={lineNumbersRef}
                className="border-r py-2 px-2 min-w-12 text-right text-gray-500 select-none overflow-hidden whitespace-nowrap"
            >
                {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i + 1} className="h-6 leading-6">
                        {i + 1}
                    </div>
                ))}
            </div>
            <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                onScroll={handleScroll}
                placeholder={placeholder}
                className="flex-1 border-none text-[13px] md:text-[16px] outline-none p-3 py-2 resize-y min-h-48 max-h-60 text-[#dddddd]"
                spellCheck={false}
                style={{ tabSize: 2 }}
                {...props}
            />
        </div>
    );
};

export default LineNumberedTextarea;