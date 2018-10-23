import React, { Component } from "react";
import "./App.css";
import * as Verbs from "./verbs";
const { spanishVerbs, spanishPronouns, germanVerbs, germanPronouns } = Verbs;

const NUM_TOTAL = 5;

const InfoModal = ({ handleClose, modalVisible, children }) => {
  const showHideClassName = modalVisible
    ? "modal display-block"
    : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <b>{"Did You Know"}</b>
        <br />
        <br />
        {
          "Verbs and conjugations form about 30% of expression in European languages! Practice them and you'll greatly accelerate your learning"
        }
        <br />
        {"🔥🔥🔥"}
        <br />
        <br />
        <div className="button" onClick={handleClose}>
          {"Got it!"}
        </div>
      </section>
    </div>
  );
};

const StartScreen = ({ chooseLanguage }) => (
  <div style={{ maxWidth: "380px", margin: "0 auto", lineHeight: "23px" }}>
    <br />
    {"Are you ready to train?"}
    <br />
    <br />
    <iframe
      src="https://giphy.com/embed/l0IyiY9zRnf6nH5Cw"
      style={{ maxWidth: "100%" }}
      width="420"
      height="420"
      frameBorder="0"
      className="giphy-embed"
      allowFullScreen
    />
    <br />
    <b>{"Choose your language:"}</b>
    <br />
    <br />
    <br />
    <div
      onClick={chooseLanguage("spanish")}
      className="button"
      style={{ marginRight: "20px" }}
    >
      {"Spanish"}
    </div>
    <div onClick={chooseLanguage("german")} className="button">
      {"German"}
    </div>
  </div>
);

const EndScreen = ({ numCorrect, wrongAnswerMsg, onNext }) => (
  <div>
    <br />
    <div>
      {wrongAnswerMsg}
      <br />
      <br />
      {`Your score is ${numCorrect} out of ${NUM_TOTAL}`}
    </div>
    <br />
    <br />
    {numCorrect / NUM_TOTAL > 0.5 ? (
      <div>
        <iframe
          src="https://giphy.com/embed/3o7bug8jhF3LvXDxvy"
          style={{ maxWidth: "100%" }}
          width="420"
          height="420"
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
        />
        <br />
        <br />
        <br />
        {"Keep it up! You're on 🔥"}
      </div>
    ) : (
      <div>
        <iframe
          src="https://giphy.com/embed/xUOrwqC3pygvqNUNXy"
          style={{ maxWidth: "100%" }}
          width="420"
          height="420"
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
        />
        <br />
        <br />
        <br />
        {"Practice makes perfect! You'll do better next time 😉"}
      </div>
    )}
    <br />
    <br />
    <div onClick={onNext} className="button">
      {"Play again"}
    </div>
  </div>
);

class StudyScreen extends Component {
  render() {
    const { language, pronouns, conjugations, onNext } = this.props;
    return (
      <div>
        <br />
        <h1 style={{ textTransform: "capitalize" }}>{language}</h1>
        <br />
        <br />
        <div onClick={onNext} className="button">
          {"Start"}
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        {"These are the verbs you'll be training:"}
        <br />
        <br />
        {Object.keys(conjugations).map(verb => (
          <div key={verb} className="verbContainer">
            <h3>{`${verb.toUpperCase()} (${conjugations[verb].meaning})`}</h3>
            {pronouns.map(pronoun => (
              <div key={pronoun} className="conjugationContainer">
                <div>
                  <i>{pronoun}</i>
                </div>
                <div>{conjugations[verb][pronoun]}</div>
              </div>
            ))}
          </div>
        ))}
        <br />
        <br />
        <br />
        <div onClick={onNext} className="button">
          {"Start"}
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLanguage: "",
      pronoun: "",
      currentVerb: "",
      numAnswered: 0,
      numCorrect: 0,
      input: "",
      wrongAnswerMsg: "",
      route: "home",
      modalVisible: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNextVerb = this.handleNextVerb.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  conjugations(language) {
    return language === "spanish" ? spanishVerbs : germanVerbs;
  }

  verbs(language) {
    return Object.keys(this.conjugations(language));
  }

  pronouns(language) {
    return language === "spanish" ? spanishPronouns : germanPronouns;
  }

  randomPronoun() {
    const pronouns = this.pronouns(this.state.currentLanguage);
    return this.sample(pronouns);
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }

  handleKeyPress(e) {
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  }

  sample(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  handleNext = language => e => {
    this.setState({ currentLanguage: language, route: "study" });
  };

  startGame = e => {
    const { currentLanguage } = this.state;
    this.setState({
      pronoun: this.sample(this.pronouns(currentLanguage)),
      currentVerb: this.sample(this.verbs(currentLanguage)),
      numAnswered: 0,
      numCorrect: 0,
      wrongAnswerMsg: "",
      route: "game"
    });
  };

  handleSubmit(e) {
    const {
      input,
      currentLanguage,
      currentVerb,
      pronoun,
      numCorrect
    } = this.state;
    const conjugations = this.conjugations(currentLanguage);
    const correctAnswer = conjugations[currentVerb][pronoun];

    const isGameOver = this.state.numAnswered === NUM_TOTAL - 1;

    if (input === correctAnswer) {
      this.setState({
        numCorrect: numCorrect + 1,
        wrongAnswerMsg: "Correct!"
      });
      this.handleNextVerb(e);
    } else {
      this.setState({
        wrongAnswerMsg: `Sorry, the correct conjugation is "${correctAnswer}"`
      });
    }
    if (isGameOver) {
      this.setState({ route: "gameOver" });
    }
  }

  handleNextVerb(e) {
    const verbs = this.verbs(this.state.currentLanguage);
    this.setState(prevState => ({
      input: "",
      pronoun: this.randomPronoun(),
      currentVerb: this.sample(verbs),
      numAnswered: prevState.numAnswered + 1,
      wrongAnswerMsg: ""
    }));
  }

  hideInfoModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const {
      route,
      input,
      pronoun,
      currentVerb,
      currentLanguage,
      numCorrect,
      numAnswered,
      wrongAnswerMsg,
      modalVisible
    } = this.state;
    return (
      <div className="App">
        <InfoModal
          modalVisible={modalVisible}
          handleClose={this.hideInfoModal}
        />
        <h2 className="header">{"Conjugator"}</h2>
        {route === "home" && <StartScreen chooseLanguage={this.handleNext} />}
        {route === "study" && (
          <StudyScreen
            language={currentLanguage}
            conjugations={this.conjugations(currentLanguage)}
            pronouns={this.pronouns(currentLanguage)}
            onNext={this.startGame}
          />
        )}
        {route === "gameOver" && (
          <EndScreen
            numCorrect={numCorrect}
            wrongAnswerMsg={wrongAnswerMsg}
            onNext={() => this.setState({ route: "home" })}
          />
        )}
        {route === "game" && (
          <div>
            <div>
              {numAnswered} / {NUM_TOTAL}
            </div>
            <div className="answer">
              Conjugate the verb:
              <br />
              <h3>{`${currentVerb.toUpperCase()} (${
                this.conjugations(currentLanguage)[currentVerb].meaning
              })`}</h3>
              <br />
              {pronoun}
              <input
                type="text"
                className={`input${wrongAnswerMsg ? " inactive" : ""}`}
                value={input}
                disabled={!!wrongAnswerMsg}
                onKeyDown={this.handleKeyPress}
                onChange={this.handleChange}
              />
              {wrongAnswerMsg && (
                <div className="msg error">{wrongAnswerMsg}</div>
              )}
            </div>
            {wrongAnswerMsg ? (
              <div onClick={this.handleNextVerb} className="button">
                {"Next"}
              </div>
            ) : (
              <div onClick={this.handleSubmit} className="button">
                {"Submit"}
              </div>
            )}
            <br />
            <br />
            <br />
            {"Your score: "}
            <b>{numCorrect}</b>
          </div>
        )}
      </div>
    );
  }
}

export default App;
