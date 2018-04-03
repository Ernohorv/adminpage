import React, { Component } from 'react';
import firebase, { firestore } from 'firebase';
import 'firebase/firestore';

import '../node_modules/grommet-css'
import GrommetApp from 'grommet/components/App';
import Button from 'grommet/components/Button';
import LaunchIcon from 'grommet/components/icons/base/Launch';
import EditIcon from 'grommet/components/icons/base/Edit';
import TrashIcon from 'grommet/components/icons/base/Trash';
import AddIcon from 'grommet/components/icons/base/Add';
import CloseIcon from 'grommet/components/icons/base/Close';
import ClockIcon from 'grommet/components/icons/base/Clock';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import TextInput from 'grommet/components/TextInput';
import Box from 'grommet/components/Box';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import TableHeader from 'grommet/components/TableHeader';
import Layer from 'grommet/components/Layer';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import RadioButton from 'grommet/components/RadioButton';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lobbyOpen: false,
      ready: false,
      endGame: false,
      question: '',
      correct: [true, false, false],
      validated: [false, false, false],
      answer_a: '',
      answer_b: '',
      answer_c: '',
      questions : [],
      layerActive: false,
      addNew: false,
      docID: '',
    }
    this.timerID;
    this.questionsRef = firebase.firestore().collection("Games").doc("Game1").collection("Questions");
    this.startRef = firebase.firestore().collection("Start").doc("Ready");
  }

  componentWillMount(){
    this.questionsRef.onSnapshot((querySnapshot) => {
        var items = [];
        querySnapshot.forEach((doc) =>{
            items.push(
              {
                'Question': doc.data().Question,
                'A': doc.data().Answer_A,
                'B': doc.data().Answer_B,
                'C': doc.data().Answer_C,
                'Correct': doc.data().Correct,
                'ID': doc.id
              }
            );
        });
        this.setState({
          questions: items,
        });
    });

    this.startRef.onSnapshot((doc) => {
      this.setState({
        ready: doc.data().Ready,
        lobbyOpen: doc.data().LobbyOpen,
        endGame: doc.data().EndGame,
      });
    });
  }

  onClickStart() {
    this.startRef.update({
      Ready: false,
      LobbyOpen: true,
      })
    .then(() => {
       this.timerID = setTimeout(() => {
        this.startRef.update({
          Ready: true,
          LobbyOpen: false,
          })
      }, 15000);
    });
  }

  onClickClose(){
    clearTimeout(this.timerID);
    this.onClickEnd();
  }

  onClickEnd(){
    this.startRef.update({
      Ready: false,
      LobbyOpen: false,
      });
  }

  onLayerOpen(addNew) {
    this.setState({
      addNew: addNew,
      layerActive: true
    });
  }  

  onLayerClose() {
    this.setState({
      layerActive: false,
      question: '',
      answer_a: '',
      answer_b: '',
      answer_c: '',
      correct: [true, false, false],
    });
  }

  onChangedQuestion(event){
    this.setState({
      question: event.target.value
    });
  }

  onChangedAnswerA(event){
    this.setState({
      answer_a: event.target.value
    });
  }

  onChangedAnswerB(event){
    this.setState({
      answer_b: event.target.value
    });
  }

  onChangedAnswerC(event){
    this.setState({
      answer_c: event.target.value
    });
  }

  onChangedCorrect(event){
    let correctAns = [false, false, false];
    let id = parseInt(event.target.id.replace('correct-',''), 10);
    correctAns[id-1] = true;
    this.setState({
      correct: correctAns
    });
  }

  addQuestion(){
    let correct = this.state.correct.findIndex(function (el) {
      return el === true;
    });
    let id = "Q" + (this.state.questions.length + 1);
    this.questionsRef.doc(id).set({
      Question: this.state.question,
      Answer_A: this.state.answer_a,
      Answer_B: this.state.answer_b,
      Answer_C: this.state.answer_c,
      Correct: correct.toString(),
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
    this.onLayerClose();
  }

  deleteQuestion(id){
    let questions = this.state.questions;
    let lastID = "Q" + questions.length;
    let removable = questions.findIndex(function (el) {
      return el.ID === id;
    });
    questions.splice(0, removable + 1);
    for(let i = 0; i < questions.length; i++){
      questions[i].ID = "Q" + (i + removable + 1);
    }
    console.log(questions);
    questions.forEach(question => {
      this.questionsRef.doc(question.ID).set({
        Question: question.Question,
        Answer_A: question.A,
        Answer_B: question.B,
        Answer_C: question.C,
        Correct: question.Correct.toString(),
      })
    });
    this.questionsRef.doc(lastID).delete().then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }

  openEditQuestion(id){
    let question = this.state.questions.find(function (el) {
      return el.ID === id;
    });
    let correctAns = [false, false, false];
    correctAns[question.Correct] = true;
    this.setState({
      question: question.Question,
      answer_a: question.A,
      answer_b: question.B,
      answer_c: question.C,
      correct: correctAns,
      docID: id,
    });
    this.onLayerOpen(false);
  }

  editQuestion(){
    let correct = this.state.correct.findIndex(function (el) {
      return el === true;
    });
    this.questionsRef.doc(this.state.docID).set({
      Question: this.state.question,
      Answer_A: this.state.answer_a,
      Answer_B: this.state.answer_b,
      Answer_C: this.state.answer_c,
      Correct: correct.toString(),
    })
    .then(function(docRef) {
      console.log("Document edited with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
    this.onLayerClose();
  }

  render() {
    const startButton = (this.state.ready) ? (
      <Button icon={<CloseIcon />}
        label='Cancel game'
        onClick={this.onClickEnd.bind(this)}
        critical={true}
        align='center' />
    ) : (this.state.lobbyOpen) ? (
      <Button icon={<ClockIcon />}
        label='Close lobby'
        onClick={this.onClickClose.bind(this)}
        critical={true}
        align='center' />
    ) : (
      <Button icon={<LaunchIcon />}
        label='Start game'
        onClick={this.onClickStart.bind(this)}
        primary={true}
        align='center' /> 
    )

    const heading = (this.state.addNew) ? (
      <Heading>Add question</Heading>
    ) : (
      <Heading>Edit question</Heading>
    )
    const button = (this.state.addNew) ? (
      <Button label='Add'
                type='button'
                primary={true}
                onClick={this.addQuestion.bind(this)} />
    ) : (
      <Button label='Edit'
                type='button'
                primary={true}
                onClick={this.editQuestion.bind(this)} />
    )
    const layer = (this.state.layerActive) ? (
        <Layer onClose={this.onLayerClose.bind(this)} overlayClose={true} closer={true} align={"center"}>
          <Form>
            <Header>
              {heading}
            </Header>
              <FormField label='Question'>
                <TextInput onDOMChange={(evt) => this.onChangedQuestion(evt)} value={this.state.question} />
              </FormField>
              <FormField label='Answer 1'>
                <TextInput onDOMChange={(evt) => this.onChangedAnswerA(evt)} value={this.state.answer_a} />
              </FormField>
              <FormField label='Answer 2'>
                <TextInput onDOMChange={(evt) => this.onChangedAnswerB(evt)} value={this.state.answer_b} />
              </FormField>
              <FormField label='Answer 3'>
                <TextInput onDOMChange={(evt) => this.onChangedAnswerC(evt)} value={this.state.answer_c} />
              </FormField>
              <FormField label='Correct answer'>
              <RadioButton id='correct-1'
                label='Answer 1'
                checked={this.state.correct[0]}
                onChange={(evt) => this.onChangedCorrect(evt)} />
              <RadioButton id='correct-2'
                label='Answer 2'
                checked={this.state.correct[1]}
                onChange={(evt) => this.onChangedCorrect(evt)} />
              <RadioButton id='correct-3'
                label='Answer 3'
                checked={this.state.correct[2]}
                onChange={(evt) => this.onChangedCorrect(evt)} />
            </FormField>
            <Footer pad={{"vertical": "medium"}}>
              {button}
            </Footer>
          </Form>
        </Layer>
    ) : undefined;

    return (
      <GrommetApp>
        <Section>
          <Box align='center'>
            {startButton}
            </Box>
            <Table scrollable={false}>
              <TableHeader labels={['Question', 'Answer 1', 'Answer 2', 'Answer 3', 'Correct', 'Actions']} />
              <tbody>
              {this.state.questions.map(function(question) {
                return(
                  <TableRow>
                  <td>
                    {question.Question}
                  </td>
                  <td>
                    {question.A}
                  </td>
                  <td>
                    {question.B}
                  </td>
                  <td>
                    {question.C}
                  </td>
                  <td>
                    {parseInt(question.Correct, 10) + 1}
                  </td>
                  <td>
                    <Button icon={<EditIcon />} onClick={this.openEditQuestion.bind(this, question.ID)} />
                    <Button icon={<TrashIcon />} onClick={this.deleteQuestion.bind(this, question.ID)} />
                  </td>
                  </TableRow>
                );
              }.bind(this))
              }
              <TableRow>
                  <td>
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                  <td>
                    <Button icon={<AddIcon />} onClick={this.onLayerOpen.bind(this, true)}/>
                  </td>
                  </TableRow>
              </tbody>
            </Table>
        </Section>
        {layer}
      </GrommetApp>
    );
  }
}

export default App;