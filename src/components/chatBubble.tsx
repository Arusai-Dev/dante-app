export default function ChatBubble({ message, sender }) {
    
    return (
        <div className={`text-wrap wrap-break-word flex mb-2 ${sender == "user" ? 'justify-end' : 'justify-start'}`} >
            <div className={`px-4 py-2 rounded-2xl max-w-xs text-wrap wrap-break-word ${sender == "user" ? 'bg-neutral-800 text-white rounded-br-none' : 'bg-neutral-900-200 text-white rounded-bl-none'} ` }>
                {message}
            </div>
        </div>
    )
}