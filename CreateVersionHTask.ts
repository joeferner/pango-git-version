import {Task, TaskOptions, ProjectOptions} from "pango";
import {ComponentOptions} from "pango-components";
import * as fs from "fs-extra";
import * as path from "path";
import {COMPONENT_NAME} from "./VersionComponent";
import {VersionComponentOptions} from "./VersionComponentOptions";
import * as childProcess from "child-process-promise";
import * as ejs from "ejs";

const spawn = childProcess.spawn;

export class CreateVersionHTask extends Task {
    private componentOptions: ComponentOptions;

    constructor(componentOptions: ComponentOptions) {
        super();
        this.componentOptions = componentOptions;
    }

    run(taskOptions: TaskOptions): Promise<void> {
        const componentOptions: VersionComponentOptions = taskOptions.projectOptions.components[COMPONENT_NAME];
        return Promise.all([
            fs.mkdirs(path.dirname(componentOptions.versionFile)),
            spawn('git', ['rev-parse', 'HEAD'], {capture: ['stdout', 'stderr']}),
            spawn('git', ['describe', '--abbrev=0', '--tags'], {capture: ['stdout', 'stderr']}).catch(err => {
                taskOptions.log.warn('no git tags found');
                return {};
            }),
            this.loadTemplate()
        ]).then((results) => {
            const gitHash = (results[1].stdout || '').trim();
            const gitTag = (results[2].stdout || '').trim();
            const template = results[3];
            const content = template({
                gitHash,
                gitTag
            });
            return fs.writeFile(componentOptions.versionFile, content);
        });
    }

    getPostRequisites(projectOptions: ProjectOptions): string[] {
        return ['compile'];
    }

    private loadTemplate() {
        return fs.readFile(path.join(__dirname, '../../version.h.ejs'), 'utf8')
            .then(template => {
                return ejs.compile(template);
            });
    }
}
