import {Component} from "pango-components";
import {ProjectOptions} from "pango";
import * as path from "path";
import {VersionBuildTarget} from "./VersionBuildTarget";
import {VersionComponentOptions} from "./VersionComponentOptions";

export const COMPONENT_NAME = 'git-version';

export class VersionComponent implements Component {
    public name: string;

    constructor() {
        this.name = COMPONENT_NAME;
    }

    init(projectOptions: ProjectOptions): Promise<void> {
        let versionHFile = path.resolve(projectOptions.buildDir, 'version', 'version.h');
        const componentOptions: VersionComponentOptions = projectOptions.components[this.name];
        componentOptions.includeDirs.push(path.dirname(versionHFile));
        componentOptions.targets.build = new VersionBuildTarget();
        componentOptions.versionFile = versionHFile;
        return Promise.resolve();
    }
}
