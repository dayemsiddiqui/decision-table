
import {TableGenerator} from './generator';
import {DecisionTable} from "./models";
import {Repository} from "./repository";
import {Reporting} from "./reporting";

const generator = new TableGenerator({
    status: ['open', 'completed'],
    hasConflict: [true, false],
});

const table: DecisionTable = generator.generate();

const reporting = new Reporting()

const repo = new Repository()
const test = async () => {
    await repo.rehydrate()
    reporting.print(repo.getTable())
}

test()
