import Questions from './Questions';

if (process.argv.length >= 3) {
  const questions: Questions = new Questions();
  /*if (process.argv[2] !== 'r' && process.argv[2] !== 'l')
    questions.initialQuestion();
  else {
    questions._from = process.argv[2];*/
    questions.fileEntered(process.argv[2]);
  //}
} else new Questions().initialQuestion();
