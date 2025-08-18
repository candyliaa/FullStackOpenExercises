import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
      setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
      setBad(bad + 1)
  }

  return (
    <div>
      <Header name="give feedback" />
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <Header name="statistics" />
      <Stats clicks={{ good, neutral, bad }} />
    </div>
  )
}

const Header = props => <h1>{props.name}</h1>

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const Stats = ({clicks}) => {
  const totalClicks = clicks.good + clicks.neutral + clicks.bad
  return (
    <div>
      <p>good {clicks.good}</p>
      <p>neutral {clicks.neutral}</p>
      <p>bad {clicks.bad}</p>
      <p>average {(clicks.good - clicks.bad) / totalClicks}</p>
      <p>positive {((clicks.good / totalClicks) * 100)} %</p>
    </div>
  )
}

export default App
