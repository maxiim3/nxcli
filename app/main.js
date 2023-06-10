import yargs from "yargs/yargs";
import {hideBin} from "yargs/helpers";
import createPage from "./actions/createPage.js";
import createRoute from "./actions/route.js";
import createComponent from "./actions/component.js";
import inquirer from "inquirer";
import {getConfig, init} from "./config/getconfig.js";
// import {createPage} from "./page.js";
// import {createRoute} from "./route.js";
// import {createComponent} from "./component.js";

/**
 * @description Main function is the entry point of the CLI
 * We will check the flags and the command of the user and call the appropriate method.
 * @return {Promise<void>}
 */
async function main() {
    const argv = yargs(hideBin(process.argv)).argv;

    // Check if the configuration file exists, and create it if it doesn't
    if (await getConfig() === null && argv._[0] !== 'init') {
        await init();
    }

    if (argv._[0] === 'init') {
        await init();
        return;
    }

    if (argv?.page) {
        await createPage(argv);
    }
    else if (argv?.route) {
        await createRoute(argv)
    }
    else if (argv?.component) {
        await createComponent(argv)
    }
    else {
        const {action} = await inquirer.prompt([
                                                   {
                                                       type: 'list',
                                                       name: 'action',
                                                       message: 'What do you want to create? (ctrl-c to exit)',
                                                       choices: ['Page', 'Route', 'Component'],
                                                   },
                                               ]);

        switch (action) {
            case 'Page':
                await createPage(argv);
                break;
            case 'Route':
                await createRoute(argv)
                break;
            case 'Component':
                await createComponent(argv)
                break;
        }
    }
}

export default main
