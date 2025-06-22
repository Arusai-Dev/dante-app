import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export default function ChatBubble({ message, sender }) {
    return (
        <div className={`text-wrap wrap-break-word flex mb-2  ${sender == "user" ? 'justify-end' : 'justify-start'}`} >
            <div className={`px-4 py-2 rounded-sm max-w-xs text-wrap wrap-break-word ${sender == "user" ? 'bg-neutral-800 text-white rounded-br-none' : 'bg-white text-black rounded-bl-none'} ` }>

                <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}>
                    {processKatexInMarkdown(message)}
                </ReactMarkdown>
            </div>
        </div>
    )
}


export function processKatexInMarkdown(markdown: string) {
    const markdownWithKatexSyntax = markdown
        .replace(/\\\\\[/g, '$$$$') 
        .replace(/\\\\\]/g, '$$$$') 
        .replace(/\\\\\(/g, '$$$$') 
        .replace(/\\\\\)/g, '$$$$') 
        .replace(/\\\[/g, '$$$$') 
        .replace(/\\\]/g, '$$$$') 
        .replace(/\\\(/g, '$$$$') 
        .replace(/\\\)/g, '$$$$');
    return markdownWithKatexSyntax;

}