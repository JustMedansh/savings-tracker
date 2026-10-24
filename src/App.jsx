import { useEffect, useState } from 'react'

const generateNumbers = (target, total) => {
    let leftAmount = total
    let foundIncomplete = false
    const fullBlocks = Math.floor((Math.sqrt(1 + 8 * target) - 1) / 2)
    const minimum = (fullBlocks * (fullBlocks + 1)) / 2
    const partialBlock = target - minimum
    const numbers = []

    for (let i = 0; i <= fullBlocks; i++) {
        let amount = i + 1;
        if (i == fullBlocks && partialBlock != 0) {
            amount = partialBlock
        }

        numbers.push({
            id: i,
            amount,
        })
    }

    if (partialBlock == 0) {
        numbers.pop()
    }
    numbers.sort((a, b) => a.amount - b.amount)

    const newNumbers = []

    for (const number of numbers) {
        let amount = number.amount
        let status = 'not-started'

        if (leftAmount >= amount) {
            leftAmount -= amount
            status = 'completed'
        } 
        else if (!foundIncomplete) {
            foundIncomplete = true
            status = 'incomplete'
        }

        newNumbers.push({
            ...number,
            status,
        })
    }
    return newNumbers
}

const App = () => {
    const [totalAmount, setTotal] = useState(0)
    const [notification, setNotification] = useState(null)

    const maxAmount = 5050
    const numbers = generateNumbers(maxAmount, totalAmount)
    const goalAmount = numbers.reduce((sum, number) => sum + number.amount,0)

    useEffect(() => {
        if (notification == null) {
          return
        }
    
        const timeoutId = setTimeout(() => {setNotification(null)}, 5000)
    
        return () => {
          clearTimeout(timeoutId)
        }
    
    }, [notification])  

    const notify = (message, type) => {
        setNotification({message, type})
    }
    
    const handleAdd = (newAmount) => {
        setTotal(previousAmount => Math.min(previousAmount + newAmount, goalAmount))
        notify(`added ${newAmount}`, 'success')
    }

    return (<div>
        <CustomNotification message={notification?.message ?? null} type={notification?.type ?? null} />
        <Numbers numbers={numbers} />
        <NumbersForm handleAdd={handleAdd} />
        <p>Amount collected: {totalAmount}</p>
    </div>)
}

const NumbersForm = ({handleAdd}) => {
    const [currentAmount, setCurrentAmount] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        handleAdd(Number(currentAmount))
        setCurrentAmount('')
    }

    return (
    <form onSubmit={handleSubmit}>
        <input 
            type='number'
            value={currentAmount}
            onChange={event => setCurrentAmount(event.target.value)}
        />
        <button type='submit'>add money</button>
    </form>)
}

const Numbers = ({ numbers }) => {
    return (<div className='grid'>
        {numbers.map(number => 
            <div key={number.id} className={`number ${number.status}`}>
                {number.amount}
            </div>
        )}
    </div>)
}

const CustomNotification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`${type} notif`}>
      {message}
    </div>
  )
}


export default App
