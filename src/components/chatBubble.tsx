export default function ChatBubble({ message, isSender }) {
    
    return (
        <div className={`flex mb-2 ${isSender ? 'justify-end' : 'justify-start'}`} >
            <div className={`px-4 py-2 rounded-2xl max-w-xs ${isSender ? 'bg-neutral-800 text-white rounded-br-none' : 'bg-neutral-900-200 text-white rounded-bl-none'} ` }>
                {message}
            </div>
        </div>
    )
}