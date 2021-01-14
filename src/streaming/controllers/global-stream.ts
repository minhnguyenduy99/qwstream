import { Body, Controller, Get, Query } from "@nestjs/common";
import { ParsePagePipe } from "@helpers/pagination";
import { StreamSearchInput, GlobalStreamViewService } from "../services";


@Controller("streams")
export class GlobalStreamController {

    constructor(
        private readonly globalStreamView: GlobalStreamViewService
    ) {
    }

    // @Get()
    // async getCurrentStreamingInfo(
    //     @Query("page", new ParseIntPipe()) page: number, 
    //     @Body() search: StreamSearchInput
    // ) {
    //     const result = await this.globalStreamView.getListGlobalCurrentStreamingInfo(page, search);
    //     return result;
    // }

    // @Get("/old")
    // async getOldStreamingInfo(
    //     @Query("page", ParsePagePipe) page: number,
    //     @Body() search: StreamSearchInput
    // ) {
    //     const result = await this.globalStreamView.getGlobalOldStreamingInfo(page, search);
    //     return result;
    // }

    @Get("/search")
    async searchGlobal(
        @Query("page", ParsePagePipe) page: number,
        @Body() search: StreamSearchInput
    ) {
        const result = await this.globalStreamView.searchGlobalStreamingInfo(page, search);
        return result;
    }
}