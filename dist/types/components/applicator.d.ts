import Laymic from "#/components/core";
import { LaymicOptions } from "#/interfaces";
export default class LaymicApplicator {
    laymicMap: Map<string, Laymic>;
    constructor(selector?: string, initOptions?: LaymicOptions);
    open(viewerId: string): void;
    close(viewerId: string): void;
}
