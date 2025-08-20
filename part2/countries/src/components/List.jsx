import Country from './Country';

const List = ({ countries, setCountries }) => {
    if (countries.length > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else if (countries.length > 1 && countries.length <= 10) {
        return (
            <ul>
                {countries.map((country) =>
                    <li key={country.name.common}> {country.name.common} <button onClick={() => setCountries([country])}>show</button></li>
                )}
            </ul>
        )
    } else if (countries.length === 1 && countries[0]) {
        return (
            <Country country={countries[0]} setCountries={setCountries} />
        )
    }
}

export default List;
