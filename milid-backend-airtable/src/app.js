
const extractRawAirtable = require('./extract_raw_airtable');

const { writeFileSync } = require('fs');


const { emptyDirSync } = require('fs-extra');

const lessonTransformer = require('./lessonTransformer');
const moduleTransfomer = require('./moduleTransformer');

async function main(){
    try{

        const airtableData = await extractRawAirtable();


        // transform and massage the data
        const step1 = lessonTransformer(airtableData);
        const data = moduleTransfomer(step1);
        
        emptyDirSync('./dist');
        
        // write raw airtable structure for reference
        writeFileSync('./dist/airtable_data.json', JSON.stringify(airtableData, null, 2), { encoding: 'utf-8' });
        
        // result to be improved on
        writeFileSync('./dist/data.json', JSON.stringify(data, null, 2), { encoding: 'utf-8' });

        console.log("all done");
    }catch(e){
        console.log("proccess stopped with error", e);
        process.exit(1);
    }
}

main();
