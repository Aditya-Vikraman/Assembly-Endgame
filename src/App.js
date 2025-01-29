import { useState } from 'react'
import './App.css'
import { languages } from './utils/languages'
import clsx from 'clsx'
import getFarewellText from './utils/farewellText'
import getRandomWord from './utils/words'
import Confetti from 'react-confetti'

export default function AssemblyEndgame () {
// state value
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

// static value
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

// derived value
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  // let wrongGuessCount = 0 
  // guessedletters.map(letter => {
  //   if (!currentWord.includes(letter)) {
  //     wrongGuessCount++
  //   }
  // })
 
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length-1
  const isGameOver = isGameWon || isGameLost
  const lastGuess = currentWord.includes(guessedLetters[guessedLetters.length - 1])

  function startNewGame () {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  const languagesElements = languages.map((lang,index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    return (
      <span 
        className={clsx({chip:true , lost: index < wrongGuessCount})}
        key={lang.name} 
        style={styles}
      >
        {lang.name}
      </span>
    )
  })

  const letterElements = currentWord.split("").map((letter,index) => (
    <span 
      key={index} 
      className={clsx({wrong:!guessedLetters.includes(letter)})}
    >
      {guessedLetters.includes(letter) ? letter.toUpperCase() : !isGameLost ? "" : letter.toUpperCase() }
    </span>
  ))

  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter) 
    return (
      <button
        className={clsx({correct: isCorrect, wrong: isWrong})}
        key={letter} 
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    )
  })

  function addGuessedLetter (letter) {
    setGuessedLetters (prevLetters => 
      prevLetters.includes(letter) ? prevLetters : 
      [...prevLetters, letter])
  }

  function renderGamestatus () {
    if (!isGameOver) {
      if (!lastGuess) {
        return (
          <>
            <h2>Wrong Guess!</h2>
            <p className="farewell-message">
              {getFarewellText(languages[wrongGuessCount-1].name)}
            </p>
          </>
        )
      } else {
        return (
          <>
            <h2>Nice Guess!</h2>
            <p>Keep Going!</p>
          </>
        )
      }
    }
    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well done!</p>
        </>
      )
    } else {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose! Better start learning Assembly.</p>
        </>
      )
    }
  }

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000}/>}

      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>
      </header>

      <section 
        aria-live="polite" 
        role="status" 
        className={clsx("game-status", {
        won:isGameWon,  
        lost:isGameLost, 
        wrong:!isGameOver && guessedLetters.length > 0 && !lastGuess,
        correct: !isGameOver && lastGuess
        })}>
        {/* { isGameOver ? (
            isGameWon ? (
              <>
                <h2>You Win!</h2>
                <p>Well done!</p>
              </>
            ) : (
              <>
                <h2>Game Over!</h2>
                <p>You lose! Better start learning Assembly.</p>
              </>
            )
          ) : (
            null
          )
        }  */
        guessedLetters.length > 0 && renderGamestatus()}
      </section>

      <section className="language-chips">
        {languagesElements}
      </section>

      <section className="word">
        {letterElements}
      </section>

      <section 
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>
          {currentWord.includes(guessedLetters[guessedLetters.length - 1]) ? 
          `Correct! The letter ${guessedLetters[guessedLetters.length - 1]} is in the word.`:
          `Sorry, the letter ${guessedLetters[guessedLetters.length - 1]} is not in the word.`}
          You have {languages.length - 1 - wrongGuessCount} attempts left.
        </p>
        <p>
          current word: {currentWord.split("").map(letter => guessedLetters.includes(letter) ? letter+"." : "blank.").join(" ")}
        </p>
      </section>
        {/* above section for assistive technology, visually-hidden, aria-live region for status updates */}

      <section className="keyboard">
        {keyboardElements}
      </section>
      
      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}

    </main>
  )
}