import {ProjectOptions} from "pango";

export interface GitVersionOptions {
    fileName: string;
    outputFile?: string;
}

export function getGitVersionOptions(projectOptions: ProjectOptions): GitVersionOptions {
    return projectOptions.gitVersion = {
        fileName: 'version.h',
        ...(projectOptions.gitVersion),
    };
}
