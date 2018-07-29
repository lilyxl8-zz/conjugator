import React, { Component } from 'react';
import './App.css';
import * as Verbs from './verbs';
const { spanishVerbs, spanishPronouns } = Verbs;

const NUM_TOTAL = Object.keys(spanishVerbs).length || 10;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numCorrect: 0,
      verbList: [],
      pronoun: '',
      input: '',
      isStarted: false,
      wrongAnswerMsg: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.randomPronoun = this.randomPronoun.bind(this);
  }

  startGame = (e) => {
    this.setState({
      pronoun: this.randomPronoun(),
      verbList: Object.keys(spanishVerbs),
      isStarted: true,
      numCorrect: 0,
      wrongAnswerMsg: ''
    });
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  }

  randomPronoun = () => spanishPronouns[Math.floor(Math.random() * spanishPronouns.length)];

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  }

  handleSubmit = (e) => {
    const userAnswer = this.state.input;
    const currentVerb = this.state.verbList[0]
    const correctAnswer = spanishVerbs[currentVerb][this.state.pronoun];

    let { verbList, numCorrect } = this.state;
    verbList.shift();
    const isGameOver = verbList.length === 0

    if (userAnswer === correctAnswer) {
      this.setState({ numCorrect: numCorrect + 1, wrongAnswerMsg: `Correct!${isGameOver ? ` Your score is ${numCorrect + 1} out of ${Object.keys(spanishVerbs).length}` : ''}` });
    } else {
      this.setState({ wrongAnswerMsg: `Sorry, the correct conjugation is "${correctAnswer}".${isGameOver ? ` Your score is ${numCorrect} out of ${Object.keys(spanishVerbs).length}` : ''}`})
    }
    this.setState({ verbList, input: '', isStarted: !isGameOver, pronoun: this.randomPronoun() });
  }

  render() {
    const { numCorrect, input, pronoun, verbList, wrongAnswerMsg, isStarted } = this.state;
    return (
      <div className="App">
        <h2 className="header">{"Conjugator"}</h2>
        {!isStarted ? (
          <div>
            {wrongAnswerMsg && (
              <div className="error">
                {wrongAnswerMsg}
              </div>
            )}
            <br />
            <div onClick={this.startGame} className="button">
              {"Start"}
            </div>
          </div>
        ) : (
          <div>
            <div>{numCorrect} / {NUM_TOTAL}</div>
            <div className="answer">
              {pronoun}
              <input
                type="text"
                className="input"
                value={input}
                onKeyDown={this.handleKeyPress}
                onChange={this.handleChange}
              />
              {verbList && verbList[0]}
            </div>
            {wrongAnswerMsg && (
              <div className="error">
                {wrongAnswerMsg}
              </div>
            )}
            <div onClick={this.handleSubmit} className="button">
              {"Submit"}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
