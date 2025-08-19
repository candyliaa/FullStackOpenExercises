const Deleted = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="deleted">
            {message}
        </div>
    )
}

export default Deleted
