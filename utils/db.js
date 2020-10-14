import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);

const db = SQLite.openDatabase(
    {
      name: 'data',
      location: 'default',
      createFromLocation: '~data.db',
    },
    () => {},
    error => {
      console.log(error);
    }
);

export function ExecuteQuery(sql, params){
    return new Promise((resolve, reject) =>{
        db.transaction(tx => {
            tx.executeSql(sql, params, (tx, results) => resolve(results), error => reject(error))
        })
    });
}

export function ExecuteSelectQuery(sql, params){
    return ExecuteQuery(sql, params).then(results => {
        const data = [];
        for(let i = 0; i < results.rows.length; ++i)
            data.push(results.rows.item(i));
        return data;
    });
}