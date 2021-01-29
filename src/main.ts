import {printDecisionTable} from './reporting';
import {TableGenerator} from './generator';
import {DecisionTable} from "./models";
import {Repository} from "./repository";

const generator = new TableGenerator({
    status: ['open', 'completed'],
    hasConflict: [true, false],
});

const table: DecisionTable = generator.generate();

printDecisionTable(table);

const repo = new Repository();
repo.persist(table);
