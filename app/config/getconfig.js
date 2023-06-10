import path from 'path';
import fs from 'fs';


export async function getConfig() {
    const configPath = path.resolve('nxcli.config.js');
    if (!fs.existsSync(configPath)) {
        return null;
    }

    const configModule = await import(configPath);
    return configModule.default;
}

export async function init() {
    const configPath = path.resolve('nxcli.config.js');

    if (fs.existsSync(configPath)) {
        console.log('nxcli.config.js already exists.');
        return;
    }

    const configContent = `

export default {
  defaultPath: "./src"
};

  `;

    fs.writeFileSync(configPath, configContent);
    console.log('Created nxcli.config.js.');
}
