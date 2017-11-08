import {ProjectOptions, Target, Tasks} from "pango";
import {COMPONENT_NAME} from "./VersionComponent";
import {CreateVersionHTask} from "./CreateVersionHTask";

export class VersionBuildTarget extends Target {
    getTasks(projectOptions: ProjectOptions): Promise<Tasks> {
        return Promise.resolve({
            'version.h': new CreateVersionHTask(projectOptions.components[COMPONENT_NAME])
        })
    }
}