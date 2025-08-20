const Filter = ({ filter, onChange }) => {
    return (
        <div>
            find countries <input value={filter} onChange={onChange} />
        </div> 
    )
}

export default Filter
