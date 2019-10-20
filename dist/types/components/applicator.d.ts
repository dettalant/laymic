import Laymic from "#/components/core";
export default class LaymicApplicator {
    laymicMap: Map<string, Laymic>;
    constructor(selector?: string);
    open(viewerId: string): void;
    close(viewerId: string): void;
}
