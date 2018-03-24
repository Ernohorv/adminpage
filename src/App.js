import React, { Component } from 'react';
import q from './q2.png';
import './App.css';
import firebase, { firestore } from 'firebase';
import 'firebase/firestore';

class App extends Component {

  constructor(props) {
    super(props);
    this.start = this.start.bind(this);
    this.state = {
      clicked: false,
      questionNumber: '',
      question: '',
      correct: '',
      answer_a: '',
      answer_b: '',
      answer_c: '',
    }
  }

  start() {
    let ready = firebase.firestore().collection("Start").doc("xJZq9ld1rnbDrHx7jthl").collection("Ready").doc("Ready");

    if (this.state.clicked === false) {
      this.setState( {clicked: true})
    return ready.update({
      Ready: false,
      LobbyOpen: true,
      })
    .then(function() {
      setTimeout(() => {
        ready.update({
          Ready: true,
          LobbyOpen: false,
          })
      }, 15000);
      console.log("Started!");
      })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      });
    }
  else {
    this.setState( {clicked: false})
    return ready.update({
      Ready: false,
      LobbyOpen: false,
 	 })
   .then(function() {
    console.log("Stopped!");  
    })
    .catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
   });
  }
}

  handleQnChange(event) {  
    this.setState({questionNumber: event.target.value});  
  }

  handleQChange(event) {
    this.setState({question: event.target.value});
  }

  handleCorrectChange(event) {
    this.setState({correct: event.target.value})
  }

  handleAnswerAChange(event) {
    this.setState({answer_a: event.target.value})
  }

  handleAnswerBChange(event) {
    this.setState({answer_b: event.target.value})
  }

  handleAnswerCChange(event) {
    this.setState({answer_c: event.target.value})
  }

  question(event) {
    let questions = firebase.firestore().collection("Games").doc("Game1").collection("Questions").doc(this.state.questionNumber);
    return questions.update({
      Question: this.state.question,
    })
    .then(function() {
      console.log("Question updated");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }

  answerA(event) {
    let answerA = firebase.firestore().collection("Games").doc("Game1").collection("Questions").doc(this.state.questionNumber);
    return answerA.update({
      Answer_A: this.state.answer_a,
    })
    .then(function() {
      console.log("Answer_A updated");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }
  
  answerB(event) {
    let answerB = firebase.firestore().collection("Games").doc("Game1").collection("Questions").doc(this.state.questionNumber);
    return answerB.update({
      Answer_B: this.state.answer_b,
    })
    .then(function() {
      console.log("Answer_B updated");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }

  answerC(event) {
    let answerC = firebase.firestore().collection("Games").doc("Game1").collection("Questions").doc(this.state.questionNumber);
    return answerC.update({
      Answer_C: this.state.answer_c,
    })
    .then(function() {
      console.log("Answer_C updated");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }

  correct(event) {
    let correct = firebase.firestore().collection("Games").doc("Game1").collection("Questions").doc(this.state.questionNumber);
    return correct.update({
      Correct: this.state.correct,
    })
    .then(function() {
      console.log("Correct updated");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={q} className="App-logo" alt="q" />
          <h1 className="App-title">It's question time!</h1>
        </header>

          <button className="start-button" onClick={this.start}>Start</button>
          <br />

          <form className="game-form">
            <label>
              Question number:  
              <input
              name="qNumber"
               type="text"
               value={this.state.questionNumber} 
               onChange={this.handleQnChange.bind(this)} 
               placeholder='Q1'/>
            </label>

          <label>
            Question:
            <input 
            name="question"
            type="text"
            value={this.state.question}
            onChange={this.handleQChange.bind(this)}
            placeholder="Is cereal soup?" />
          </label>

          <label>
            Answer_A:
            <input 
            name="answer_a"
            type="text"
            value={this.state.answer_a}
            onChange={this.handleAnswerAChange.bind(this)}
            placeholder="Yes" />
          </label>
          
          <label>
            Answer_B:
            <input 
            name="answer_b"
            type="text"
            value={this.state.answer_b}
            onChange={this.handleAnswerBChange.bind(this)}
            placeholder="No" />
          </label>

          <label>
            Answer_C:
            <input 
            name="answer_c"
            type="text"
            value={this.state.answer_c}
            onChange={this.handleAnswerCChange.bind(this)}
            placeholder="Maybe" />
          </label>

          <label>
            Correct:
            <input 
            name="correct"
            type="number"
            value={this.state.correct}
            onChange={this.handleCorrectChange.bind(this)}
            placeholder="0" />
          </label>
          <br />
          
          </form>

          <button className="submit-button" onClick={this.question.bind(this)}>Question</button>

          <button className="submit-button" onClick={this.answerA.bind(this)}>Answer_A</button>
          
          <button className="submit-button" onClick={this.answerB.bind(this)}>Answer_B</button>

          <button className="submit-button" onClick={this.answerC.bind(this)}>Answer_C</button>

          <button className="submit-button" onClick={this.correct.bind(this)}>Correct</button>
      </div>
    );
  }
}

export default App;