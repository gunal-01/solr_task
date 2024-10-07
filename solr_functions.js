const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const csv = require('csv-parser');
const path = require('path');
// Solr base URL
const SOLR_BASE_URL = 'http://localhost:8983/solr';

// 1. Create Core Collection
async function createCore(coreName) {
    try {
        const response = await axios.get(`${SOLR_BASE_URL}/admin/cores?action=CREATE&name=${coreName}&instanceDir=${coreName}`);
        console.log(`Core ${coreName} created successfully:`, response.data);
    } catch (error) {
        console.error(`Error creating core ${coreName}:`, error.response ? error.response.data : error.message);
    }
}

// 2. Index Data (excluding a column)

async function indexData(coreName, csvFilePath) {
    try {
        // Log the CSV file path for debugging
        console.log(`Indexing data from file: ${csvFilePath} into collection: ${coreName}`);
        
        // Read the CSV file
        const data = fs.readFileSync(csvFilePath, 'utf8');
        
        // Split the CSV data into rows and then into columns (implement your indexing logic here)
        const rows = data.split('\n');
        for (let row of rows) {
            const columns = row.split(','); // Assuming comma-separated values
            // Implement logic to index data into Solr, excluding specific columns if needed
            // Example:
            const jsonData = {
                Department: columns[0], // Adjust based on your CSV structure
                Gender: columns[1] // Adjust based on your CSV structure
                // ...other fields
            };
            // Send jsonData to Solr for indexing
            await axios.post(`${SOLR_BASE_URL}/${coreName}/update?commit=true`, jsonData, {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log(`Data indexed successfully into core ${coreName}`);
    } catch (error) {
        console.error(`Error indexing data into core ${coreName}:`, error);
    }
}

// 3. Search by Column
async function searchByColumn(coreName, columnName, columnValue) {
    try {
        const response = await axios.get(`${SOLR_BASE_URL}/${coreName}/select?q=${columnName}:${columnValue}&wt=json`);
        console.log(`Search results for ${columnName}=${columnValue}:`, response.data.response.docs);
    } catch (error) {
        console.error(`Error searching in core ${coreName}:`, error.response ? error.response.data : error.message);
    }
}

// 4. Get Employee Count
async function getEmpCount(collectionName) {
    try {
        const response = await axios.get(`${SOLR_BASE_URL}/${collectionName}/select?q=*:*&rows=0&wt=json`);
        console.log(`Employee count for collection ${collectionName}:`, response.data.response.numFound);
    } catch (error) {
        console.error(`Error getting employee count for ${collectionName}:`, error.response ? error.response.data : error.message);
    }
}

// 5. Delete Employee by ID
async function delEmpById(collectionName, employeeId) {
    try {
        const response = await axios.post(`${SOLR_BASE_URL}/${collectionName}/update?commit=true`, [
            { "delete": { "id": employeeId } }
        ], { headers: { 'Content-Type': 'application/json' } });
        console.log(`Employee ${employeeId} deleted successfully from ${collectionName}:`, response.data);
    } catch (error) {
        console.error(`Error deleting employee ${employeeId}:`, error.response ? error.response.data : error.message);
    }
}

// 6. Get Department Facets
async function getDepFacet(collectionName) {
    try {
        const response = await axios.get(`${SOLR_BASE_URL}/${collectionName}/select?q=*:*&facet=true&facet.field=Department&wt=json`);
        console.log(`Department facet counts for ${collectionName}:`, response.data.facet_counts.facet_fields.Department);
    } catch (error) {
        console.error(`Error getting department facet for ${collectionName}:`, error.response ? error.response.data : error.message);
    }
}

module.exports = {
    createCore,
    indexData,
    searchByColumn,
    getEmpCount,
    delEmpById,
    getDepFacet
};
