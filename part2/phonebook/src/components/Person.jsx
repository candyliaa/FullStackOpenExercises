const Person = ({ person, filter }) => {
      if (person.name.includes(filter)) {
        return (
          <div>
            {person.name} {person.number}
          </div>
        )
      }
}

export default Person
