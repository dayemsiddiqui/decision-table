import * as inquirer from 'inquirer';
import { Repository } from './repository';
import { Reporting } from './reporting';

const main = () => {
  console.log('Jest Decision Record');
  console.log('====================');
  start();
};

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
            new Reporting().print(table);
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
    type: 'list',
    name: 'fill',
    message: 'Do you want to update the decision table?',
    choices: ['y', 'n'],
  };
  inquirer
    .prompt([question])
    .then((answer) => {
      if (answer.fill === 'y') {
        console.log('Decision Table Updated');
      }
    })
    .catch((err) => {
      console.warn('Oops something went wrong!');
    })
    .finally(() => {
      console.log('Exiting! Goodbye!');
    });
};

main();
