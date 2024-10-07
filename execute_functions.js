const { createCore, indexData, searchByColumn, getEmpCount, delEmpById, getDepFacet } = require('./solr_functions');

// Define the collection names
const v_nameCollection = 'Hash_Gunal';
const v_phoneCollection = 'Hash_1234';

// Define CSV path (adjust path as per your environment)
const csvFilePath = 'C:/Users/Gunal/solr_task/CSV_data/archive/EmployeeSampleData1.csv';

(async () => {
    // Step a: Create Collections
    await createCore(v_nameCollection);
    await createCore(v_phoneCollection);

    // Step b: Get Employee Count
    await getEmpCount(v_nameCollection);

    // Step c: Index Data into Collections
    await indexData(v_nameCollection, csvFilePath, 'Department');
    await indexData(v_phoneCollection, csvFilePath, 'Gender');

    // Step d: Delete Employee by ID
    await delEmpById(v_nameCollection, 'E02003');

    // Step e: Get Employee Count again
    await getEmpCount(v_nameCollection);

    // Step f: Search by Column
    await searchByColumn(v_nameCollection, 'Department', 'IT');
    await searchByColumn(v_nameCollection, 'Gender', 'Male');
    await searchByColumn(v_phoneCollection, 'Department', 'IT');

    // Step g: Get Department Facets
    await getDepFacet(v_nameCollection, 'Department', 'IT');
    await getDepFacet(v_phoneCollection,'Department', 'HR');
})();
