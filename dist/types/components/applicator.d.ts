import Laymic from "./core";
import { LaymicOptions, LaymicApplicatorOptions } from "../interfaces/index";
export default class LaymicApplicator {
    laymicMap: Map<string, Laymic>;
    constructor(selector?: string | LaymicApplicatorOptions, laymicOptions?: LaymicOptions);
    private readonly defaultLaymicApplicatorOptions;
    private applyLaymicInstance;
    open(viewerId: string): void;
    close(viewerId: string): void;
}
