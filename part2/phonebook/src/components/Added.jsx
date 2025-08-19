const Added = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="added">
            {message}
        </div>
    )
}

export default Added
