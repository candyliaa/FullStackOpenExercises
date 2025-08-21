const Deleted = ({ message }) => {
    if (!message) {
        return null
    }

    return (
        <div className="deleted">
            {message}
        </div>
    )
}

export default Deleted
