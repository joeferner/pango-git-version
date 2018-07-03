import {ProjectOptions, Target, Targets} from "pango";
import {getGitVersionOptions} from "./GitVersionOptions";
import * as fs from "fs-extra";
import * as path from "path";
import * as ejs from "ejs";
import * as NestedError from "nested-error-stacks";
import * as childProcess from "child-process-promise";

const spawn = childProcess.spawn;

export class GitVersionTarget implements Target {
    postRequisites = ['generate-sources'];

    async run(projectOptions: ProjectOptions): Promise<void | Targets | string[]> {
        if (!projectOptions.buildDir) {
            throw new Error(`Missing "buildDir" configuration.`);
        }

        const options = getGitVersionOptions(projectOptions);
        options.outputFile = options.outputFile || path.join(projectOptions.buildDir, 'git-version', options.fileName);
        await fs.mkdirs(path.dirname(options.outputFile));

        const [gitHash, gitTag, template] = await Promise.all([
            spawn('git', ['rev-parse', 'HEAD'], {capture: ['stdout', 'stderr']}),
            spawn('git', ['describe', '--abbrev=0', '--tags'], {capture: ['stdout', 'stderr']}).catch(err => {
                projectOptions.logger.warn('no git tags found');
                return {};
            }),
            this.loadTemplate()
        ]);
        const content = template({
            gitHash: (gitHash.stdout || '').trim(),
            gitTag: (gitTag.stdout || '').trim()
        });
        await fs.writeFile(options.outputFile, content);

        projectOptions.includeDirs = projectOptions.includeDirs || [];
        projectOptions.includeDirs.push(path.dirname(options.outputFile));
    }

    private async loadTemplate() {
        const versionFileName = path.join(__dirname, '../../version.h.ejs');
        const template = await fs.readFile(versionFileName, 'utf8');
        try {
            return ejs.compile(template);
        } catch (err) {
            throw new NestedError(`Could not compile ejs "${versionFileName}"`, err);
        }
    }
}
