const Filter = ({ filter, handleFilter }) => {
    return (
        <div>
            find countries: <input value={filter} onChange={handleFilter} />
        </div>
    )
}

export default Filter