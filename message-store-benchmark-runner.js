
import { CozoClosableAdapter, MessageStoreCozo } from 'dwn-cozo-store';
import { runMessageStoreBenchmark } from './message-store-benchmark.js';
import { MessageStoreLevel }  from '@tbd54566975/dwn-sdk-js';
import { SqliteDialect, MessageStoreSql} from '@tbd54566975/dwn-sql-store';
import Database from 'better-sqlite3';
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
async function main() {
const runId = `${Date.now()}-${getRandomInt(1000)}`;

//const rocksdb = new CozoClosableAdapter('rocksdb', './rocksdb');
const results = {};

//const rocksMessageStore = new MessageStoreCozo(rocksdb);
//const rocksResults = await runMessageStoreBenchmark(rocksMessageStore);
//results['rocksdb'] = rocksResults;

const sqliteCozo = new CozoClosableAdapter('sqlite', `${runId}-cozo-test.db`);
const sqliteMessageStore = new MessageStoreCozo(sqliteCozo);
const sqliteResults = await runMessageStoreBenchmark(sqliteMessageStore);
results['sqlite'] = sqliteResults;

const mem = new CozoClosableAdapter('mem');
const memMessageStore = new MessageStoreCozo(mem);
const memResults = await runMessageStoreBenchmark(memMessageStore);
results['mem'] = memResults;

const sqliteDialect = new SqliteDialect({
  database: async () => new Database(`${runId}-sql-dwn.sqlite`, {
    fileMustExist: false,
  })
});

const sqlmessageStore = new MessageStoreSql(sqliteDialect);

const sqlResults = await runMessageStoreBenchmark(sqlmessageStore);
results['sql'] = sqlResults;

const messageStore = new MessageStoreLevel({
  blockstoreLocation : `${runId}-BENCHMARK-BLOCK`,
  indexLocation      : `${runId}-BENCHMARK-INDEX`,
});
const levelResults = await runMessageStoreBenchmark(messageStore);
results['level'] = levelResults;



console.log(JSON.stringify(results, null, 2));
}

main().then().catch(console.error);



