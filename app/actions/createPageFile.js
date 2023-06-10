import {getConfig} from "../config/getconfig.js";
import inquirer from "inquirer";
import path from "path";
import fs from "fs";

export async function createPageFile(pageName, content) {
    const config = await getConfig();
    let dirPath = config.defaultPagePath;

    const {useDefaultPath} = await inquirer.prompt([
                                                       {
                                                           type: 'confirm',
                                                           name: 'useDefaultPath',
                                                           message: 'Do you want to use the default path?',
                                                       },
                                                   ]);

    if (!useDefaultPath) {
        const {customPath} = await inquirer.prompt([
                                                       {
                                                           type: 'input',
                                                           name: 'customPath',
                                                           message: 'Enter your custom path:',
                                                           validate: input => input.trim() !== "" ? true : "The path can't be empty."
                                                       },
                                                   ]);

        dirPath = customPath;
    }

    const directoryPath = path.join(dirPath, pageName);
    const filePath = path.join(directoryPath, 'page.tsx');

    if (fs.existsSync(directoryPath)) {
        const {overwriteDirectory} = await inquirer.prompt([
                                                               {
                                                                   type: 'confirm',
                                                                   name: 'overwriteDirectory',
                                                                   message: 'The directory already exists. Do you want to overwrite it?',
                                                                   default: false
                                                               },
                                                           ]);

        if (overwriteDirectory) {
            fs.rmdir(directoryPath, {recursive: true});
            fs.mkdirSync(directoryPath, {recursive: true});
        }
    }
    else {
        fs.mkdirSync(directoryPath, {recursive: true});
    }

    if (fs.existsSync(filePath)) {
        const {overwriteFile} = await inquirer.prompt([
                                                          {
                                                              type: 'confirm',
                                                              name: 'overwriteFile',
                                                              message: 'The file already exists. Do you want to overwrite it?',
                                                              default: false
                                                          },
                                                      ]);

        if (overwriteFile) {
            fs.writeFileSync(filePath, content);
            console.log(`Successfully created the file at ${filePath}`);
        }
        else {
            console.log(`Aborted. The file already exists at ${filePath}`);
        }
    }
    else {
        fs.writeFileSync(filePath, content);
        console.log(`Successfully created the file at ${filePath}`);
    }
}
