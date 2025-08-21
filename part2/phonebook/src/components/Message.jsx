const Message = ({ message }) => {
    if (!message) return null

    if (message.includes("error")) {
        return (
            <div className="error">
                {message}
            </div>
        )
    } else {
        return (
            <div className="added">
                {message}
            </div>
        )
    }
}

export default Message
