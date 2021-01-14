import { parse as parseURL } from "url";
import { StreamAuth, StreamAuthFactory } from "./interfaces";

export interface NginxCallbackBody {
    call?: string;

    /**
     * client IP address
     */
    addr?: string;

    /**
     * nginx client id (displayed in log and stat)
     */
    clientid?: string;

    /**
     * application name
     */
    app?: string;

    /**
     * client flash version
     */
    flashver?: string;

    /**
     * client swf url
     */
    swfurl?: string;

    tcurl?: string;
    /**
     * client page url
     */
    pageurl?: string;

    /**
     * stream name
     */
    name?: string;

    /**
     * application type
     */
    type?: string;
}

export class NginxAuthFactory implements StreamAuthFactory {
    getBody(req: Request): StreamAuth {
        const body = req.body as NginxCallbackBody; 
        const queryObj = parseURL(body.swfurl, true).query;
        const args = {};
        Object.keys(queryObj).forEach(queryKey => {
            args[queryKey] = queryObj[queryKey];
        });
        return {
            stream_id: args["stream_id"],
            key: body.name
        }
    }
}