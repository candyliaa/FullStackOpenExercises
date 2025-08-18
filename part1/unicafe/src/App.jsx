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
  if (totalClicks === 0) return <p>No feedback given</p>
  return (
    <div>
      <table>
        <tbody>
          <tr><td><StatisticLine text="good" value={clicks.good} /></td></tr>
          <tr><td><StatisticLine text="neutral" value={clicks.neutral} /></td></tr>
          <tr><td><StatisticLine text="bad" value={clicks.bad} /></td></tr>
          <tr><td><StatisticLine text="all" value={totalClicks} /></td></tr>
          <tr><td><StatisticLine text="average" value={(clicks.good - clicks.bad) / totalClicks} /></td></tr>
          <tr><td><StatisticLine text="positive" value={`${(clicks.good / totalClicks) * 100} %`} /></td></tr>
        </tbody>
      </table>
    </div>
  )
}

const StatisticLine = ({ text, value}) => (
  <>
    {text} {value}
  </>
)

export default App
