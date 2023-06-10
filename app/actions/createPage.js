import inquirer from "inquirer";
import {capitalize} from "../helper/utils.js";
import {createPageFile} from "./createPageFile.js";

/**
 * @typedef {Object} FlagArgs
 * @property {boolean} [isClient] - Flag indicating if it is a client page.
 * @property {boolean} [isServer] - Flag indicating if it is a server page.
 * @property {boolean} [isCached] - Flag indicating if the page is cached.
 * @property {boolean} [isDynamic] - Flag indicating if the page is dynamic.
 * @property {boolean} [fetchData] - Flag indicating if the page fetches data.
 */

/**
 * Create a page.
 * @param {FlagArgs} flagArgs - The flag arguments for creating the page.
 * @returns {Promise<void>}
 */
export default async function createPage(flagArgs) {
    // check for server or client page
    let isClientPage
    const noFlagsForPage = !flagArgs?.isClient && !flagArgs?.isServer
    const bothFlagsForPage = flagArgs?.isClient && flagArgs?.isServer
    if (noFlagsForPage || bothFlagsForPage) {
        const answer = await inquirer.prompt([
                                                 {
                                                     type: 'list',
                                                     name: 'typeOfPage',
                                                     message: 'Is it a client or server page?',
                                                     choices: ['client', 'server']
                                                 },
                                             ]);
        isClientPage = answer.typeOfPage === 'client'
    }
    if (flagArgs?.isClient) {
        isClientPage = true
    }
    else if (flagArgs?.isServer) {
        isClientPage = false
    }

    // check if page is statically cached or dynamically cached
    let isCached
    const noFlagsForCache = !flagArgs?.isCached && !flagArgs?.isDynamic
    const bothFlagsForCache = flagArgs?.isCached && flagArgs?.isDynamic
    if (noFlagsForCache || bothFlagsForCache) {
        const answer = await inquirer.prompt([
                                                 {
                                                     type: 'list',
                                                     name: 'cacheType',
                                                     message: 'Is the page cached or dynamic?',
                                                     choices: ['cached', 'dynamic']
                                                 },
                                             ]);
        isCached = answer.cacheType === 'cached';
    }
    if (flagArgs?.isCached) {
        isCached = true
    }
    else if (flagArgs?.isDynamic) {
        isCached = false
    }

    // check if page fetches data
    let isFetching
    const noFlagsForFetch = !flagArgs?.fetchData
    if (noFlagsForFetch) {
        const answer = await inquirer.prompt([
                                                 {
                                                     type: 'confirm',
                                                     name: 'fetchType',
                                                     message: 'Does the page fetch data?',
                                                 },
                                             ]);
        isFetching = answer.fetchType;
    }
    else if (flagArgs?.fetchData) {
        isFetching = true
    }
    else {
        isFetching = false
    }


    const pageNamePrompt = await inquirer.prompt([
                                                     {
                                                         type: 'input',
                                                         name: 'pageName',
                                                         message: 'Enter the name of the page:'
                                                     },
                                                 ]);
    const pageName = pageNamePrompt.pageName;

    const updateMetaPrompt = await inquirer.prompt([

                                                       {
                                                           type: 'confirm',
                                                           name: 'updateMeta',
                                                           message: 'Do you want to update the metadata?'
                                                       },
                                                       // Add more questions as needed
                                                   ]);
    const updateMeta = updateMetaPrompt.updateMeta;

    // Generate the page based on the answers
    const pageContent = `
    ${isClientPage ? "\'use client\'" : ""}

    import React from "react";
    
    export const dynamic = ${!isCached ? "\'force-dynamic\'" : "\'force-cache\'"};
    
    ${updateMeta ? `export const metadata = { title: "${pageName}",
              description: "This is the ${pageName} page",
                keywords: "react,ssr,react-ssr,${pageName}",
                } ` : ""}
    
   export default ${isFetching ? 'async' : ""} function ${capitalize(pageName)}() {

  ${isFetching ? `
        const promise = await fetch("https://jsonplaceholder.typicode.com/todos/1")
        const data = await promise.json()
  ` : ""}
   
   return (
         <div>
            <h1>${capitalize(pageName)}</h1>
            ${isFetching && `<p>{JSON.stringify(data)}</p>`}
        </div>
            )
    }
`


    const summary = {
        'Page Type': isClientPage ? 'Client' : 'Server',
        'Cache Type': isCached ? 'Cached' : 'Dynamic',
        'Data Fetching': isFetching ? 'Yes' : 'No',
        'Page Name': pageName,
        'Update Metadata': updateMeta ? 'Yes' : 'No'
    };

    console.table(summary);

    await createPageFile(pageName, pageContent);
}

// Helper function to create files with given content

