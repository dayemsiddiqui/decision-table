import * as inquirer from 'inquirer';
import { Repository } from './repository';
import { Reporting } from './reporting';
import { AutoComplete } from './generator';

const main = () => {
  console.log('Jest Decision Record');
  console.log('====================');
  start();
};

const reporting = new Reporting();

const start = () => {
  const question = {
    type: 'list',
    name: 'action',
    message: 'Select the action you want to take',
    choices: ['Print Table', 'Fill Table', 'Exit'],
  };
  inquirer
    .prompt([question])
    .then((answer) => {
      if (answer.action === 'Print Table') {
        const repo = new Repository();
        repo
          .rehydrate()
          .then(() => {
            const table = repo.getTable();
            reporting.print(table);
          })
          .finally(() => main());
      }
      if (answer.action === 'Fill Table') {
        fillTable();
      }
      if (answer.exit === 'Exit') {
        console.log('Exiting! Goodbye!');
        process.abort();
      }
    })
    .catch((err) => {
      console.warn("Oops something went wrong! Let's try again");
      main();
    });
};

const fillTable = () => {
  const question = {
    type: 'input',
    name: 'fieldName',
    message: 'Type the field name you want to add or update',
  };
  inquirer
    .prompt([question])
    .then((answer) => {
      if (answer.fieldName) {
        new Repository().rehydrate().then((table) => {
          const autoComplete = new AutoComplete(table);
          if (autoComplete.hasNext()) {
              const record = autoComplete.currentRecord();
              reporting.print([record]);
              const progress = autoComplete.progress();
              console.log(`Progress: ${progress.current}/${progress.total} Done`)
            updateRecord(answer.fieldName, autoComplete);
          }
        });
      }
    })
    .catch((err) => {
      console.warn('Oops something went wrong!');
    });
};

function updateRecord(fieldName: string, autoComplete: AutoComplete) {
  const question = {
    type: 'input',
    name: 'value',
    message: 'Type value of the field for following row: \n',
  };
  inquirer
    .prompt([question])
    .then((answer) => {
      if (answer.value) {
        autoComplete.update(fieldName, answer.value);
      }
      if (autoComplete.hasNext()) {
          const record = autoComplete.currentRecord();
          reporting.print([record]);
          const progress = autoComplete.progress();
          console.log(`Progress: ${progress.current}/${progress.total} Done`)
          updateRecord(fieldName, autoComplete)
      } else {
          autoComplete.persist()
          console.log('Persisted')
          main()
      }
    })
    .catch((err) => {
      console.warn('Oops something went wrong!');
    });
}

main();
